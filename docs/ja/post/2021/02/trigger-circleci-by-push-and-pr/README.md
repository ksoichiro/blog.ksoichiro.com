---
title: CircleCI 2.1 の pipeline を push と pull request で実行する
tags: ["CircleCI"]
---

## CircleCI は push と pull request 両方をトリガーにすることができない

CircleCI は、デフォルトでは push をトリガーにしてビルドするようになっている。
push がトリガーのほうが良いこともあるのだが、GitHub であれば pull request の作成や更新をトリガーにしてほしいこともある。
pull request でのみビルドしたい場合は、 `Only build pull requests` というオプションを有効にすればいい。
ただ、これはデフォルトブランチへの pull request とデフォルトブランチへの push、タグがビルド対象になるようで、これだけでは不足することもある。
push、pull request の両方を対象にビルドできるようにしたい。

そんな場合は、GitHub Actions で pull request のイベントを hook して、そこから API で CircleCI の pipeline をトリガーすることができる。
<!--more-->
## parameters による条件付き実行

2021年1月現在、CircleCI の 2.1 が最新だが、API については 2.1 でジョブを起動することはできないと書かれている。
https://circleci.com/docs/ja/2.0/api-job-trigger/

ただこれはあくまで `job` が起動できないだけであって、より大きい単位である `pipeline` は起動することができるというのが以下で説明されている。
https://support.circleci.com/hc/en-us/articles/360041503393-A-workaround-to-trigger-a-single-job-with-2-1-config

`pipeline` は設定の全体を指しているが、その一部だけを指定することができないため、パラメータを与えて条件付きで特定のジョブを実行できるように構成すれば良い。

### CircleCI の設定

まず `.circleci/config.yml` で `pull_request` という `boolean` 型のパラメータを用意する。
そして、 `workflow` の中の各ジョブの条件を `when` または `unless` で指定し、その中でこのパラメータを使う。
`when`, `unless` については以下で説明されている。
https://circleci.com/docs/2.0/configuration-reference/#using-when-in-workflows

例えば以下のように書くと、 `parameters` を送ることのできない push では `push` ジョブが実行され、 `parameters` として `pull_request: true` を pull request 時に送ると `pull_request` ジョブを実行することができる。

```yaml
version: 2.1

parameters:
  pull_request:
    type: boolean
    default: false

orbs:
  welcome: circleci/welcome-orb@0.4.1
  hello: circleci/hello-build@0.0.5

workflows:
  push:
    unless: << pipeline.parameters.pull_request >>
    jobs:
      - welcome/run

  pull_request:
    when: << pipeline.parameters.pull_request >>
    jobs:
      - hello/hello-build
```

### GitHub Actions の設定

GitHub Actions での設定は、以下にある回答と同様。
https://stackoverflow.com/questions/44672893/is-there-a-way-to-trigger-a-circleci-build-on-a-pull-request?rq=1

```yaml
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger CircleCI
        env:
          CIRCLE_BRANCH: ${{ github.head_ref }}
        run: |
          curl -X POST \
          -H 'Circle-Token: ${{secrets.CIRCLE_TOKEN}}' \
          -H 'Content-Type: application/json' \
          -H 'Accept: application/json' \
          -d "{\"branch\":\"${CIRCLE_BRANCH}\",\"parameters\":{\"pull_request\":true}}" \
          https://circleci.com/api/v2/project/gh/ORG_NAME/REPO_NAME/pipeline
```

`ORG_NAME`, `REPO_NAME` はリポジトリのオーナーと名前で読み替える。

### Circle-Token の発行・管理方法

`Circle-Token` ヘッダ (上記の `CIRCLE_TOKEN`) は、CircleCI のユーザのページで発行した Personal Access Token を GitHub のリポジトリの設定で Secret として登録する必要がある。
CircleCI ではプロジェクトレベルの token を発行することもできるのだが、現状この token で pipeline を trigger することはできず、Personal Access Token が必要となるらしい。

個人のリポジトリならこれで十分だが、組織で利用する場合は個人のトークンを設定するのは適切ではないだろう。
現状だと、特定の人と紐付かないアカウント(マシンユーザ)を作って Personal Access Token を発行し、そのアカウントをチームで管理するのがワークアラウンドとなりそう。

## push と pull request の両方でトリガーできると何が良いか？

以下は、push トリガーと pull request トリガーで考えられるメリットの例。
GitHub Actions で完結するならそれで良いし、コスト面でむしろ pull request ベースに制御したいという場合はそうすれば良い。

### push でのトリガー

- ビルドを早く実行することができる
- pull request を作って関係者の注目をひかなくても CI/CD を利用したタスクを手軽に実行できる

### pull request でのトリガー

- マージ先のブランチとの変更差分に対してチェックすることができる
- pull request にコメントをフィードバックすることができる
