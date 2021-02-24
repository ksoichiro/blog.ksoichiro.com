---
title: "Spring Boot 1.3.0.RC1を試してみて"
noEnglish: true
originalCreatedAt: 2015-11-06T02:33:00.001+09:00
tags: ["Spring Security","Spring Boot"]
---
現在Spring Bootを使ったWebアプリを開発しているのだが、Spring Boot 1.3.0のリリースを心待ちにしていて、実際にMilestone/RC版を取り込んでみている。

その中でいくつかハマったこと(ドキュメントをよく読めという話だが)や、これは使ってみたいと思った機能などを書き留めておく。
これは1.3.0のリリース前のM5とRC1のことなので、そこはご注意を。
<!--more-->

### Spring Security 4

個人的にはこれがバージョンアップをしたいと思った一番の理由。
Spring Bootそのものではないけど。
Spring Boot 1.3からはSpring Security 4が取り込まれている。
これの何が良いかというと、テストのサポートが充実している。
Spring Security 3までだと、SpringのドキュメントにあるようなMVCのJUnitテストをやろうとするとCSRFトークンで引っかかってしまったりして、なかなか苦労する。
それが、テストのセットアップの時点でSpring Security向けの設定をすると簡単に対応されるようになり、さらに`@WithMockUser`などのアノテーションを使って特定のユーザでアクセスさせたりということが簡単にできるようになった。

メジャーバージョンアップということもあり、APIが多少変わっていたりするので注意が必要かも。

Thymeleafを使っている場合は、Thymeleaf関連のDependencyも変更する必要がある(Spring Security 3系と4系で別のDependencyが用意されている)。

### Spring Data Elasticsearch 1.3

Spring Boot 1.2系ではSpring Data Elasticsearch 1.1(だったかな？)が使われていて貧弱だったAPIが、だいぶ増えている。
具体的に何が、というのはあまり理解しきれていないが、例えばStreamに対応したAPIが利用できたりする。

### Devtools

すでにブログなどを見かけたけども、Devtoolsという開発サポート用のツールが導入されている。
まだ試せていないが、ファイルが更新されたらSpring Bootを自動的に再起動したり、リロードしてくれたりするらしい。

### Fully Executable JARs

Linuxサーバでサービスとして稼働させたい場合、スクリプトを書く必要があると思っていたのだが、どうやらこれもサポートしてくれるらしい(これも試せていないので、間違っていたらごめんなさい)。

### resourcesの扱いの変更

Spring Boot 1.2まででは、Thymeleafテンプレートはsrc/main/resources/templatesに置いてプロファイルでspring.thymeleaf.cache = falseとすれば変更したものがSpring Bootの再起動なしで反映されていた。
これが、1.3.0.RC1から読み込まれないようになった。
これまでと同じ動作をさせたかったら

```groovy
bootRun {
    addResources = true
}
```

とすればいい。でも、processResourcesタスクを経て反映するのがあるべき姿で、それをやってくれるのがDevtoolsらしく、こちらが推奨とのこと。早く試してみないと・・

### 文字化け

これはM5で発生してRC1で修正されたが、エンコーディングのフィルタの順序が変わってしまい文字化けが発生していた。
こういう問題が入ってしまうことがあるのかと驚いた出来事でもあったが、修正も早くてよかった。

---

ここに挙げたのはごく一部で、実に様々な変更が入っている。
アップデートを考えている人はぜひ一度リリースノートを見てみたほうがいいと思う。
https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-1.3-Release-Notes
