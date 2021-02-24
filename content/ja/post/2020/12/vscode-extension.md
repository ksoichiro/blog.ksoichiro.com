---
title: "VSCode Extension"
noEnglish: true
originalCreatedAt: 2020-12-21T00:42:00.002+09:00
tags: ["VSCode"]
---
少し前に [Status Bar Title](https://marketplace.visualstudio.com/items?itemName=ksoichiro.vscode-status-bar-title) という VSCode Extension を作った。全然大したことないのだが、2020年ももう終わりに近づくのに今年は全然書いていなかったので記録しておく。

![](/img/2020-12-vscode-extension_1.png)

<!--more-->

## 作った理由

vim などのように terminal ベースのエディタを使っていると、作業領域が広く取れるのが良いなと思っていて、VSCode でも少しでも近づけられればと思ったところ [Customize UI](https://marketplace.visualstudio.com/items?itemName=iocave.customize-ui) という extension を見つけた。

これを使うと、Activity Bar (エクスプローラ、検索、等のメニューのアイコンが並んだバー) の位置を変えたり、タイトルバーを隠すことができる。

これは良いと思ったが、タイトルが出ていないと、複数のウィンドウを開いているときに今どのウィンドウが開いているのかわかりにくいという問題がある。

エクスプローラの上部に表示されているが、視認しにくいのと、エクスプローラ以外を表示していると見えない。

![](/img/2020-12-vscode-extension_2.png)

だったらタイトルバーを表示すれば良いのでは…と思うかもしれないが、タイトルバー非表示のほうが何かカッコいいなと思ってしまったのだよな…

そこで、ステータスバーにタイトル(プロジェクト名)を表示できれば良いと思ったのだが、標準機能にはないらしく、ちょうどよい extension も見つからなかったので、作ってみることにした。

## 結果

結果が以下。Gitのブランチ名(master)の左側に表示されている `memorandum` の部分がプロジェクト名。本当に表示だけで、クリックしても何も起きない。

![](/img/2020-12-vscode-extension_3.png)

ウィンドウ全体で見るとこんな感じ。目立たないが、同じ位置にあるとわかっていればそれなりに見分けられる。

![](/img/2020-12-vscode-extension_4.png)

extension のデバッグのウィンドウ(Extension Development Host)の場合はアイコンがbugのアイコンに変わる (これはextensionの開発者向けの相当に地味な機能…)。

![](/img/2020-12-vscode-extension_5.png)

こんな地味なもの使う人は自分くらい…とも思ったが、わずかながらダウンロードしてくれている人がいる。(最初の5~8件くらいは自分)

![](/img/2020-12-vscode-extension_6.png)

リポジトリは [こちら](https://github.com/ksoichiro/vscode-status-bar-title)。

## 内容

本当に単純で、Hello Worldレベルな感じ。

起動とともに有効にしてほしいextensionなので、アクティベーションのイベントはすべて(`*`)。

```json
"activationEvents": [
  "*"
],
```

activate の function で statusBarItem を作って登録する。

位置の制御のために優先度を示す整数値を与えるが、他のextensionがあっても基本的に一番左に表示したいという意味で大きい値を設定している。

```js
myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 10000);
context.subscriptions.push(myStatusBarItem);
```

あとは表示するitemを組み立てるだけ。

前述の通り Extension Development Hostかどうかという判定は [https://github.com/microsoft/vscode/issues/10272](https://github.com/microsoft/vscode/issues/10272) のworkaroundに頼っているが、それ以外は単純にworkspace名とアイコンを文字列で設定しているだけ。アイコンについては [Product Icon Reference](https://code.visualstudio.com/api/references/icons-in-labels) で説明されているが、 `$(project)` という文字列表現だけで簡単に設定できる。

```js
const isDevelopment = vscode.env.sessionId === 'someValue.sessionId';
const icon = isDevelopment ? '$(debug)' : '$(project)';
const name = vscode.workspace.name;
if (name) {
	myStatusBarItem.text = `${icon} ${name}`;
	myStatusBarItem.show();
}
```

## リリース

細かな手順は様々なブログ等で説明されているので割愛するが、1点だけ。

ちょうどこの頃、GitHubではGitリポジトリのデフォルトブランチをmasterブランチではなくmainブランチとするようになった頃だったのだが、これに沿って main ブランチとしたところ、VSCode Extension の marketplace でうまく画像が出ないという事象に遭遇した。工夫をすれば回避できなくもなさそうだったが、その後も問題に遭遇しそうな気がしたので、まだ main にするのは早いかなと判断して master に戻した。
