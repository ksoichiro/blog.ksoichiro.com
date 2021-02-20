---
title: "iOS ローカライズが失敗してNSLocalizedStringのキーが表示される"
originalCreatedAt: 2013-04-21T23:34:00.000+09:00
tags: ["ローカライズ","EverForm","iOS","NSLocalizedString"]
---
致命的なミスです。
先日リリースした「 [EverForm for iOS](https://itunes.apple.com/jp/app/everform-for-ios/id630680690?mt=8)」ですが、英語のローカライズに失敗した状態でリリースしてしまいました。
アップデート版は先ほど申請しました。
<!--more-->
何が問題かというと、NSLocalizedStringの第1引数に与えたキーがそのまま表示されてしまいます。 同じ問題にぶつかった人が検索しやすいように、キーワードを挙げておくと… NSLocalizedStringのkeyが表示される、ラベルのまま表示される、使われない、といったところでしょうか。

EverForm for iOSの場合、言語をEnglishにしてビルド、実行すると発生しました。

最初はAppStore用のプロビジョニングプロファイルを使用した場合でのみ発生する事象なのかと疑ったのですが、通常のビルドでも発生しました。
実は開発中にローカライズの確認をしていたときも何度か発生していたのですが、 2回ビルドして実行すると解消されたため、Cleanするだけでは前回の結果が消えないものがあるのだと思いあまり気にしていませんでした。 結果的に、原因はLocalizable.stringsがプロジェクト内に複数あったことでした。

原因が分かったきっかけは、あれこれ調べた結果以下のコメントを見つけたことです。

> Check if you have more than one Localizable.strings in your project. Merging them into one solved it for me.
>
> [http://stackoverflow.com/questions/6709350/xcode-localized-string-not-loaded](http://stackoverflow.com/questions/6709350/xcode-localized-string-not-loaded)

それから「2回ビルドすると解決する」という事実、
JapaneseとEnglishのローカライズされたファイル数が違う、
ということでした。
ローカライズされたファイル数はプロジェクト(XXX.xcodeproj)の「PROJECT」＞「INFO」＞「Localizations」で確認できますが、英語の方が1つ多かったのでした。
それが何かというと、使用しているEvernote SDKのライブラリ内に存在している英語のLocalaizable.stringsです。
ビルドすると、このファイルとメインの(元々自分で用意した)en.lproj/Localizable.stringsが交互で適用されるようで、マージはされません。
そのため、ビルドした1回目はNSLocalizedStringのキーがそのまま表示され、2回目は正常に表示されます。
開発中は日本語でデバッグし、英語ではローカライズ文字列の確認をする程度だったため、同じコードのまま3回以上ビルドすることがなく気付かなかったのですが、試しに3回以上ビルドしてみると、ローカライズ失敗、成功、失敗、…と繰り返されました(つまり確かに二つのLocalizable.stringsが交互に適用されています)。

ちなみにXcodeのバージョンは4.6(4H127)です。

国際化のための常識なのかもしれませんが、普通に書籍を数冊読んだだけでは知らない知識でした。。。

もしかするとこういった状態になるのはさらに条件があるのかもしれませんが、
同じような事象に遭遇された方の参考になれば幸いです。
