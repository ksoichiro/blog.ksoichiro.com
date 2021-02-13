---
title: "yEdの基本的な操作方法＋α"
created: 2019-02-20T00:54:00.001+09:00
tags: ["yEd"]
---
[yEd](https://www.yworks.com/products/yed) の基本操作を確認する。
内容は独立しているが、一応以下の続き。

[yEdでジョブフロー図っぽいものを描く: Edge Routing](https://ksoichiro.blogspot.com/2019/02/yed-edge-routing.html)
[yEdでジョブフロー図っぽいものを描く: Layout](https://ksoichiro.blogspot.com/2019/02/yed-layout.html)

yEdをすごく気に入っているような感じになってきているが…あくまで評価の過程。
なお、操作は Windows 10 で行っている。
<!--more-->
## ノードの配置

Paletteからドラッグアンドドロップする。

![](https://lh3.googleusercontent.com/egcY_6aWda0CG83ywcu7ZIqrl-YnIhYhyo0McudPuVaJQJ0Rl_pis8AmO5fQWL2F8jroweWavwipNQ=s0)

PaletteにはSectionがあり、このSectionは増やすことができる(Edit＞Manage Palette)。

## ノードの接続

オブジェクトから別のオブジェクトへドラッグするとコネクタがつく。以前のエントリでEdge Routingを見たとおり、コネクタのことはエッジ(Edge)と呼んでいる模様。

![](https://lh3.googleusercontent.com/Wfz_v5dyOkzOzmmIVgHCbk6yJEqATuy-fYFLffG2F7nN6_NsotEO5gaCm2SOeTNgINjcw5yC8sCMPQ=s0)

オブジェクトを移動したいときは、オブジェクトを一度クリックしてからドラッグする。いきなりドラッグしようとするとコネクタがマウスにくっついてきて、離すと線が折れ曲がって…と以下のようにおかしなことになる。そのような状態になったらEscキーで中止できる。

![](https://lh3.googleusercontent.com/RMNI-FL4pZ8IeGUL7gF_GXwB5BLclDloj0kXLRS8IB5yRRM3WBM7YDC_mne6AaWlpy6X1WAI3dmHgg=s0)

## ラベル

Office系のオートシェイプだとテキストのみのオブジェクトを作ることができる(以下はOpenOffice Calcでの例)が、yEdにはそのようなものがない模様。

![](https://lh3.googleusercontent.com/F18A46FU58NBnSd6TARAasnuGvaMQ6Be9SOXAeaGFMlI2soK69EuTM8GlGYTJgP66FLonrEc9KQODQ=s0)

もし必要なら通常のノードの色を消して作る。

ノードを右クリック＞Propertiesでダイアログを開き、GeneralタブのFill Colorの右側の「…」をクリック、No Colorを選択する。Line Colorも同じくNo Colorにする。Okボタンで確定。

![](https://lh3.googleusercontent.com/u8Gla7hmDDt8-V2CtU6GwXLoWtV-2fxtWpysJNDzS8-Jrzl7yvfTneiOs0Un7KjO9R8GTJMrWpB1LA=s0)

ノード内にテキストを入れるのはノードをダブルクリックするか、ノードをクリックしてF2キーで編集開始できる。ノードからテキストがはみ出ている場合(以下)、

![](https://lh3.googleusercontent.com/UaK4tTGGob3glE_g94bJH-kmHStBT5_fFwBp8ytZEXtLTIY834hzMpd9B1cgAxnoxECFWeca0hHC9w=s0)

メニューのTool＞Fit Node to Labelでラベルが収まる大きさに変えることができる。

すべてのノードではなく選択したノードだけ適用したい場合は、ノードを選択した上でFit Node to Labelのダイアログを開き、Act on Selection Onlyにチェックを入れると選択したものだけに適用することができる。

## フォントの変更

あえて取り上げるものでもないかもしれないが…デフォルトではDialogというフォントになっており、日本語だと見栄えが良くない(と個人的には思う)。
ノードのプロパティを開いてLabelタブ＞Font Familyでフォントを変更することができる。

![](https://lh3.googleusercontent.com/oe-aUPxMwmWIuAofza-y6c2HsEv8JJ-Ay9KAcER_Vr2mRPwB8a_oNRG7hZyVE6KDRi69__lDMwWE4w=s0)

特に文字化けのような問題は起きない。
複数をまとめて変更したい場合は、ドラッグしてノードを複数選択した状態でノードの一つを右クリックしてPropertiesを開くか、F6キーでプロパティのダイアログを開いて変更する。
この変更方法は他のプロパティでも同じと思われる。

いちいちこのような設定をするのは面倒なので、よく使うノードはPaletteに登録すると良いだろう。以下などがそうだが、Paletteはgraphmlファイルとして外部化できるらしい。

[https://github.com/pafnow/vrt-graphml-for-yed](https://github.com/pafnow/vrt-graphml-for-yed)

## ラベルの配置の変更

ノード内でのラベルの配置は、Properties > Labelタブ > PlacementでModelをInternalにしてPositionで変更することができる。以下はTop Leftにした場合の例。

![](https://lh3.googleusercontent.com/U1tJO5kCeteVghT2rmCVzwBH70mYCp1AECcpDRFM0X6d-F1_L6Tkg465FNDwP9JhLmZ5N2VeVtkasQ=s0)

## 表示を中央に持ってくる

メニューView＞Fit Content、またはツールバー上の以下のボタンを押すと、配置されているノード群が中央に来るように移動する。

![](https://lh3.googleusercontent.com/Y0jTzak2PFZawAA0iacAKShHbtc-pBV9h3ZGJe9A4kfCrlHFtQm7afCM5chsbImKCcF554DBxFTRFg=s0)

## 選択したものを整列する

例えば以下のように配置がバラバラなノード群があるとする。

![](https://lh3.googleusercontent.com/itsARD2dfBq3sDuBxhVWsOhBs01jn-Dqn6ejE-ywdgPDh8XWwuejHNsaUpPJxI6b3jJXpFEVtbSr4w=s0)

左の2つのノードを左揃えしたい場合、以下のようにノードを選択して…

![](https://lh3.googleusercontent.com/ct9YyOR5flzYsbzHGG9fTDEVbOxeCbl6Q7ZaYp3Cx0fCFcl0XHqePzHde1xIV8_QAQ7ZX9ppQOsGRQ=s0)

メニューEdit＞Align Nodes＞Align Leftを選択すると整列できる。

![](https://lh3.googleusercontent.com/lk_CU1NiepSzoJLs2piBRnJ1tJkvBE-vxSRaquyM3wRvICfwEV4NF5dX4c9hxuYGj7FaOkCtn65weg=s0)

## 重なったノードの上下

以下のように後からノードを配置して下に移したいとする。

![](https://lh3.googleusercontent.com/jqxGhWHYuBd40p-PbLW4bEkNeAe2nxRFLvRBFBPDRX_GzlEyr1OgD5TKCyuKFaT9cxn-qMcURciXtA=s0)

対象のノードを右クリックし、Lower Selectionを選択すると一番下に移される(1つずつ下に移るのかと思いきや、おそらく一番下に移されている)。逆に、上に移動したい場合はRaise Selectionを選ぶ。

![](https://lh3.googleusercontent.com/5k8F65jmpRaRO9YJcv3LgGiZmNX1HvzcRdeZNVyuQJ3jqbjNKtqHMgqTUeaBPdtC3rB01b0lnGBUog=s0)

## グループ化

複数のノードを選択してグループ化することができるが、Excelなどのグループ化とは違う印象。単純にグループ化されるだけではなく、グループが”見える”状態になる。

![](https://lh3.googleusercontent.com/7uTikvHNcmf0N1r_jxg2s304xYGdKxaWn5kNpkI1YpHjb9eWoi6bwAEMGDHdjbtENNrhmci_BySvwQ=s0)

画像としてエクスポートすると、ラベルや周囲の罫線、背景色も出力されており、単にグループ化したいだけなら邪魔になる場合が多そうな気がする。

プロパティでFill Color、Line ColorをNo Colorに変更すれば、枠の線や背景色は消える。ラベルを非表示にする場合はプロパティのLabelタブでVisibleのチェックを外せば良い。すると以下のようにグループとしてドラッグで移動はできるがグループそのものをノードとして表示することはなくなる。「-」の部分は画像としては出力されない。この場合、グループの範囲がどこまでなのかがわかりにくく、グループ内のノードをドラッグしそうになるかもしれない。グループ化していてもグループ内のノードを普通に操作できてしまうため、うっかりグループ内のものだけ操作してしまうこともありそう。

![](https://lh3.googleusercontent.com/WXcQJtB4Mp7tJ-XD_lQHfrI3quvRDFZZZsXLu_YiupqAfQn-WouH5G592nfbGWZ6E8KkLwViVysicA=s0)

グループの左上の「-」をクリックするとグループが閉じられて「フォルダ」になる。

![](https://lh3.googleusercontent.com/pKyUJEsOohNc3F4yxbOXgK9Uf6hnBIjfwH5mqicCDfsoWCbxWImiblCJck-o9qksApftn0dCCj5Esw=s0)

フォルダの色も消すことはできるが、ただの透明な領域になってしまうためあまり意味はないだろう。

## ズームイン・ズームアウト

マウスのホイールでズームイン・ズームアウトができる。あるいはツールバー上の虫眼鏡のアイコン(「+」「-」の印が中にあるもの)を操作する。中身のない虫眼鏡をクリックすると、選択領域をズームするモードに変わる。図の一部をドラッグして領域選択すると、その部分にズームインする。

## 移動

表示する領域を移動するには、右ドラッグする。

## エッジの付け替え

既にノード同士が接続されている状態で、接続先のノードを別のノードに変えたいとする。

その場合はエッジをクリックして、接続先のノードの中心部分にマウスをフォーカスすると移動のアイコンに切り替わるので、そのままクリックし、変更先のノードにドラッグする。

一度クリックしてからでないと移動できないのは、最初に説明した「ノードの接続」と同じ。

## 吹き出しっぽいもの

これは基本操作というよりExcelと比較しての応用編かもしれないが…

Excelのオートシェイプで吹き出しはよく使う(と思う)。これに相当するものはできるか確認してみたが、結論から言うと難しい。

yWorksのマニュアル [Custom Symbols](https://yed.yworks.com/support/manual/custom_nodes.html) の説明によると、SVGやVisioのXMLをインポートすることはできるらしい。Paletteにインポートすることもできるし、.svgファイルをドラッグアンドドロップすればそのまま取り込めるとのこと。試しに以下のような吹き出しっぽいものをInkscapeで作ってみて…

![](https://lh3.googleusercontent.com/ic-ZztPYpfSMkBb6gLh1YzwzNK6QsWhjfxOM1_snhMgugtJmUYNY6xLfqH8Q4K0pDB8VFuHvOMjVHA=s0)

ドラッグアンドドロップすると確かに取り込める。

![](https://lh3.googleusercontent.com/_nhH-H_lripDeahQk64HOVBZB9seCFKqkcwYvOj-PEX0limOrXFSB3scXSjsVU4npBQVM39P4FbWSQ=s0)

しかし、ラベルを入れようとすると残念なことになる。

![](https://lh3.googleusercontent.com/903IXBKl-2Qxw0NnFrvzdVsFFPyWx4GhaG-PhkqqbzIGBXfloqwsOHM7aRMSlpVx1GOEzFPdx2_34Q=s0)

吹き出しノードを選択した上で、メニューTool＞Fit Label to Nodeを選択し、StrategyをWrap Linesに、Act On Selected Nodes Onlyにチェックを入れてOkすると折り返すことは一応できる。

![](https://lh3.googleusercontent.com/i4d9x2Yfv3LX1MkhufLprSAsdKR9cSVQGjbC_p4e8dF4ueCUEyyvKFbf_BxfIk9VOdWPwTaRK6aJeA=s0)

ただ、あくまでノードの矩形領域全体を調整可能な範囲としてみているようなので、折り返しとフォントサイズを小さくするのを両方行うStarategy(Wrap Lines and Resize Font)を選んだとしてもはみ出してしまう。

![](https://lh3.googleusercontent.com/5oSnglyycQu4Dbcr9zs-W4nuzpGmB6wLCeg1s7DiAYE9KsXl-0Gq1eTBGcXou_mf-gq44z0XrS8GeQ=s0)

また、吹き出しの伸びている部分をドラッグすることはできないし、背景色などを変更することもできない。SVGなのだからできるのではと期待してしまうが、以下のように現時点ではできないとマニュアル( [Custom Symbols](https://yed.yworks.com/support/manual/custom_nodes.html))に書かれている。残念。

> Please note that images and SVG files will be used for the representation of nodes “as is.” Thus, unlike predefined shapes and symbols, changing visual properties like, for example background color or line type, has no effect on these nodes.

ただ、これに関しては吹き出し型にこだわらなくても以下のように通常のShapeで何とかすることはできるとは思う。

![](https://lh3.googleusercontent.com/hp0J0o8lFowq41Z4rcyTrjMOgSLCNwVzUk-SeCvvkMe4bCKAHCKHnk_LW5msrXltce1834Dpp4GzKw=s0)

以上、気になった部分を中心に(かなり中途半端な感じではあるものの)確認してみた。

何となくExcel/PowerPointでの操作に近いことはできそうな感じはする。

---

特に最後の例などを見ると、Excel/PowerPointのオートシェイプというのはよくできているなと思う。

だったらそちらを使えば…という思いもなくはないが、ファイルがテキストでないためにGitなどでの差分管理が適切にできないという点が引っかかる。yEd単独で使いたいのではなく、Markdownのようなテキストフォーマットでドキュメント作成・バージョン管理するのはどうかというお題からスタートしているので、テキストファイルとして保存されることは重要視したい。適切なバージョン管理(差分確認)という意味では、突き詰めると本当はmermaidやPlantUMLなどを使って”人が読んで理解できる”テキスト形式を選ぶ必要があるのだが。

また、Excel/PowerPointだと画像としてエクスポートする手順も面倒になると思うし、yEdが複雑なレイアウトを自動的に整理してくれるという機能もなかなか使えそうで、これだけでもyEdを選んでも良いのではないかと思う部分もある。

…などなど、現実的にどうするのが良いかというのは、実際に描きそうな図が表現できるのかを試してみたり、もう少し周辺の仕組み(GitLabでのマージリクエストやCI運用)とセットでシミュレーションしてみて考えたい。
