---
title: "再開"
noEnglish: true
originalCreatedAt: 2015-03-26T23:46:00.001+09:00
tags: []
---
今回は、ここ1年くらいを少し振り返り、テクニカルな内容ではなくアウトプットに関することをだらだらと書く。

Qiitaに投稿するようになったこともあり、最近すっかりブログを書かないようになっていたが、どうしてもQiitaに投稿しようとすると完成度を上げてから、とか思ってしまい、アウトプットしにくくなっていた。（元々このブログに頻繁に書いていたわけでもないが）

一方、ソースコードに向かう時間を1日一回は作ろうと思っていて、ちょうど1年前くらいからGitHubに1日1回以上を目標にコミットするようにしてきた。
なぜ始めたかというと、スポーツでの練習と同じ感覚で、継続的なトレーニングが必要だと思ったから。

<!--more-->

仕事でのコーディングも、うちの会社にしてはかなり多い方だと思うが、プロジェクトの工程によってはコードを書かない時期もある。そうするとその間に感覚も鈍ってしまい、使っているライブラリ、ツールなどのアップデートにも敏感でなくなったり、ということがあり、常にコードを触ることにした。

この試みは結構継続できていて（休んでいるときもあるが）、以前に比べれば結構コードを書いていると思うし、実際に慣れてきてスピード、質が良くなった気もする。
READMEを更新してるだけ、なんて時もあるが、それでもそのProjectのコードや開発環境やらに目を向けて、一定の時間考えてアウトプットする、というのは何もやらないよりプラスになっていると思う。

またAndroidアプリ関連では、ライブラリの作り方を心得ていることもあり、色々と”完成品”として作ってきたことで、単なるトレーニング以上の効果があったと思う。
最新のOSバージョン、IDE、プラグイン、ツール、等々を積極的に使っていき、Travis CIを使ってPushの度にビルドし、テストカバレッジを計測して一定の品質を確保するようにし、Maven Centralにリリースしたり…と、まぁ単純に必要な時にインプット中心の勉強をする、というやり方をしていたら知らなかったかもなぁということを習得してきた。そしてそれを業務に活かせている。

特に、[Android-ObservableScrollView](https://github.com/ksoichiro/Android-ObservableScrollView)はリリースしたタイミングが良かったのか沢山Starを付けてもらい、一時はGitHubのTrendingのランキングにも入った。それまでは自分の他のどのProjectもせいぜい30 stars程度だったので、今回もそれくらい付けば上等、と思っていたが、今や2400以上。500人以上もForkしてくれている。
Android 5.0が発表されてMaterial Designってどうやって実装したら良いのだろう？という時期だったので、それに役立つものを作ろうと思ったのがきっかけで開発した。で、せっかく作ったからと軽い気持ちでGoogle+のコミュニティに紹介してみたのだった。

ライブラリの内容の良し悪しはさておき、このProjectでIssueやPull requestで海外の方とコミュニケーションを取れたのは良い経験になったと思う（まだ落ち着いたわけじゃなく、今も日々Starがつき、Issueも溜まっているし、メールも届く）。
例えば、ドキュメンテーションの重要性、コードの可読性の大切さを改めて認識した。と書くと普通過ぎるが…自分では当たり前のように思っていることでも何度も問い合わせを受けて対応していくうちに、客観的にコードやREADMEを眺め直してブラッシュアップしていく癖ができたと思う。

…しかし。
最近モバイル以外（Web）の知識が必要になり、久しぶりにその辺りを勉強しているのだが、当然Androidのようにライブラリを作るようなレベルではないからインプット中心になってしまう。アウトプットできる（＝動作するものを作り上げる）まで一定の時間がかかってしまう。そして、アウトプットに時間がかかるとじれったくなってしまう。

だが、そこに辿り着くまでは調べ物をしたり、コードが動かなくて試行錯誤しているわけであって、そこで習得したこともアウトプットしておけば良いのでは、と感じた。
Qiitaで投稿するのでも良いのだけれど、個人的にはそこにはある程度洗練された人に役立つものを載せたい、という気持ちもあり、何だかんだでそれなりの期間使っているこのブログが良い場なのかな、と考え再開することにした。
どうでもいいことも含めて書いておこうかな、と思う。

GitHubでは1日1commitのときもあれば50commitsとなるときもあるし、こちらも1日1回以上でネタがあればもっと、という感じで投稿してみようと思う。
