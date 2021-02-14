---
title: "Android Fragmentを含む画面遷移のテスト方法(JUnit)"
created: 2013-02-16T12:41:00.001+09:00
tags: ["JUnit","Android"]
---
Androidの画面遷移の自動テストをする方法として、ActivityInstrumentationTestCase2を使うサンプルを紹介してくださっているブログなどは見かけるのですが、 Fragmentを使った場合のものが見つからなかったのでサンプルを作ってみました。
<!--more-->
## Fragmentインスタンスの取得方法

ActivityではActivityMonitor#getLastActivity()などでモニタしているActivityのインスタンスを取得できますが、 Fragmentのインスタンスを取得しようとすると、そういったテスト用のメソッドがなく FragmentManager#findFragmentByTag()などで取得するしかなさそうです。

## Fragmentの画面遷移のチェック方法

Activityの場合はActivityMonitor#getHits()で呼び出されたかどうかを確認できますが、 Fragmentの場合で考えられるのは以下のようなものでしょうか。

- BackStackの数が期待通りに増減しているか
- findFragmentByTag()で取得できる(＝前面にある)Fragmentが期待通りのクラスか

## サンプル

サンプルでの画面遷移は次の通りです。 角括弧内はActivityの前面にあるFragmentを示します。

MainActivity[Fragment1]
↓R.id.btnFrag1タップ
MainActivity[Fragment2]
↓R.id.btnFrag2タップ
SecondActivity
↓Backキー
MainActivity[Fragment2]
↓Backキー
MainActivity[Fragment1]

以下が、上記遷移をテストするコードです。
Fragment
実際にうまくテストできているかどかは、例えばFragmentTransaction#commit()をコメントアウトしてみたりすると分かります。

ソースコード全体はGitHubで公開しました。
[https://github.com/ksoichiro/AndroidUnitTestSamples/tree/v2013.0216.1236](https://github.com/ksoichiro/AndroidUnitTestSamples/tree/v2013.0216.1236)
この中の、TransitionSampleです。
