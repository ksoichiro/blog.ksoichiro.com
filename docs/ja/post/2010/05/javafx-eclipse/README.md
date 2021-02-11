---
title: "JavaFX + Eclipseインストール"
created: 2010-05-12T01:32:00.001+09:00
tags: ["eclipse","インストール","JavaFX"]
---
JavaFXの導入に際し、以下の記事を参考にさせていただいていたのですが、大分時間が経ったのでダウンロード元などが変わっていました。

[JavaFXによるGUIアプリケーションの作成](http://codezine.jp/article/detail/1448)

そのため先日のエントリでJavaFXを「とりあえず」インストールする方法を書いたのですが、

EclipseでJavaFXを扱う方法が本家サイトの下記ページに詳しく書いてありました。

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


    [![](http://4.bp.blogspot.com/_rtlYXd55yO0/S-lZzp-ubPI/AAAAAAAAFMk/iuC2IyQHEc8/s320/WS000011.BMP)](http://4.bp.blogspot.com/_rtlYXd55yO0/S-lZzp-ubPI/AAAAAAAAFMk/iuC2IyQHEc8/s1600/WS000011.BMP)

2. プラットフォームを選択し、使用許諾契約を読んだ上で「I agree...」のチェックボックスにチェックを入れて[Continue]をクリックします。


    [![](http://4.bp.blogspot.com/_rtlYXd55yO0/S-ladDj4dRI/AAAAAAAAFMs/0xA8QB4Bj7E/s320/WS000012.BMP)](http://4.bp.blogspot.com/_rtlYXd55yO0/S-ladDj4dRI/AAAAAAAAFMs/0xA8QB4Bj7E/s1600/WS000012.BMP)
    ここでは、[Platform]から[Windows]を選択します。
3. [javafx\_sdk-1\_2\_1-windows-i586.exe]をクリックします。


    [![](http://3.bp.blogspot.com/_rtlYXd55yO0/S-lbs1QsO0I/AAAAAAAAFM0/KTluS8D_jUc/s320/WS000013.BMP)](http://3.bp.blogspot.com/_rtlYXd55yO0/S-lbs1QsO0I/AAAAAAAAFM0/KTluS8D_jUc/s1600/WS000013.BMP)

4. ダウンロードした[javafx\_sdk-1\_2\_1-windows-i586.exe]を実行します。

5. インストーラが起動します。[Next]をクリックします。


    [![](http://2.bp.blogspot.com/_rtlYXd55yO0/S-lhmTTVerI/AAAAAAAAFNM/qah_KKAaDlE/s320/WS000016.BMP)](http://2.bp.blogspot.com/_rtlYXd55yO0/S-lhmTTVerI/AAAAAAAAFNM/qah_KKAaDlE/s1600/WS000016.BMP)

6. 使用許諾契約を読み、「I accept...」を選択して[Next]をクリックします。


    [![](http://3.bp.blogspot.com/_rtlYXd55yO0/S-liW8vkWWI/AAAAAAAAFNU/lYYDPSC_d4I/s320/WS000017.BMP)](http://3.bp.blogspot.com/_rtlYXd55yO0/S-liW8vkWWI/AAAAAAAAFNU/lYYDPSC_d4I/s1600/WS000017.BMP)

7. インストール先を変更する場合は、[Browse]ボタンを押して選択するか、[Folder]のテキストボックスに入力して、[Next]をクリックします。


    [![](http://4.bp.blogspot.com/_rtlYXd55yO0/S-liyNvUYJI/AAAAAAAAFNc/2Cqg9OH6STE/s320/WS000018.BMP)](http://4.bp.blogspot.com/_rtlYXd55yO0/S-liyNvUYJI/AAAAAAAAFNc/2Cqg9OH6STE/s1600/WS000018.BMP)

8. [Install]をクリックします。インストールが開始されます。


    [![](http://3.bp.blogspot.com/_rtlYXd55yO0/S-ljpWJeTKI/AAAAAAAAFNk/9LfUvBxE8fE/s320/WS000019.BMP)](http://3.bp.blogspot.com/_rtlYXd55yO0/S-ljpWJeTKI/AAAAAAAAFNk/9LfUvBxE8fE/s1600/WS000019.BMP)

9. [Finish]をクリックして終了です。JavaFX SDKのユーザ登録への登録案内画面が表示されます。

#### Eclipse IDE for Java EE Developers

1. 上記のリンクから、[Eclipse IDE for Java EE Developers]のリンクをクリックします。


    [![](http://4.bp.blogspot.com/_rtlYXd55yO0/S-lcO04BHeI/AAAAAAAAFM8/YQFHnPQEAOI/s320/WS000014.BMP)](http://4.bp.blogspot.com/_rtlYXd55yO0/S-lcO04BHeI/AAAAAAAAFM8/YQFHnPQEAOI/s1600/WS000014.BMP)

2. 矢印のアイコンをクリックして、ファイル(eclipse-jee-galileo-SR2-win32.zip)をダウンロードします。

    [![](http://1.bp.blogspot.com/_rtlYXd55yO0/S-lcR65-fAI/AAAAAAAAFNE/csCL0Vvf8Gs/s320/WS000015.BMP)](http://1.bp.blogspot.com/_rtlYXd55yO0/S-lcR65-fAI/AAAAAAAAFNE/csCL0Vvf8Gs/s1600/WS000015.BMP)
3. ダウンロードしたファイルを展開します。
4. 展開してできたeclipseフォルダをC:\\eclipse\\jee-3.5などとして配置します。

#### JavaFXプラグイン

 **※初回と更新では手順が異なるようです。ご注意ください。**

1. Eclipseを起動します。インストールフォルダのeclipse.exeを実行します。

    ※このとき、以下のようなエラーが出てしまいました。


    [![](http://3.bp.blogspot.com/_rtlYXd55yO0/S-lxQRMqeII/AAAAAAAAFNs/qGJMo297Kqs/s320/WS000021.BMP)](http://3.bp.blogspot.com/_rtlYXd55yO0/S-lxQRMqeII/AAAAAAAAFNs/qGJMo297Kqs/s1600/WS000021.BMP)
    これは[C:\\eclipse\\jee-3.5\\eclipse.ini]の一部を修正することで解決しました。

    修正箇所:

    (前)-Xmx512m

    (後)-Xmx256m

    (この解決方法は他のEclipse(Eclipseベースの開発環境)でも使いましたが、どうやって知ったのか…？すっかり忘れてしまいました…)

2. ワークスペースには[C:\\eclipse\\jee-3.5\\workspace]などを指定します。
3. メニューから[Help] > [Install New Software..]を選択します。
4. [Work with:]に[http://javafx.com/downloads/eclipse-plugin/]を入力しEnterキーを押します。


    [![](http://1.bp.blogspot.com/_rtlYXd55yO0/S-lzWo_nbLI/AAAAAAAAFN0/hMYBSDPY8CU/s320/WS000023.BMP)](http://1.bp.blogspot.com/_rtlYXd55yO0/S-lzWo_nbLI/AAAAAAAAFN0/hMYBSDPY8CU/s1600/WS000023.BMP)
    ※原文と少々異なるやり方をしてしまいました。

    上記以外に、[Add]ボタンからサイトを登録する方法もあります(この方法が原文)。

5. 一覧に表示される[JavaFX Features]にチェックを入れ、[Next]をクリックします。
6. しばらくすると、[Install Details]という画面が表示されるので、[JavaFX Feature]と表示されていることを確認し、[Next]をクリックします。
7. 使用許諾契約を確認し、[I accept ...]を選択して[Finish]をクリックするとインストールが行われます。
8. 再起動を促すメッセージが表示されます。[Yes]をクリックしてEclipseを再起動します。


    [![](http://4.bp.blogspot.com/_rtlYXd55yO0/S-l2PuVCe5I/AAAAAAAAFOE/30Te3wXREI4/s320/WS000022.BMP)](http://4.bp.blogspot.com/_rtlYXd55yO0/S-l2PuVCe5I/AAAAAAAAFOE/30Te3wXREI4/s1600/WS000022.BMP)


ここまでで、ようやくJavaFXを利用できる環境ができました。

お疲れさまでした！
