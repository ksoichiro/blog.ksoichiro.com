---
title: "JavaFX + Eclipseインストール"
noEnglish: true
originalCreatedAt: 2010-05-12T01:32:00.001+09:00
tags: ["eclipse","インストール","JavaFX"]
---
JavaFXの導入に際し、以下の記事を参考にさせていただいていたのですが、大分時間が経ったのでダウンロード元などが変わっていました。

[JavaFXによるGUIアプリケーションの作成](http://codezine.jp/article/detail/1448)

そのため先日のエントリでJavaFXを「とりあえず」インストールする方法を書いたのですが、

EclipseでJavaFXを扱う方法が本家サイトの下記ページに詳しく書いてありました。
<!--more-->
[Getting Started With JavaFX Technology Using Eclipse IDE](http://www.javafx.com/docs/gettingstarted/eclipse-plugin/index.jsp)

JavaFX、Eclipseを組み合わせる場合、先日インストールしたバージョンでは対応していないようです…。

よく読まないといけないですね。

他ツールとの連携が最新バージョンに対応しているとは限らない、ということです。

> (原文)NOTE that this version of the JavaFX plugin for Eclipse is currently supported using JavaFX 1.2.1 SDK only. You MUST download JavaFX 1.2.1 SDK first and complete the installation by following the JavaFX SDK installation instructions. The JavaFX SDK provides the command-line tools and technologies to develop expressive content for applications deployed to browsers, desktops, and mobile devices.

[Getting Started With JavaFX Technology Using Eclipse IDE](http://www.javafx.com/docs/gettingstarted/eclipse-plugin/index.jsp) より

> (訳)Eclipse向けJavaFXプラグインのこのバージョンはJavaFX 1.2.1 SDKを使用するもののみサポートされています。まずJavaFX 1.2.1 SDKをダウンロードし、JavaFX SDKのインストール手順に従ってインストールを済ませておく必要があります。JavaFX SDKは、ブラウザ、デスクトップ、モバイル端末に向けた表現力のあるコンテンツの開発をするためのコマンドラインツールとテクノロジを提供します。

> (原文)Ensure that you have downloaded and installed the Eclipse IDE for Java EE Developers. The Eclipse 3.5 Galileo is the current version.

[Getting Started With JavaFX Technology Using Eclipse IDE](http://www.javafx.com/docs/gettingstarted/eclipse-plugin/index.jsp) より

> (訳)Eclipse IDE for Java EE Developersをダウンロードし、インストールしていることを確認してください。Eclipse 3.5 Galileoが現在の最新バージョンです。

つまり、導入作業の全体は

1. JavaFX 1.2.1 SDKをインストール
2. Eclipse for Java EE Developers(3.5 Galileo)をインストール
3. JavaFXプラグインをEclipseにインストール

となります。

というわけで以下をインストールします。

- JavaFX 1.2.1 SDK - [JavaFX Technology Downloads](http://java.sun.com/javafx/downloads/previous.jsp#1.2.1)
- Eclipse IDE for Java EE Developers - [Eclipse Downloads](http://www.eclipse.org/downloads/)

#### JavaFX

1. 上記リンクからJavaFX 1.2.1 SDKを探し、Windowsのリンクをクリックします。

    [![](/img/2010-05-javafx-eclipse_1.png)](/img/2010-05-javafx-eclipse_1.png)

2. プラットフォームを選択し、使用許諾契約を読んだ上で「I agree...」のチェックボックスにチェックを入れて[Continue]をクリックします。

    [![](/img/2010-05-javafx-eclipse_2.png)](/img/2010-05-javafx-eclipse_2.png)
    ここでは、[Platform]から[Windows]を選択します。
3. [javafx\_sdk-1\_2\_1-windows-i586.exe]をクリックします。

    [![](/img/2010-05-javafx-eclipse_3.png)](/img/2010-05-javafx-eclipse_3.png)

4. ダウンロードした[javafx\_sdk-1\_2\_1-windows-i586.exe]を実行します。

5. インストーラが起動します。[Next]をクリックします。

    [![](/img/2010-05-javafx-eclipse_4.png)](/img/2010-05-javafx-eclipse_4.png)

6. 使用許諾契約を読み、「I accept...」を選択して[Next]をクリックします。

    [![](/img/2010-05-javafx-eclipse_5.png)](/img/2010-05-javafx-eclipse_5.png)

7. インストール先を変更する場合は、[Browse]ボタンを押して選択するか、[Folder]のテキストボックスに入力して、[Next]をクリックします。

    [![](/img/2010-05-javafx-eclipse_6.png)](/img/2010-05-javafx-eclipse_6.png)

8. [Install]をクリックします。インストールが開始されます。

    [![](/img/2010-05-javafx-eclipse_7.png)](/img/2010-05-javafx-eclipse_7.png)

9. [Finish]をクリックして終了です。JavaFX SDKのユーザ登録への登録案内画面が表示されます。

#### Eclipse IDE for Java EE Developers

1. 上記のリンクから、[Eclipse IDE for Java EE Developers]のリンクをクリックします。

    [![](/img/2010-05-javafx-eclipse_8.png)](/img/2010-05-javafx-eclipse_8.png)

2. 矢印のアイコンをクリックして、ファイル(eclipse-jee-galileo-SR2-win32.zip)をダウンロードします。

    [![](/img/2010-05-javafx-eclipse_9.png)](/img/2010-05-javafx-eclipse_9.png)
3. ダウンロードしたファイルを展開します。
4. 展開してできたeclipseフォルダをC:\\eclipse\\jee-3.5などとして配置します。

#### JavaFXプラグイン

 **※初回と更新では手順が異なるようです。ご注意ください。**

1. Eclipseを起動します。インストールフォルダのeclipse.exeを実行します。

    ※このとき、以下のようなエラーが出てしまいました。

    [![](/img/2010-05-javafx-eclipse_10.png)](/img/2010-05-javafx-eclipse_10.png)
    これは[C:\\eclipse\\jee-3.5\\eclipse.ini]の一部を修正することで解決しました。

    修正箇所:

    (前)-Xmx512m

    (後)-Xmx256m

    (この解決方法は他のEclipse(Eclipseベースの開発環境)でも使いましたが、どうやって知ったのか…？すっかり忘れてしまいました…)

2. ワークスペースには[C:\\eclipse\\jee-3.5\\workspace]などを指定します。
3. メニューから[Help] > [Install New Software..]を選択します。
4. [Work with:]に[http://javafx.com/downloads/eclipse-plugin/]を入力しEnterキーを押します。

    [![](/img/2010-05-javafx-eclipse_11.png)](/img/2010-05-javafx-eclipse_11.png)
    ※原文と少々異なるやり方をしてしまいました。

    上記以外に、[Add]ボタンからサイトを登録する方法もあります(この方法が原文)。

5. 一覧に表示される[JavaFX Features]にチェックを入れ、[Next]をクリックします。
6. しばらくすると、[Install Details]という画面が表示されるので、[JavaFX Feature]と表示されていることを確認し、[Next]をクリックします。
7. 使用許諾契約を確認し、[I accept ...]を選択して[Finish]をクリックするとインストールが行われます。
8. 再起動を促すメッセージが表示されます。[Yes]をクリックしてEclipseを再起動します。

    [![](/img/2010-05-javafx-eclipse_12.png)](/img/2010-05-javafx-eclipse_12.png)


ここまでで、ようやくJavaFXを利用できる環境ができました。

お疲れさまでした！
