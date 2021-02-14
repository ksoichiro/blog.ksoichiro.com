---
title: "Spring Boot CLIでElasticsearchにアクセスするクライアントを作る"
created: 2016-09-26T23:27:00.001+09:00
tags: ["sdkman","Elasticsearch","Spring Boot"]
---
Elasticsearchのデータ操作をサーバ上で行いたい場合に、curlでアクセすれば良いが、ちょっと複雑なことをやろうとするとシェルスクリプトでは面倒だったりする。

で、こういうちょっとしたスクリプトを実装するのはSpringではやはり難しいだろうか？と調べてみたら Spring Boot CLI がちょうど良さそうだったので試してみた。

今回は [jq](https://stedolan.github.io/jq/) を使うことで結局シェルスクリプトでも何とかなるレベルのものにとどまってしまったが、あれこれ試した結果をまとめておく。
<!--more-->

### Spring Boot CLIのインストール

いろいろ手段は用意されているようだが今回は [sdkman](http://sdkman.io/) を使ってインストールする。

sdkmanはcurlでインストール。

```
curl -s "https://get.sdkman.io" | bash
```

Spring Boot CLI は `springboot` の名前で提供されている。
今回はバージョン指定で `1.3.2.RELEASE` をインストール。

```
sdk install springboot 1.3.2.RELEASE
```

これで `spring` コマンドが使えるようになる。 

### テスト用のElasticsearchの起動

ElasticsearchもSpring Bootで起動してみる。

以下のようなスクリプトを `elasticsearch.groovy` という名前で作成する。

```groovy
@Grab('spring-boot-starter-data-elasticsearch')
@RestController
class Elasticsearch {
}
```

Gradleファイルなどは不要。
`@Grab` によって依存関係を取り込んでくれる。
これ自体はGroovy (Grape)の機能だが、通常より簡略化された記述ができる。

httpでアクセスしたいので、`application.yml` を作っておく。

```yaml
spring:
  data:
    elasticsearch:
      properties:
        http:
          enabled: true
```

で、起動する。

```
spring run elasticsearch.groovy
```

http://localhost:9200/_cat/health などにアクセスすれば起動していることが確認できる。

Groovyファイルの内容について、Controller機能はいらないのだが`@Component`で作るとアプリがサーバとして起動せずそのまま終了してしまうので、Webサーバとして起動するように
`@RestController`を使用している。

なお、以下のようにすればjarファイルを作成することもできる。

```
spring jar elasticsearch.jar elasticsearch.groovy
```

### APIアクセス

先ほどのElasticsearchにアクセスしてクラスタのhealthを確認するスクリプトを作ってみる。

と言っても、肝心のAPIアクセス部分はcurlコマンドを叩くだけ。
Groovyの`String#execute()`で簡単にできる。

```groovy
@ConfigurationProperties(prefix = 'es')
class EsHealthConfigProperties {
  String host = 'localhost'
  int port = 9200
}

@Component
class EsHealth implements CommandLineRunner {
  @Autowired
  EsHealthConfigProperties esConfig

  @Override
  void run(String... args) {
    println "curl http://${esConfig.host}:${esConfig.port}/_cluster/health?pretty=true".execute().text
  }
}
```

起動して何かを実行して終了するだけのものなので、`CommandLineRunner` を使っている。

また実行時にホスト・ポートくらいは指定できるように Spring Boot の `@ConfigurationProperties` を使っている。
これによって、例えば以下のようにパラメータを変更して起動することもできる。

```
spring run eshealth.groovy -- --es.port=9201
```

実行時にバナーやSpring Bootのログを出力したくなければ、以下のように`application.yml`を定義しておけばいい。

```yaml
spring:
  main:
    banner-mode: "off"
logging:
  level:
    org.springframework: WARN
```

### データの検索

あらかじめ登録してあるデータから、クエリで検索する例。
[Elasticsearchのドキュメント](https://www.elastic.co/guide/en/elasticsearch/reference/current/_exploring_your_data.html)からダウンロードできるデータ(`accounts.json`)をサンプルとして使う。

このファイルは

```
{"index":{"_id":"1"}}
{"account_number":1,"balance":39225,"firstname":"Amber","lastname":"Duke","age":32,"gender":"M","address":"880 Holmes Lane","employer":"Pyrami","email":"amberduke@pyrami.com","city":"Brogan","state":"IL"}
{"index":{"_id":"6"}}
{"account_number":6,"balance":5686,"firstname":"Hattie","lastname":"Bond","age":36,"gender":"M","address":"671 Bristol Street","employer":"Netagy","email":"hattiebond@netagy.com","city":"Dante","state":"TN"}
{"index":{"_id":"13"}}
...
```

というように bulk API で登録できる形式になっている。
ドキュメントにある通り、

```
curl -XPOST 'localhost:9200/bank/account/_bulk?pretty' --data-binary "@accounts.json"
```

とすれば登録できる。

このデータから、balanceの値が特定の範囲にあるデータを抽出してみる。

スクリプトは以下の通り。(`esexport.groovy`とする)

```groovy
@Grab('groovy-all')

import groovy.json.*

@ConfigurationProperties(prefix = 'es')
class EsExportConfigProperties {
  String host = 'localhost'
  int port = 9200
  int balanceFrom = -1
  int balanceTo = -1
}

@Component
class EsExport implements CommandLineRunner {
  @Autowired
  EsExportConfigProperties esConfig

  @Override
  void run(String... args) {
    def json = new JsonBuilder()
    json {
      query {
        filtered {
          filter {
            bool {
              must {
                range {
                  balance {
                    from esConfig.balanceFrom
                    to esConfig.balanceTo
                  }
                }
              }
            }
          }
        }
      }
    }
    def command = "curl --noproxy ${esConfig.host} http://${esConfig.host}:${esConfig.port}/bank/account/_search -d ${json.toString()}"
    def result = new JsonSlurper().parseText(command.execute().text)
    result.hits.hits.each { hit ->
      println JsonOutput.toJson([index: [_id: hit._id]])
      println JsonOutput.toJson(hit._source)
    }
  }
}
```

以下のように実行すると、balanceが20000~30000のデータが抽出される。

```
spring run esexport.groovy -- --es.balanceFrom=20000 --es.balanceTo=30000
```

上記は、取得した結果の中から、実際のデータにあたる部分を取り出して `accounts.json` と同様にbulk APIのインプットとして利用できるような形式に加工して出力している。

JSONの操作にはGroovyの `JsonBuilder`, `JsonSlurper`, `JsonOutput` を使っている。これらは`groovy-all`という依存関係に含まれ、デフォルトではインポートされていないので

```groovy
@Grab('groovy-all')
import groovy.json.*
```

と書いておく。

### ページネーション

ここまででなんとなく動くように見えるのだが、ページの指定が正しくできていないためデフォルトの10件だけしか取得できない。

ここでは、リクエストパラメータに `from` と `size` を指定して、結果が0件になるまで `from` をずらしながら繰り返しリクエストするようにする。

```groovy
@Override
void run(String... args) {
  def json = new JsonBuilder()
  json {
    from 0
    size 100
    query {
      filtered {
        filter {
          bool {
            must {
              range {
                balance {
                  from esConfig.balanceFrom
                  to esConfig.balanceTo
                }
              }
            }
          }
        }
      }
    }
  }
  while (true) {
    def command = "curl --noproxy ${esConfig.host} http://${esConfig.host}:${esConfig.port}/bank/account/_search -d ${json.toString()}"
    def result = new JsonSlurper().parseText(command.execute().text)
    if (result.hits.hits.size() == 0) {
      break
    }
    result.hits.hits.each { hit ->
      println JsonOutput.toJson([index: [_id: hit._id]])
      println JsonOutput.toJson(hit._source)
    }
    json.content.from += json.content.size
  }
}
```

こういう「ロジック」っぽいコードが増えてくると、シェルスクリプトで書くよりいいかな？と思えてくる。

### GroovyのみでのHTTPアクセス

ここまでくると Spring Boot CLI は関係なくなってきているがcurlを使わずにGroovyのみでHTTPアクセスもするように変更してみる。

これには、http-builder を使うのが簡単そう。
Unitテストのことを考えると`RestTemplate`などを使ったほうが良いのかもしれないが、ここではhttp-builderの`RESTClient`にする。

この依存関係も Grab で取得して、importしておく。

```groovy
@Grab('org.codehaus.groovy.modules.http-builder:http-builder:0.7')

import groovyx.net.http.*
import static groovyx.net.http.ContentType.*
```

そして、curlによるHTTPアクセスの部分を以下のように書き換える。

```groovy
def http = new RESTClient("http://${esConfig.host}:${esConfig.port}/")
while (true) {
  def result = http.post(path: 'bank/account/_search', contentType: JSON, body: json.toString()).data
```

### まとめ

やってみたことは以上。

今回の内容は [GitHub に登録してある](https://github.com/ksoichiro/spring-boot-practice/tree/master/contents/20160924-cli-script)。

冒頭に書いた通り、やはりシェルスクリプトなどで十分というケースもあるが、これが良い選択肢になる時もありそう。

メリットは以下のような点だろうか。

- 手軽
    - Spring, Spring Boot の機能が欲しいが、ちゃんとしたアプリを作るのは大げさすぎる、という場合に手軽に使える。
    - 今回のSpring BootでのElasticsearchサーバのように、大部分がSpring Bootによってセットアップされてしまうようなものを使いたい場合は本当に楽。特に今回は `brew install elasticsearch` で入れようとしたらXcodeをバージョンアップしろと言われすぐには終わらなかったので、余計にSpring Boot CLIの手軽さが際立った。
- 楽に書ける
    - デフォルトである程度インポートされていたり、Groovyで書けることによって、少ない記述量でスクリプト言語に近い感覚で書ける。
- Javaしかインストールされていない環境でも動かせる
    - jarファイルにしてしまえば追加で何かをインストールしたりする必要がない。

逆に改善できないか考えたいポイントは以下。
なお今回使ったのは 1.3.2.RELEASE なので最新版で改善されている部分もあるかもしれないが、未確認。

- importが面倒
    - デフォルトでimportされているものが何なのかがわからず、実行してみると解決できないと言われ、Grabの追加が必要なのか？importが必要なのか？と迷う
    - Gradleファイルもなくディレクトリ内にフラットにGroovyスクリプトを配置する構成なので、IDEで開いて補完させることもできず、使いたいクラスがどのパッケージに属するのかいちいち調べなければならない。
- 管理がしにくい
    - 通常のSpring Bootプロジェクトの中にこうしたスクリプトを
混ぜて管理するにはどうしたらいいか？
      せっかくGradleで構成していても、sdkmanとspringコマンドを新しく入れないと使えないのは微妙...
 