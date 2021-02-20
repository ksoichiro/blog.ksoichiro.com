---
title: "ghqのroot配下ではVCS導入しないとghq listが遅くなる"
originalCreatedAt: 2020-01-11T23:36:00.002+09:00
tags: ["ghq","Git"]
---
今さらながら ghq を使うのをデフォルトにしようと考えてローカルにあるリポジトリをすべて ghq の root に移したところ、`ghq list` がだいぶ遅くなったように感じた。

以下が原因＆解決策であった。  
https://hirakiuc.hatenablog.com/entry/2017/05/06/205846

バージョン管理システムがないディレクトリが多数含まれていると遅くなってしまうらしい。

サンプルプロジェクトは `~/.ghq/github.com/ksoichiro` に移動してあったため、そのディレクトリで以下を実行して git 管理としたところ改善した。(管理といっても git init しているだけ)

```sh
for i in $(ls -1); do if [ ! -f $i/.git/config ]; then echo "$i is not in vcs"; pushd $i > /dev/null; git init; popd > /dev/null; fi; done
```
