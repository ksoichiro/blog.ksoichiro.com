---
title: "ElasticsearchのBouncing Results問題"
originalCreatedAt: 2016-12-31T22:46:00.001+09:00
tags: ["Elasticsearch","Spring Boot"]
---
Boucing Resultsという問題がある。検索結果に重複・欠落が起きる問題。

ソートのキーに使われる項目の値が同じdocumentがあると、検索結果の順序が一定にならない可能性がある。
Elasticsearchのクエリでページネーションを行う場合、各ページへのリクエストは独立しているので、それぞれのアクセスで別のシャードにアクセスする可能性がある。

- 対象のElasticsearchクラスタがレプリカを持っている
- ソート対象項目の値が同一の複数documentがページを跨っている
- それらのページへのリクエストが別のシャードに割り当てられる
- それぞれのシャードが対象のdocumentを返す順番が異なる

といった条件が揃うと、1ページ目で返された検索結果が次のページでも返ってくる、という事象が起きる。

これは、[Elasticsearch: The Definitive Guide](https://www.elastic.co/guide/en/elasticsearch/guide/current/_search_options.html) でも説明されている Bouncing Results という問題とのこと。

この問題と思われる事象に遭遇したため、事象の再現と対策の検証を行なった。

<!--more-->
### 再現

Elasticsearchのクラスタを用意する。
[ksoichiro/vagrant-templates](https://github.com/ksoichiro/vagrant-templates/)を使って3台のElasticsearchクラスタを立ち上げる。

```
$ cd vagrant-templates/centos71-elasticsearch
$ vagrant up es1 es2 es3
```

`number_of_replicas`は1に設定してある。

次に、データの投入。
Elasticsearchが提供しているサンプルデータ accounts.json を使い、Bulk APIで投入。  
投入後にhead pluginで確認すると以下のような状態。

![クラスタ](/img/2016-12-elasticsearchbouncing-results_1.png "head.png")

そして検索。
事象が再現しやすいように、ページのサイズを1にし、データの重複が多い "age" をそーと条件にして検索。
Spring Boot CLI のスクリプトで以下のように実装。(search.groovy)

```groovy
@Grab('groovy-all')
@Grab('org.codehaus.groovy.modules.http-builder:http-builder:0.7')

import groovy.json.*
import groovyx.net.http.*
import static groovyx.net.http.Method.*
import static groovyx.net.http.ContentType.*

@ConfigurationProperties(prefix = 'es')
class SearchConfigProperties {
    String host = '192.168.33.11'
    int port = 9200
}

@Component
class Search implements CommandLineRunner {
    @Autowired
    EsExportConfigProperties esConfig

    @Override
    void run(String... args) {
        def json = new JsonBuilder()
        def sortConditions = ["age"]
        json {
            from 0
            size 1
            explain true
            query {
              match_all {}
            }
            sort sortConditions
        }
        println "Query: ${json.toString()}"
        def http = new RESTClient("http://${esConfig.host}:${esConfig.port}/")
        def shards = http.get(path: '_cluster/state', contentType: JSON).data.routing_table.indices.bank.shards
        def hits = [:]
        def idx = 1
        while (true) {
            def result = http.post(path: 'bank/account/_search', contentType: JSON, body: json.toString()).data
            if (result.hits.hits.size() == 0) {
                break
            }
            result.hits.hits.each { hit ->
                if (!hits.containsKey(hit._id)) {
                    hits[hit._id] = [:]
                }
                hits[hit._id][idx] = "shard${hit._shard}(${shards[hit._shard.toString()].find { it.node == hit._node }.primary ? 'primary' : 'replica'})"
            }
            json.content.from += json.content.size
            idx++
        }
        def duplicates = hits.findAll { k, v -> v.size() > 1 }
        if (duplicates.size() == 0) {
            println "No duplicate result"
        } else {
            println "Duplicate results"
            duplicates.each { k, v ->
                println "_id: ${k} -> ${v.size()} times: ${v}"
            }
        }
    }
}
```

データの格納状況によっては、以下のように重複データがずらっと表示される。
documentの_idが複数回登場したものについて、回数と、その内訳 - 連番、シャードの番号、プライマリorレプリカ - を表示している。

```
$ spring run search.groovy
Query: {"from":0,"size":1,"explain":true,"query":{"match_all":{}},"sort":["age"]}
Duplicate results
_id: 246 -> 2 times: [64:shard2(primary), 71:shard2(replica)]
_id: 75 -> 2 times: [114:shard2(primary), 119:shard2(replica)]
_id: 385 -> 2 times: [115:shard2(replica), 118:shard2(primary)]
_id: 227 -> 2 times: [116:shard2(primary), 121:shard2(replica)]
_id: 688 -> 2 times: [117:shard2(replica), 120:shard2(primary)]
_id: 436 -> 2 times: [159:shard2(replica), 160:shard2(primary)]
_id: 734 -> 2 times: [161:shard2(replica), 162:shard2(primary)]
_id: 210 -> 2 times: [200:shard2(primary), 209:shard2(replica)]
_id: 450 -> 2 times: [243:shard2(replica), 244:shard2(primary)]
_id: 640 -> 2 times: [245:shard2(replica), 246:shard2(primary)]
_id: 328 -> 2 times: [345:shard2(replica), 346:shard2(primary)]
_id: 551 -> 2 times: [347:shard2(replica), 348:shard2(primary)]
_id: 13 -> 2 times: [382:shard2(primary), 387:shard2(replica)]
_id: 811 -> 2 times: [391:shard2(replica), 392:shard2(primary)]
_id: 63 -> 2 times: [478:shard2(primary), 481:shard2(replica)]
_id: 309 -> 2 times: [479:shard2(replica), 482:shard2(primary)]
_id: 809 -> 2 times: [483:shard2(replica), 484:shard2(primary)]
_id: 253 -> 2 times: [519:shard2(replica), 522:shard2(primary)]
_id: 366 -> 2 times: [521:shard2(replica), 524:shard2(primary)]
_id: 626 -> 2 times: [523:shard2(replica), 526:shard2(primary)]
_id: 986 -> 2 times: [527:shard2(replica), 528:shard2(primary)]
_id: 316 -> 2 times: [581:shard2(replica), 586:shard2(primary)]
_id: 56 -> 2 times: [582:shard2(primary), 585:shard2(replica)]
_id: 520 -> 2 times: [583:shard2(replica), 588:shard2(primary)]
_id: 380 -> 2 times: [631:shard2(replica), 634:shard2(primary)]
_id: 70 -> 2 times: [632:shard2(primary), 637:shard2(replica)]
_id: 587 -> 2 times: [633:shard2(replica), 636:shard2(primary)]
_id: 739 -> 2 times: [635:shard2(replica), 638:shard2(primary)]
_id: 828 -> 2 times: [639:shard2(replica), 640:shard2(primary)]
_id: 169 -> 2 times: [684:shard2(primary), 693:shard2(replica)]
_id: 342 -> 2 times: [785:shard2(replica), 790:shard2(primary)]
_id: 20 -> 2 times: [786:shard2(primary), 795:shard2(replica)]
_id: 378 -> 2 times: [787:shard2(replica), 792:shard2(primary)]
_id: 222 -> 2 times: [788:shard2(primary), 799:shard2(replica)]
_id: 455 -> 2 times: [789:shard2(replica), 794:shard2(primary)]
_id: 599 -> 2 times: [791:shard2(replica), 796:shard2(primary)]
_id: 727 -> 2 times: [793:shard2(replica), 798:shard2(primary)]
_id: 44 -> 2 times: [834:shard2(primary), 837:shard2(replica)]
_id: 993 -> 2 times: [839:shard2(replica), 840:shard2(primary)]
_id: 25 -> 2 times: [920:shard2(primary), 923:shard2(replica)]
_id: 575 -> 2 times: [921:shard2(replica), 928:shard2(primary)]
_id: 82 -> 2 times: [922:shard2(primary), 925:shard2(replica)]
_id: 126 -> 2 times: [924:shard2(primary), 927:shard2(replica)]
_id: 873 -> 2 times: [929:shard2(replica), 930:shard2(primary)]
```

再現しない場合は、indexを削除してデータを再登録して試してみる。

なお、レプリカがあることが条件となるので、事象が再現している状態で以下のようにレプリカをなくすと事象は発生しなくなる。

```sh
curl -XPUT 192.168.33.11:9200/_settings -d '
{
    "index" : {
        "number_of_replicas" : 0
    }
}'
```

### 対策

再現できるようになったので、対策として有効なものを確認していく。

上記ドキュメントで説明されている対処方法はpreferenceという検索オプションを指定すること。一連のリクエストで同じシャードだけを使うようにするというもの。
ただ、これはRequest Bodyによるクエリ＝POSTのクエリでありながら、クエリパラメータを指定する形式であり、curlではうまくいっても、使用するライブラリ等によってはうまく実行できない方法でもある。

上記の他を含め、挙げてみると以下のような方法がありそう。

1. preferenceを指定する
1. ソートが一定になるようにソート条件を追加する
1. Scan and Scroll APIを使う
1. ページネーションのサイズを十分に大きくして複数ページにならないようにする

ここでは、1と2を試してみる。

#### preferenceを指定する

上記のスクリプトにおいて、HTTPBuilderではPOSTメソッドのリクエストにクエリパラメータをつけられなさそうなのでcurlを呼び出すように変更した上で、preferenceを指定してみる。

```groovy
def command = "curl --noproxy ${esConfig.host} http://${esConfig.host}:${esConfig.port}/bank/account/_search?preference=_primary_first -d ${json.toString()}"
def result = new JsonSlurper().parseText(command.execute().text)
```

これで結果は正常になった。

```
Query: {"from":0,"size":1,"explain":true,"query":{"match_all":{}},"sort":["age"]}
No duplicate result
```

#### ソートが一定になるようにソート条件を追加する

上記のスクリプトにおいて、以下のように2つ目のソート条件として、documentがユニークになるものを指定しておく。

```groovy
sortConditions += "account_number"
```

これも、同様に正常な結果が得られた。

---

今回の検証は以上。
検証のソースコードは[こちら](https://github.com/ksoichiro/issues/tree/master/elasticsearch/bouncing-results)にまとめた。
