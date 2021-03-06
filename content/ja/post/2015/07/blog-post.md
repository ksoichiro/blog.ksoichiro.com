---
title: "毎日コードを書くことと、それにまつわること"
noEnglish: true
originalCreatedAt: 2015-07-11T17:11:00.001+09:00
tags: []
---
とあるきっかけで、ここ1年半近くやってきた、毎日コードを書くことについて振り返ってみようということになった。  

実質続いてるのは約一年。始めたのは2014年の3月頃。  
約1年前に1週間ほど途切れた期間があるが、そこからちゃんと再開しているので、そこについても言及した方が良いかもということであえて試みを始めてからの期間で1年半と言っている。

これは現時点のコントリビューションの状況。

![GitHub contribution](/img/2015-07-blog-post_1.png "contributions-20150711.png")

思いのほか、気づきがあって良かったと思う。きっかけを与えてくれた2人に感謝。  
自分がこんなエントリを書くとはおこがましいという感覚があるのだけれど、2人の意見を聞いて、もしかしたらこの話をオープンにしたら誰かの役に立つかもと思い、一度Secret Gistとして書いたものをもう一度時間を取って振り返り、バックグラウンドの説明を含めたりしつつ書き改めてみた。

前置きが長くなったが、これは[毎日コードを書くこと](http://snowlong.hatenablog.com/entry/2014/04/18/%E6%AF%8E%E6%97%A5%E3%82%B3%E3%83%BC%E3%83%89%E3%82%92%E6%9B%B8%E3%81%8F%E3%81%93%E3%81%A8)のような振り返りの話。  
これをやった John Resig さんのルールは自分からするとかなり厳しく、このルールでは自分は続けられないと思う。  
しかしそこまでやらなくても、十分に収穫があったと思うので、自分の経験を1つのサンプルとして紹介したい。

1つのエントリにしては長すぎるが、気にせず思いつく限り書いてみる。

<!--more-->

## 背景

* ここ数年はモバイルアプリの開発をしており、個人的にも[アプリを開発・リリースしてきた](https://play.google.com/store/apps/developer?id=sika524)。
* 2014年の3月頃から、GitHubに毎日1回コミットしようという試みを始めた。
* Androidアプリ向けのライブラリを中心に開発し、中でも[Android-ObservableScrollView](https://github.com/ksoichiro/Android-ObservableScrollView)というライブラリはもの凄くヒットした。

## ルール

* 毎日コードを書き、コミットし、GitHubにプッシュする。
* 1コミットで構わない。
* プッシュするのは後でも構わない。
* 書くコードの種類はなんでも構わないし、実際にはコードでなくプロジェクト内のドキュメンテーションでもいいし、  
  設定ファイルの変更でも構わない。
* いくつプロジェクトを作ってもいいし、うまくいかなかったらすぐに破棄してしまっても構わない。
* とにかく、毎日コードと向き合い、ある目標に向かって手を動かし、まとまった作業を終えるところまでを毎日行う。
* GitHubのプロジェクトの内容としては、ライブラリやプロダクトと言えるものでなくてもよく、サンプルアプリでもいい。  

## 結果としてリリースしたプロダクト

Maven Centralなどのグローバルなリポジトリにリリースしたものなど、ある程度完成した形にたどり着いたもの。  
「ただ書いてただけではなく、自分以外の人が利用できるような形にまとめた」というところや、
「どんな課題を解決しようとしたか」というところが重要な気がするので、
さらに長い前置きのようになってしまうがリストアップしておく。
なお、コードを毎日書くという試みを始める前にリリースしたものは含めていない。  
括弧内は初回リリース年月と主な使用言語。

### Android関連

#### [Android-ObservableScrollView](https://github.com/ksoichiro/Android-ObservableScrollView) (2014.11, Java)

* Androidアプリのスクロールアニメーションを実装しやすくするライブラリ。
* サンプルも沢山つけていて、Material Designの新しいパターンとして出てきたスクロールアニメーションは大抵カバーされているはず。
* Maven Centralで利用可能。

#### [Android-PageControl](https://github.com/ksoichiro/Android-PageControl) (2014.09, Kotlin)

* Androidアプリで、横スクロールするページのインジケータ（○印が並ぶやつ）をカスタマイズできるライブラリ。  
  内容的にはありふれているんだけど、Kotlinで書いたのが特徴的。
* Maven Centralで利用可能。

#### [Android-ColorfulIcons](https://github.com/ksoichiro/Android-ColorufulIcons) (2014.10, Shell)

* Android用のアイコン集。これはビルドスクリプト以外はコードではなく画像なので、他と大分性質が違う。  
* Maven Centralで利用可能。

#### [gradle-eclipse-aar-plugin](https://github.com/ksoichiro/gradle-eclipse-aar-plugin) (2015.02, Groovy)

* Gradleで扱えるAndroidライブラリの形式(AAR)をEclipseが読める形に変換するGradleプラグイン。
* Maven Centralで利用可能。

#### [gradle-android-git](https://github.com/ksoichiro/gradle-android-git) (2014.08, Groovy)

* Maven Centralなどにリリースされていないライブラリを、Gitのコミットハッシュ値やタグなどを指定してGradleから参照できるようにするGradleプラグイン。
* 社内で開発しているライブラリがあるがMavenリポジトリを運用するのは難がある、というケースで有用。
* Maven Centralで利用可能。

#### [adbs](https://github.com/ksoichiro/adbs) (2014.07, Go)

* Androidのadbコマンド(PCから端末を操作するためのコマンドラインツール)で、複数端末が繋がっていると長いシリアルナンバーを入力しないといけないという手間を省けるようにしたCLIツール。
* 元々シェルスクリプトで書いていたが、Windowsでも使えるようにGoで書き直した。
* Homebrew (tap)で利用可能。

#### [material-design-colors](https://github.com/ksoichiro/material-design-colors) (2014.08, Go)

* Material DesignのパレットをGIMPで使えるように変換したもの。

### iOS関連

#### [fint](https://github.com/ksoichiro/fint) (2014.05, Go)

* 簡素な静的解析ツール。もっと強力なものもあるけど、導入やメンテナンスが難しそうという理由で簡単なものを用意した。
* 構文解析すらしないfakeなlintツールというネーミング。正規表現などでチェックする。
* Goで開発。
* Homebrew (tap)でも利用可能。

#### [rdotm](https://github.com/ksoichiro/rdotm) (2014.08, Go)

* Androidでは文字列や画像といったリソースをR.javaというファイルから定数として参照できる。これだとリソース名のスペルミスもなくなり、この手のバグが減るというメリットがあるのでiOSに持ち込みたい、と考えて作ったもの。
* Objective-Cは拡張子.mだからR.m。
* XMLからObjective-Cコードを生成し、アプリコードからはObjective-Cのメソッドとしてリソースを参照できるので、リソース名の指定ミスはコンパイルエラーとして検出され、実行時エラーは起きなくなる。
* Goで開発。
* Homebrew (tap)でも利用可能。

### Java関連

#### [gradle-web-resource-plugin](https://github.com/ksoichiro/gradle-web-resource-plugin) (2015.07, Groovy)

* GradleからCoffeeScript、LESS、Bowerライブラリを使えるようにするGradleプラグイン。npmなどを手動でセットアップしておく必要はなく、すべて勝手にやってくれる。
* Maven Central、[jcenter](https://bintray.com/bintray/jcenter?filterByPkgName=gradle-web-resource-plugin)、[Gradle Plugins](https://plugins.gradle.org/plugin/com.github.ksoichiro.web.resource)で利用可能。

#### [gradle-replacer](https://github.com/ksoichiro/gradle-replacer) (2015.01, Groovy)

* 任意の静的ファイルに変数を埋め込んでテンプレートとして扱い、複数の環境向けに用意したプロパティファイルの値を埋め込んで各環境用のファイルを生成するGradleプラグイン。大部分は同じ形式だが、一部の設定値がリリース先の環境ごとに違っている、といったものを管理しやすくする。
* Maven Centralで利用可能。

#### [ability](https://github.com/ksoichiro/ability) (2015.05, Java)

* 柔軟なアクセス権制御をするための小さなライブラリ。
* Maven Centralで利用可能。

### その他

#### [gitlab-i18n-patch](https://github.com/ksoichiro/gitlab-i18n-patch) (2014.04, Shell)

* GitLabを日本語化するパッチ。

#### [fvalve](https://github.com/ksoichiro/fvalve) (2014.04, Ruby)

* ログ世代管理ツール。GitLabのバックアップデータを一定数まで残して削除する、というのをやろうとした。
* [RubyGemsで利用可能](https://rubygems.org/gems/fvalve)。
 
#### [dockerfiles](https://github.com/ksoichiro/dockerfiles) (2014.04, Shell)

* Dockerfile集。Android SDKなどの環境をDockerコンテナとして用意した。
* Docker Hubで利用可能。[Android Emulator](https://registry.hub.docker.com/u/ksoichiro/android-emulator/)など。

## なぜ始めたか

* アウトプットを増やしたかった。
かといってブログだと、自分の場合はネタ作り自体が目的になりがち、だった。記事を書くことや教養をつけることが目的ではなく、判断力を培ったり意味のあるソフトウェアを作りたかった。(ブログ自体は今も書きたいし、少し前に[こんな](/ja/post/2015/03/blog-post/)ことも書いたのだが、正直なところ、手が回っていない・・・)
* コードを書く機会が減っている気がして、コードを書く訓練をしたかった。
* 少し前までは、Android/iOSアプリを作ることに注力していて、個人的にもいくつもリリースしていた。しかし、アプリを作ること自体はデベロッパー個人としてもチャンスなのだけど、やはり商業的な価値を見いだせないアプリだと露出が少ないし、結果としてフィードバックも少ない。アプリはアプリで、作ってくれてありがとうという声はたくさんもらったものの、何か違う気がした。
* デベロッパー向けのものを作る方が、貢献している感じがあった。普段の仕事では、あまり自分のコードについて意見交換できる機会もないので自分の書いたコードもしくはライブラリに対してデベロッパーから意見をもらえることに刺激があった。
* 昔、会社の飲み会で将来の目標を聞かれた時に、偉そうに「世界に通用するソフトウェアを作りたい」と言ってしまったが、嘘にしたくないと思っていて、近づくための道を探りたかった。

## やってみて良かったこと

* まず、継続していること自体によって自信がついたと思う。それはコーディングについての自信とかとはまた違い、単に続けていることがあって、そのことに関して何もしていない人よりも、高みに近づく速度が自分の方が速いのだ、という自信。  
  （もちろん上には上がいるのだが、そこは他人との比較ではなくて、何もしていなかった自分と比べるべきだと納得している）
* ブログと同じだろうけど、ネタを作らないといけないので、ふと空いた時間にコードのことに頭がいくようになる。
* やはりコーディングスタイルは大事だと見直し、ソースコードレビューで「これを指摘するのは細かすぎるかなぁ…」とためらうことがなくなった。
  ただのこだわりじゃなく理由を持って説明もできるし、逆に説明できないことを押しつけるべきじゃないとも考えるようになった（本当はそんなの当たり前だけど）。
* よりコードの一文字、一行を大切に考えるようになったし、どんなケースを想定すべきかとか考える癖がついてきた（得意という意味ではなく、過去の自分と比較して)。
* コードでの表現力、表現のスピードが増した。これが一番当然といえば当然なのだが。(といっても、アルゴリズムの問題をすらすら解けたりするわけではないけど…)  
  スポーツをやっているとき、毎日練習をしていたのに1日休んでしまうと一気に感覚が失われることがある（昔あった）。それと似ていて、ずっと続けている間は感覚が研ぎ澄まされ、イメージした通りに体が動く。  
  当たり前のようにコードを書けるようになってくる。  
  何かを書こうとするときに、立体的に(？)完成系がイメージされていき、後はキーボードを叩いて出力していくだけ、といったような感じ。
* これは継続というよりOSSへのフィードバックからだが、  
  「へぇ、そんな使い方をするのか」と思うような意見があったりして、そういうところから、ロジックそのもの以外の要素、例えばソフトウェアとしての使い易さとか、にも目がいくようになった気がする。
* 書くことによりアイデアが浮かんでくると分かった。  
  この前作ったあれと同じで、ここも解決できるのでは？という感じ。あとは、他の人のプロダクトを見たり使ったりしていく中で「こんなことができたら便利かも」と閃いたり。
* 他人のコードを読むのが楽になった。  
  慣れの問題もあるだろうけれど、よく知らないコードの中に飛び込んでいくのに対して尻込みするような気持ちがなくなった。
* それって作れば解決できるよね？と考えるようになった。  
  ブラックボックスだとあきらめる部分が小さくなった。  
  実際、業務では置き去りにされがちな「このツールのここが使いづらいせいで開発がしづらい」みたいな問題は、その解となるソフトウェアは実はすごく小さかったりする。しかし、ブラックボックスとしか見ていない人はそうは考えず(思考停止)、そのまま日々小さなストレスを積み重ねていたり、それを回避するためのノウハウを貯めて属人化していっている気がしている（誰々に聞けばわかるとか）。
* コードを書く際に、どこで区切るべきか、今汎用化できるものを書いているのか、すべて結合した状態で仕上げようとしているのか、といったモジュール化の粒度や目的・用途を強く意識するようになった。
* コードを書く集中力がついたというか、フロー状態に入る感覚に敏感になったというか、そんな感覚がある。  
  ひらめいてコードを書こうとしたとき、実際に書き始めると、また別の細部が気になり出したりしてしまうが、そこに気をとられるとアイデアの流れが遮られてしまう。  
  そういうときに、脇目も振らずというか、「今表現するのはこれ！」と集中して一気に書き上げる、というコントロールが少しうまくなった気がする。
* メンテナンス性、分かりやすさをより意識するようになった。  
  アプリケーションにOSSを取り込んで問題が出た場合に、最悪の場合、すべて分解して必要な部分だけを取り込んでもらったり、メンテナンスしてもらったりすることができるか、と。  
  企業が作るOSSと違い、個人開発のOSSでは利用者に十分なサポートを提供するのは難しいからできるだけ安心して使ってもらおうと考えると、そうしたことが気になってくる。  
  そうすると自然に、おかしくない、恥ずかしくない書き方で表現したほうがいいと考えるようになる。  
  トリッキーなことを避けるようになる。  
  目的を達成するための最小限の機能を最小限のコードで提供しようと思うようになる。
* 変な話だが、一人で書いている上、求められていないにも関わらず、ドキュメンテーションを大事にするようになった。  
  なぜなら、例えばビルドしてリリースするまでのいくつかのコマンドなんかを書き留めておかなかったら、将来の自分にさえわからなくなってしまうから。  
  あるいは、プロジェクトの構成などをどこにも説明せずに放っておくと、後から入ってきた人に色々聞かれてしまうから。  
  「ここを見ればわかるよ」という状態になっているか、というのを意識し、コードでそれが表現できないなら説明書を書こう、というふうに考えるようになった。  
* 言語やフレームワークは道具だと考えるようになった。  
  以前からそのつもりではいたが、より一層そう考えるようになった。  
  この1年少しの期間でいくつかの言語を使い分けてきたが、プラットフォームに制限のあるものは仕方ないにしても大抵はある程度の選択肢がある。  
  例えば、AndroidやiOSアプリの開発で使うライブラリだとしても、それがランタイムで必要なものではなく開発中にだけ必要なものならJavaやObjective-Cで書かなくても良いのだ。  
  iOSアプリ向けのライブラリrdotmは、そんな発想でGoを選んで作った。  
  Androidアプリでは文言をXMLで管理され、Javaの定数として参照されるため  
  スペルミスのバグみたいなものが発生しない。これをiOSに持ち込みたい、と考えた。  
  さらに、Android/iOSアプリで同じUIを作りたい、なんていうよくある要望を考えるとAndroidのXMLファイルをiOS用のObjective-Cコードに変換しちゃえばいい、と。  
  Androidアプリの開発はWindowsでできるから、WindowsでもMacでも実行できた方がいい。  
  GoはCLIのアプリが簡単に作れて、クロスコンパイルして配布するのが簡単。  
  このケースでは要件に非常にマッチしている。  
  そういう考え方を心掛けていると、適材適所、良いとこ取りで使い分けていくのが良いよね、と思うようになっていった。
* 同様に、自分はアプリケーションエンジニアだ、とか、今Javaのプログラムを作っているんだ、なんて限定して考えるのはナンセンスだと感じるようになった。  
  まぁ、別にインフラがわかってるわけじゃないし、フルスタックエンジニアには程遠いのだが・・・。  
  メインのアプリケーションコード（例えばJavaアプリなら.javaで表現できる範囲）の外での解決も含めて考えるようになった。  
  他のツールやサービスと連携させればいいんじゃないかとか。  
* テストを大事にするようになった。  
  ライブラリをリリースする以上、ある程度互換性やバグを気にするようになるが、その際に手動でテストをいちいちしたくない（というか、更新頻度が高いととても手動ではやってられない）。  
  なので、自動テストして品質を維持することをやらざるを得ない。  
  ウォーターフォール型の開発で、納品して終わり！というやり方だったら一度きりの手動テストというのもありなのかもしれないが（実際には保守開発があるはずだが）、自分でつくり自分でリリースして自分でメンテナンスすると当然そんな方法は通用しない。  
  楽してテストせずに不具合を埋め込んでリリースしてしまったら、自分の管理能力のなさ・雑さ・自分のソフトウェアに対する熱意のなさが露呈して恥ずかしい思いをするだけである。  
  自分にとっては、テストを書くにはこれで十分なモチベーションになった。
* すると、テストの自動化が難しい部分がわかってきたり、自動化するために本体コードをどう工夫して書くか、どう構成するか、なんていう部分に目がいくようになる。  
* コードを書くことで落ち着ける。  
  習慣化するまではそうではなかったが、習慣化して大分経ってくるともはや「好き」を超え、「忙しくて色んなことが嫌になっていても自分のペースを取り戻せる」という手段にもなってくる。
* 謙虚に人の話を聞く態度が前よりも少し身についたと思う。  
  コードを書くこと、というよりGitHubでの活動を通じてということになるが。  
  学び続けるには謙虚な姿勢を保たなければならないと思う。  
  「何言ってんだこいつ。自分の方が正しいに決まってる」と考え始めた瞬間に、成長する機会を失う。  
  Android-ObservableScrollViewの内容を批判してきた人もいたのだが、  
  そういう意見に対してもぐっとこらえて冷静になり、お礼を言うようにしていた。  
  考えてみれば、言い方に問題があるだけで、文句を言いたくなるほどに興味を持ってくれたのは間違いない。  
  こういうのは最初は面食らってしまうのだが、噛み砕いてじっくり考えてみると確かに見直すべきところがあったりする。  
  そう考えられるようになると、日頃色々なことでいちいち腹を立てずに自分の都合の良いように吸収できて楽になれる。

## 大事だとわかったこと

* 継続すること、前に進むこと
    * 目指しているものに向かうために人と違う努力をしているというのは、文字通り自信（自分を信じる）につながると思う。
* 完成させること
    * 気づきの多くは、なんらかの形で完成させたものがあるから得られたものが多いと思う。  
      途中で諦めていいものと、そうはいかないものでは難易度が全然違う。
      誰かに責任を押し付けられる状況ではなく、企画・開発・保守すべて自分でやるというのは、責任感を培うのにも役立つはず。
* 人に知らせること
    * 恥ずかしがらずに公開し、人に知らせてみるといいのだと思う。  
      ニーズのあるものじゃなかったら人気が出ないだけで、批判までされることはない(はず)。  
      Android-ObservableScrollViewも、Google+で紹介しなかったらここまで伸びなかったと思う。

## 自分の感じることについて、あ、そうなのかと思えた記事

この試みを続けていく間、自分はこれで成長できているのかなぁとか、色々悩むところがあった。  
そんな中で「あ、そういうことか」とか「やっぱりそうなんだ」と思えた記事などを挙げておきたい。  
同じ試みを始めてみようという人の励みになれば・・・

* [毎日コードを書くこと - snowlongの日記](http://snowlong.hatenablog.com/entry/2014/04/18/%E6%AF%8E%E6%97%A5%E3%82%B3%E3%83%BC%E3%83%89%E3%82%92%E6%9B%B8%E3%81%8F%E3%81%93%E3%81%A8)
    * 冒頭にも挙げた記事。毎日コードを書いてる人は他にもいるんだ、しかも効果があったと言っている。  
      （自分が毎日コードを書き始めたのはこれを見たからではない。後からたまたま読んだ。）
* [「能力はないのに自信がある人」にならないための4つのポイント ｜ ライフハッカー［日本版］](http://www.lifehacker.jp/2014/12/141222avoid_overconfidence.html)
    * あぁ、わかった気になってただけだなぁとか、頑張れば頑張るほど逆に不安になってくるという…  
      進み方が間違ってるのだろうか？と思ったりしてたが、能力(実力)と自信が比例するわけでもないと知って安心。  
      (本当はどうなのか分からないが、そういう考え方もあると知っただけでも良かった)
* [走らなければ考えられない](http://kaiinui.com/drafts/2014-07-28-think-design-implementation.html)
    * 考えているのと実際に作るのとでは思考の量が違うと。これにはすごく納得した。  
      Hello worldを書いているのとは（当然ながら）レベルが違う。
    * 話が逸れるが、この方は実はiOSアプリ開発向けのツールrdotmを作った時にIssueを通じて意見をくださり、プルリクもくれた。  
      そのIssueというのが、Homebrewにリリースしたら使い易いはずだ、という意見だった。  
      正直、Homebrewを通じて提供するのが有用かもしれないなんて視点がなかったし、自分がHomebrewでソフトウェアを提供するなんてことは想像もしなかった。  
      それが正解だったかどうかはさておき、全然違う視点の意見に驚き、気になってブログを読み、上の記事を見つけたのだった。
    * GitHubでもフォローしたのだが、ある日この方のリポジトリに200+のスターがついたことがあった。  
      抜かれた！悔しい・・・と思い、どうやったら真似できるんだろう・・・と考えたりしたという点でも刺激を受けた。
* [教えることで専門家らしくなる](http://www.lifehacker.jp/2014/10/141005share_what_you_know.html)
    * コードというよりはブログでのアウトプットの話だが、何か自分でプロダクトを作って公開しようというところにも同じことが言えると思う。  
      最初は、自分なんかがライブラリなんて作れるわけがないとか、作っても使ってくれる人なんかいないと思ってしまいがちだが、そんなことはない。  
      素晴らしいアイデアだと思ったら、さっさと作って公開した方がいいと今は思う。
* [素晴らしいものを創り出すにはとにかく多く創るしかない](http://www.lifehacker.jp/2014/10/141014_equal_odds.html)
    * 短いが、続けることの価値について述べている記事。  
      自分に才能があるかどうかを疑いながら手をつけたり諦めたりを繰り返しているよりは、信じて続けた方がいいはず。

## 刺激を受けた本など

色々あるとは思うが、そもそもコーディングへの関心を高めたものや、コードを書こうというモチベーションの源になったものとして、取りあえず「これだ」とはっきり言えるものだけ挙げてみる。

* <a href="http://www.amazon.co.jp/gp/product/4492042695/ref=as_li_ss_tl?ie=UTF8&camp=247&creative=7399&creativeASIN=4492042695&linkCode=as2&tag=soichiro0a-22">レバレッジ・リーディング</a><img src="http://ir-jp.amazon-adsystem.com/e/ir?t=soichiro0a-22&l=as2&o=9&a=4492042695" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />, <a href="http://www.amazon.co.jp/gp/product/4492042806/ref=as_li_ss_tl?ie=UTF8&camp=247&creative=7399&creativeASIN=4492042806&linkCode=as2&tag=soichiro0a-22">レバレッジ・シンキング 無限大の成果を生み出す4つの自己投資術</a><img src="http://ir-jp.amazon-adsystem.com/e/ir?t=soichiro0a-22&l=as2&o=9&a=4492042806" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
    * 本田直之さんの本。  
      プロは練習して本番に臨むべき、「本番」は仕事で、  
      プライベートでの努力が「練習」だという考え方（だったと思う）。  
      「レバレッジ・シンキング」の方に載っていた言葉だった模様。  
      （当時書いた「レバレッジメモ」を見返すとそのような言葉が残してあった。）  
      あいにく手元に書籍が残っていなかったので正確に引用できないが、上記のような考え方に触れ、この道のプロになりたくて就いた仕事なのに、プロになるための努力をしないのは確かにおかしいと非常に納得した記憶がある。読んだの自体はだいぶ昔(社会人1、2年目くらいだったはず)。  
      社会人になりたての頃は、エンジニアたる前に社会人にならなくては！と意気込み「レバレッジ・リーディング」をきっかけに多読を目指して色々読んでいた。
* <a href="http://www.amazon.co.jp/gp/product/4274067939/ref=as_li_ss_tl?ie=UTF8&camp=247&creative=7399&creativeASIN=4274067939&linkCode=as2&tag=soichiro0a-22">情熱プログラマー ソフトウェア開発者の幸せな生き方</a><img src="http://ir-jp.amazon-adsystem.com/e/ir?t=soichiro0a-22&l=as2&o=9&a=4274067939" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
    * これはこのブログを始めたきっかけになった本。  
      [最初のエントリ](/ja/post/2010/05/blog-post/)で感想を書いたのでここでは省略。  
      この振り返りをするにあたり改めてさらっと読んでみたが、今でも何か掻き立てられる感じがする。
* <a href="http://www.amazon.co.jp/gp/product/489100455X/ref=as_li_ss_tl?ie=UTF8&camp=247&creative=7399&creativeASIN=489100455X&linkCode=as2&tag=soichiro0a-22">CODE COMPLETE 第2版 上</a><img src="http://ir-jp.amazon-adsystem.com/e/ir?t=soichiro0a-22&l=as2&o=9&a=489100455X" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />, <a href="http://www.amazon.co.jp/gp/product/4891004568/ref=as_li_ss_tl?ie=UTF8&camp=247&creative=7399&creativeASIN=4891004568&linkCode=as2&tag=soichiro0a-22">CODE COMPLETE 第2版 下</a><img src="http://ir-jp.amazon-adsystem.com/e/ir?t=soichiro0a-22&l=as2&o=9&a=4891004568" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
    * コーディングの基本という意味では、この本か。  
      先輩にこの本を紹介され、会社で勉強会として少しずつ読んでいった。  
      ものすごい量だし、全部を自分のものにできているわけではないだろうが、かなりの部分が役に立ってると思う。

## コードを書く上で気をつけていること

コードを書き続ける活動を通じて得た気づきなどから、コーディングに際して気をつけていることをいくつか挙げてみる。

* 個性を出さない。  
  誰が書いても同じになる、という美しさ、説得力を求めることが品質につながるのではと感じる。  
  もちろん、そうは言っても癖はあるのだろうけど。
* そのコードの将来を考える。  
  どうテストされ、どう変更されるのか。あとのことを考えたら、こう書いた方がいい、というのは割と多くある。
* しかしながら YAGNI (You ain't gonna need it) を考える。  
  このバランスが難しいところだが、単に形だけにこだわって頭を使っていないとついムダな汎用性を求めてしまうので注意が必要だ。
* 面倒臭がらずコメントを書く。意味のあるコメントを書く。  
  例えば「バグのworkaroundとして止むを得ずこう書いたのだ、詳細はここで説明されている」とか、一般的なリファクタリングの範疇でなんとかならないものの場合。
  大抵のケースでは、説明が必要なのはリファクタリングが必要なサインだ、と考えるようにしている。
* 英語として読めるコードにする。  
  ネーミングはかなりこだわる。  
  仕事で他人のコードをチェックする場合は、英語力などの点から無理があったりすることもあるので無理強いはしないけど。  
* APIとしての見栄えの良さを考える。  
  要件を満たしていたとしても、外からブラックボックスとして見たときにわかりやすい形をしてるか？とか。  
  ただしこれもYAGNIに注意を払う。
* 1行1文字に理由を持つ。  
  コミットしたコードはすべて自分の意思で書いたものだと責任を持つ。  
  尋ねられたときに、何となく書いた、なんて答えはしたくないと思っている。  
  自動生成されたコードだとしても、自分の名前でコミットしたら言い逃れしてはならないと思う。
* そのプロジェクトあるいはテクノロジへの理解度が高くない人への配慮。  
  玄人は理解できる、直感的ではないが簡潔なコードと、  
  素人でも間違いなく読めるコードのどちらでも同じ表現ができるなら後者を選ぶ。  
  あるいは前者を選ぶならコメントをつけたり隠蔽したりして、見通しをよくする。  
  個性を出さない、に通じてるかな。  
* 30分の作業をプログラムにやらせるために1時間かける(という意気込み。本当にそれだと困るけど)。  
  よく言われる通り、プログラマは怠け者であるべし、と思っている。  
  コードを書き、自動化し、二度と同じ手作業はしたくない、というつもりで自分の作業を分析する。

## 自分のOSSが評価されているのがわかったできごと

この活動の中で作ったOSSがどんな評価を受けているかについても振り返っておきたい。  
評価されるのは運の要素も強いと思うが、毎日コードを書くことの成果の一つとして周囲からの評価があるのだとも思うので。  
予め言っておくが自慢ではない。できればそう捉えられるようなことを書きたくないのだが、上に書いたような定性的な効能よりも定量的な数値や事実の方が、「自分もそうなりたい！だから始めよう」とモチベーションになる人もいるかもしれないと思うから書く。

自分も、[peco](https://github.com/peco/peco)というツールを知った時に「すごいなぁ、日本の人が作ったのか。もう数百スター付いているけど、そういうのを作る人ってやっぱり昔からそんな人だったんだよね…」と思っていたところで[pecoの作者さんのブログ](http://lestrrat.ldblog.jp/archives/39427929.html)を読み、これだけスターがつくのは初めてだったと知って、自分でもチャレンジできるかも、と思うことができた。

自分が使うつもりでOSSライブラリを作っていたものの、いつか広まってくれたらいいのになぁと、  
スターが1つつくたびにひっそり喜び、さらなる展開を期待していた。が、何も起こらなかった。というのは多い。  
冒頭に挙げたライブラリには1つもスターが付いていないものもある。
数ヶ月に一度、スターがつくくらいのところからスタートしたが、
2015年7月11日現在、Android-ObservableScrollViewは約3700のスターがついている。  
こんな経験はなかなかないと思うので、これを中心にどんなことがあったか、いくつか挙げてみる。

* Google+のコミュニティでAndroid-ObservableScrollViewを紹介したところ、
  伸びに伸びて、GitHubのTrending RepositoryのDailyで8位になった(当時)。
  Javaに限れば1位にもなった。Trend＝実力ではないのだが、自分のコードが一瞬でも世界1位になったというのは本当に嬉しいし自信になる。
* Starの数でメジャーなリポジトリをいくつも抜いた。  
  最近だと、ついにJUnitを抜いた。JUnitの方が遥かに汎用的な性質のものなので、いずれまた追い抜かれるだろうけど。
* ある2000+のスター(当時)のリポジトリのデベロッパーから、君のライブラリ使って作ったよ、とメールをもらった。
* StackOverflowで自分のOSSが解決策として出てきた。
* ブログで良い例として紹介してくれた：[ライブラリの守備範囲は狭い方がいい](http://konifar.hatenablog.com/entry/2015/05/14/184237)
    * これは結構ビックリした。はてなブックマークから辿ったのだったか、  
      何か見覚えのあるスクリーンショットだなぁと思って何気なく開いたら・・・。  
      自分の作ったライブラリが紹介されてると気づいた瞬間、  
      「これは守備範囲が広すぎるライブラリだ」と批判されてしまったのではないかとドキドキしたが、逆だった。
* Nodeclipseというツールのサイトで紹介されていた方法をプラグイン化したら本家に紹介された：[Gradle for Eclipse - Android](http://www.nodeclipse.org/projects/gradle/android/aar-for-Eclipse)
    * Androidアプリ開発で、EclipseでGradleが使えるようにしたくて色々調べていたらこの記事を見つけ、「これを発展させてプラグイン化したら普通にEclipseでGradleが使える！」と作った[Gradleプラグイン](https://github.com/ksoichiro/gradle-eclipse-aar-plugin)がある。  
      これがつい最近、[シェアしてもいい？と聞かれて](https://github.com/Nodeclipse/www.nodeclipse.org/commit/f0a15bb3cc707186d9e29018d53cb3e6750126ef#commitcomment-12009725)掲載されたのだった。

大分長くなってしまったが、以上。  
このエントリの内容が、もっとコードを書いて力をつけていきたいと思っている人の背中を押すことになれば幸いです。
