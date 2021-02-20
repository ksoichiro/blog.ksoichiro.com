---
title: "Spring Bootでのフロントエンド開発"
createdAt: 2015-03-29T22:47:00.001+09:00
tags: ["Bower","npm","wro4j","Spring Framework","gulp","Gradle","Spring Boot"]
---
Springに[Project Sagan](https://github.com/spring-io/sagan)というのがある。
spring.ioのリファレンスアプリケーションということらしい。
Spring Bootでのフロントエンド開発はサポートされているのかな？
と調べていたところで
https://spring.io/blog/2014/07/24/spring-framework-4-1-handling-static-web-resources
を見つけ、そこでProject Saganが説明されていた。
<!--more-->
上記の記事だと、フロントエンドはclientというサブプロジェクトに分け、npm、[gulp](http://gulpjs.com/)、[bower](http://bower.io/)などを使い普通に開発し、Gradleのサブプロジェクトとして統合できるらしい。
[Vimeoの説明(デモ)](https://vimeo.com/92961329)ではIntelliJで開発していて、サーバサイドと何ら変わりない印象を受けた。
が、この辺り、かなり疎いので頑張って勉強してみようかと思う。

[この資料](http://presos.dsyer.com/decks/spring-boot-for-the-web-tier.html)などでは別の方法として[wro4j](https://code.google.com/p/wro4j/)を使う方法が説明されていたが、Mavenで設定する感じなのでGradleでの利用は難しそう。
プラグインもちらほらある感じだが、Gradle・Spring Boot・wro4jのアップデートに追随しているか怪しい。

以下で説明されているアセットパイプラインのプラグインも有用そうものの、残念ながら動かすことができなかった…。
http://davydotcom.com/blog/2014-12-21-spring-boot-with-the-asset-pipeline
Railsと同じ感じでapplication.js、application.cssに統合できる模様。
これらの生成まではできたが、minifyされたファイルなどを読み込むことができなかった。この方、かなり色々なプラグインを作られているようなので、動かすことができなくて残念。

餅は餅屋、ということでJavaScript界隈のツールをそのまま使うのがベストだろうというのと、個人開発ツールかつアクティブに開発されていないものを使うのは心許ないなぁと考えると、Saganのやり方がベストなんだろうな…ということで、これを使いこなすべく勉強してみます。
