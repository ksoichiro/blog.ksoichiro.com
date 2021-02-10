---
title: GitHub のプロジェクト root に CODEOWNERS を設定する
description: プロジェクトの直下というのは、ソースコードの置かれるディレクトリがあるのはもちろんだが、. で始まるような設定ファイルなど、全体に影響するような重要なファイルが置かれることが多い。
date: 2021-02-07 00:00
tags: ["GitHub", "GitHub Actions"]
---
プロジェクトの直下というのは、ソースコードの置かれるディレクトリがあるのはもちろんだが、`.` で始まるような設定ファイルなど、全体に影響するような重要なファイルが置かれることが多い。
そのため `CODEOWNERS` ファイルを使ってプロジェクト直下だけでもレビューを必須にできないかと考えた。

## マシンユーザを使った検証

検証するには複数人のユーザが必要になるが、手動の操作では一人で検証することができない...。
GitHub では CI で使用するようなマシンユーザを作成することは許可されている。
そこで、GitHub Actions でマシンユーザが自動的に pull request を作成するようなパターンを想定して、その場合に期待するファイルが code owner の approve 必須となるかどうかを確認してみた。

ここでは、issue を open することをトリガーとして pull request が作られるようにした。

各種の GitHub Actions の説明を参考に以下のように設定してみると、issue を open することで pull request を作ることはできた。
しかし、 commit して pull request を作成するのが自動であっても、以下の書き方では自身が commit したことになってしまう。

```yaml
name: Create Pull Request

on:
  issues:
    types: opened

jobs:
  create-pull-request:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Create changes
        run: |
          date +%s > report.txt

      - name: Create Pull Request
        id: cpr
        uses: peter-evans/create-pull-request@v3
        with:
          token: ${{secrets.BOT_REPO_TOKEN}}
          commit-message: Update report
          committer: GitHub <noreply@github.com>
          author: ${{ github.actor }} <${{ github.actor }}@users.noreply.github.com>
          signoff: false
          branch: example-patches
          delete-branch: true
          title: '[Example] Update report'
          draft: false
```

マシンユーザに commit させるには、create-pull-request の action で `author` を設定する。

```yaml
      - name: Create Pull Request
        id: cpr
        uses: peter-evans/create-pull-request@v3
        with:
          ...
          committer: GitHub <noreply@github.com>
          author: ksoichiro-bot <ksoichiro-bot@users.noreply.github.com>
```

これで、issue を作るとマシンユーザが指定のファイルを変更して pull request が作られるようになり、 `CODEOWNERS` がどのように作用するか確認できるようになった。

## CODEOWNERS の挙動

ここからが本題。

### すべてのファイルを approve 必須とする

[CODEOWNERS の説明](https://docs.github.com/ja/github/creating-cloning-and-archiving-repositories/about-code-owners#example-of-a-codeowners-file)に書かれている通り、`.github/CODEOWNERS` を以下のように定義してみる。

```
* @ksoichiro
```

これは、設定が上書きされない限りプロジェクト内のすべてのファイルが approve 必須という設定になる。ここまで厳しくはしたくない、というのが今回の状況である。

### 直下のファイル追加/変更を approve 必須とする

プロジェクト直下のファイルを対象にしたいため、 `.github/CODEOWNERS` を以下のように定義してみる。

```
/* @ksoichiro
```

こうすると、 `a` という既存ディレクトリに対して `a/report.txt` という新規ファイルを追加してもレビューアは設定されなかった。
ではこれで解決かというと、残念ながらそうではなかった。

プロジェクト直下に新しいディレクトリ(とその配下のファイル)が作られた場合は、ディレクトリ追加自体は直下への変更なので approve を必須としたいところだが、そうはならなかった。
つまり、このルールだけでは、いつの間にかディレクトリが作られているということはあり得えてしまう。

## 結論

`CODEOWNERS` ファイルの記法では後に書いたものが優先されるということだが、先に書いたものを打ち消すことはできず、レビューアを再設定できるというだけにすぎない。
このため、現時点でプロジェクト直下のファイルを approve 必須としたい場合には以下のいずれかの選択となりそう。

- `*` の指定により、プロジェクト内のすべてのファイルの追加/変更をレビューする。
- `/*` の指定により、プロジェクト直下のファイルの追加/変更をレビューし、プロジェクト直下のディレクトリ追加や既存ディレクトリ配下の変更は承認なしでOKとする。
- `/*` の指定により、プロジェクト直下のファイルの追加/変更をレビューし、プロジェクト直下のディレクトリ追加を検知して approve を必須とするようなフローを作る。
