---
title: "最初のJavaFXプロジェクト"
created: 2010-05-12T01:33:00.000+09:00
tags: ["eclipse","サンプル","JavaFX"]
---
JavaFXをEclipseで開発する環境が整ったので、最初のアプリケーションを作成します。

やはり最初はチュートリアルに沿って覚えるのが早いです。

ということでJavaFXのサイトにある以下のページを参考に作成します。

[Creating Your First JavaFX Application Using Eclipse IDE](http://www.javafx.com/docs/gettingstarted/eclipse-plugin/create-first-javafx-app-eclipse.jsp)
<!--more-->
見た感じ、最初にしてはやや複雑な気がしますが…。

1. Eclipseを起動します。
2. 新しいJavaFXプロジェクトを作成します。メニューから[File] > [New] > [Project]を選びます。
3. [JavaFX]のフォルダを展開し、[JavaFX Project]を選択して[Next]をクリックします。

    [![](http://4.bp.blogspot.com/_rtlYXd55yO0/S-l6p5QBmuI/AAAAAAAAFOM/MLc7IhcS1Kw/s320/WS000024.BMP)](http://4.bp.blogspot.com/_rtlYXd55yO0/S-l6p5QBmuI/AAAAAAAAFOM/MLc7IhcS1Kw/s1600/WS000024.BMP)

4. 匿名の利用情報を送信してもよいか、尋ねられます。送信しない場合は[Do not send anonymous usage data.]にチェックを入れます。[OK]をクリックします。
5. プロジェクトの情報を入力する画面が表示されます。[Project name]に[FirstJavaFXApp]と入力します。
6. 他はデフォルト値のままにして、[Finish]をクリックします。
7. [Open Associated Perspective?]というダイアログが表示されたら、[Remember my decision]にチェックを入れて[Yes]をクリックします。JavaFXに関連づけられたパースペクティブで開きますか？という確認です。
8. パッケージエクスプローラ(Package Explorer)に[FirstJavaFXApp]というフォルダが作成されているはずです。

    これをダブルクリックして開き、[src]フォルダを右クリックして[New] > [Package]を選択します。
9. [Source folder]の入力欄は[FirstJavaFXApp/src]であることを確認し、[Name]には[gstutorial]と入力して[Finish]をクリックします。
10. 作成した[gstutorial]のパッケージを右クリックし、[New] > [Empty JavaFX Script]を選択します。
11. [Name]の欄に[Main]と入力し、[Finish]をクリックします。
12. Main.fxが作成され、エディタが開きます。
13. 右側にある[Snippets]のビューから[Applications]を開き、[Stage]の行をドラッグしてMain.fxのエディタでドロップします。
14. この部品の設定ダイアログが表示されます。左上の[Variables]の表から[title]の行の値をクリックし、[First JavaFX App]と入力します。同様に、[width]を[250]、[height]を[250]に設定します。

    （値は何でも構わないでしょう。）
15. [Insert]をクリックします。
16. コードが入力されます。

    [![](http://2.bp.blogspot.com/_rtlYXd55yO0/S-l_DbrxhSI/AAAAAAAAFOU/86AH9CT9spM/s320/WS000025.BMP)](http://2.bp.blogspot.com/_rtlYXd55yO0/S-l_DbrxhSI/AAAAAAAAFOU/86AH9CT9spM/s1600/WS000025.BMP)
    StageスニペットにはStageとSceneが含まれています。Stageは、JavaFXオブジェクトを表示するのに必要なトップレベルコンテナウィンドウです。Sceneはグラフィカルなコンテンツを描画するのに必要なオブジェクトです。
17. Sceneオブジェクトを修正していきます。まずは、ファイルの先頭部のimport文に続いて以下のコードを入力します。

    ```java
    import javafx.scene.text.*;
    ```

18. Sceneオブジェクトのcontentについて以下のようにコードを入力します。

    ```java
    package gstutorial;
    import javafx.stage.Stage;
    import javafx.scene.Scene;
    import javafx.scene.text.*;

    Stage {
         title : "First JavaFX App"
         scene: Scene {
             width: 250
             height: 250
             content: [
              Text {
                  font: Font { size: 22 }
                  x: 20, y: 90
                  textAlignment: TextAlignment.CENTER
                  content: "JavaFX World\nへようこそ！"
              } // Text
             ] // Content
         } // Scene
     } // Stage
    ```

19. 次に、円形のCircleオブジェクトを追加します。Snippetビューから、[Basic Shapes]の[Circle]をドラッグし、コードのTextの上の行でドロップします。[radius]に[90]を入力し、[Insert]をクリックします。
20. 追加したCircleにカーソルを合わせると、ドキュメントを参照できます。

    [![](http://3.bp.blogspot.com/_rtlYXd55yO0/S-mDDIuXxgI/AAAAAAAAFOc/EAOrtlRC6zM/s320/WS000026.BMP)](http://3.bp.blogspot.com/_rtlYXd55yO0/S-mDDIuXxgI/AAAAAAAAFOc/EAOrtlRC6zM/s1600/WS000026.BMP)
    描画のイメージまで見られるのが良いですね。

21. Circleの設定にRadialGradientを追加します。以下のimport文を追加します。

    ```java
    import javafx.scene.paint.RadialGradient;import javafx.scene.paint.Stop;
    ```

22. Circleのfill変数のコードを以下のように修正します。

    ```java
    package gstutorial;
    import javafx.stage.Stage;
    import javafx.scene.Scene;
    import javafx.scene.text.*;
    import javafx.scene.shape.Circle;
    import javafx.scene.paint.Color;
    import javafx.scene.paint.RadialGradient;
    import javafx.scene.paint.Stop;

    Stage {
         title : "First JavaFX App"
         scene: Scene {
             width: 250
             height: 250
             content: [
              Circle {
                  centerX: 100,
               centerY: 100,
                  radius: 90,
                  fill: RadialGradient {
                      centerX: 75,
                      centerY: 75,
                      radius: 90
                      proportional: false
                      stops: [
                       Stop {
                           offset: 0.0
                           color: Color.web("#3B8DED")
                       },
                       Stop {
                           offset: 1.0
                           color: Color.web("#044EA4")
                       }
                   ] // stops
                  } // RadialGradient
              }
              Text {
                  font: Font { size: 22 }
                  x: 20, y: 90
                  textAlignment: TextAlignment.CENTER
                  content: "JavaFX World\nへようこそ！"
              } // Text
             ] // Content
         } // Scene
     } // Stage
    ```

23. ここまで入力したらMain.fxを保存します。WindowsならCtrl + Sで保存できます。
24. パッケージエクスプローラからMain.fxを右クリックし、[Run As] > [JavaFX Application]を選択します。
25. 起動設定のダイアログで、[Profile]に適切なプロファイルを指定します。ここでは[Desktop profile - Run as Application]を選択します。アプレットやモバイル用の設定も選べるようです。
26. [Run]をクリックします。以下のように表示されましたか？

    [![](http://4.bp.blogspot.com/_rtlYXd55yO0/S-mF6ZGT54I/AAAAAAAAFOk/NAqf7fCKTWw/s320/WS000027.BMP)](http://4.bp.blogspot.com/_rtlYXd55yO0/S-mF6ZGT54I/AAAAAAAAFOk/NAqf7fCKTWw/s1600/WS000027.BMP)


以上です。

内容の理解がほとんどできていない上、元のチュートリアルにはまだ続きがありますが、最初のアプリケーションとしては十分だと思います。

お疲れさまでした！
