---
title: GitHub Actions で pull request の approve 時にコメントする
tags: ["CI", "GitHub Actions"]
---
GitHub Actionsを使って、pull request を中心とした開発におけるちょっとした自動化ができないかと探っている。
人の出入りが多い、あるいはたまにしか触らない人が多いようなリポジトリにおいては、開発ワークフローのようなものを丁寧にドキュメント化したとしても、読み込んで守ってもらうのは難しいと思っている。
自然に開発を進めていくだけで次のアクションを示してくれる、もしくは強制させられる、という方が効果があるだろう。

そのような考えのもと、pull request が approve されてマージできる状態になったというタイミングで GitHub Actions を使ってコメントをすることを試してみた。
このコメントで、マージする前もしくはマージした後にやってほしいことを知らせることができる。
以下のように、approve されると bot がコメントを返すイメージ。

![](/img/2021-03-comment-on-pr-when-approved_1.png)

<!--more-->

## どのような方法があるか

マージできるようになったタイミングでコメントする、というのが本当にやりたいことではあるが、それをやるにはどのような方法があるか？
以下の方法があると考えた。

1. pull request が approve されたことを検知してコメントする
    - pull request のマージには approve が必要と設定している場合において、 approve されたことを検知する
2. pull request の status が mergeable になったことを検知してコメントする
    - status check を有効にして、特定の check が成功しないとマージできないようにしている場合において、この status check が pass したことを検知する

いずれも[プルリクエストのマージ可能性を定義](https://docs.github.com/ja/github/administering-a-repository/defining-the-mergeability-of-pull-requests)で説明されている保護ブランチに対しての制御がある状況を想定している。

チームで開発している場合において、より厳格なルールを設定していくとしたら approve に加えて status check を有効にすると思われるので、2. が実現できた方が良いとは思った。
しかし、[Events that trigger workflows](https://docs.github.com/en/actions/reference/events-that-trigger-workflows)を見てもそれらしいものが見当たらない。
1.の approve については、[Feature Request |trigger action on “Pull Request Approved”](https://github.community/t/feature-request-trigger-action-on-pull-request-approved/18413)を見つけ、[pull_request_review](https://docs.github.com/en/actions/reference/events-that-trigger-workflows#pull_request_review)で実現できそうだったので試してみた。

ちなみに [approved-event-action](https://github.com/taichi/approved-event-action) という action はすでに存在するのだが、v1.2.1 では以下のようなエラーが出てしまい動作しなかった。

```
Error: Unable to process command '::set-env name=APPROVED,::true' successfully.
Error: The `set-env` command is disabled. Please upgrade to using Environment Files or opt into unsecure command execution by setting the `ACTIONS_ALLOW_UNSECURE_COMMANDS` environment variable to `true`. For more information see: https://github.blog/changelog/2020-10-01-github-actions-deprecating-set-env-and-add-path-commands/
```

## 準備

検証のために[GitHub のプロジェクト root に CODEOWNERS を設定する](/ja/post/2021/02/codeowners-for-root-dir/)の方法で誰かがpull requestを作り、自分がapproveできるという状態を作る。
これを使って、issue を open することで pull request を生成し、それを approve して action を実行させる。
結果だけほしい人はこれは必要ないが、一人であれこれ試したい場合には有用。

## approved を検知する

これが一番重要だが、 approved は以下のように `pull_request_review` の `submitted` タイプを拾って `state` をチェックすると処理することができる。

```yml
on:
  pull_request_review:
    types: [submitted]

jobs:
  check-state:
    if: github.event.review.state == 'approved'
```

この条件を満たさない場合、例えば comment として review を submit した場合は job は skipped となり何も実行されない。

## 一度だけコメントする

複数のレビューアが approve することはある得るし、一人のレビューアであってもレビューは何度でも登録できるので、上記の条件だけでは同じイベントが繰り返し発生し得る。
その度にコメントするのを避けたければ、既存のコメントを探してから登録または更新するのが良い。
それには [peter-evans/find-comment](https://github.com/peter-evans/find-comment) の action が使える。
これを使って、GitHub Actions bot からの特定の形式のコメントがあればコメント済みとみなしてそのコメントの更新を試み、そうでなければ新規にコメントするようにする。

```yml
- name: Find last comment
  id: find-last-comment
  uses: peter-evans/find-comment@v1
  with:
    issue-number: ${{github.event.pull_request.number}}
    comment-author: 'github-actions[bot]'
    body-includes: 'Change for master is approved!!'
```

この workflow によるコメントであることを示す明確なタグなどが設定できればよいのだが、残念ながらコメント本文に何が含まれるか、という程度でしか識別はできなさそう。

## 特定ブランチへの pull request に制限する

こういった制御は特定の保護ブランチへの pull request のみを対象にしたいだろうが、その場合は `on.pull_request_review.branches` は使えない。
例えば `master` ブランチへの pull request が approve された場合の action を実装したい場合には以下のように書いてしまいそうだが、これは動作しない。

```yml
on:
  pull_request_review:
    types: [submitted]
    branches: ['master']
```

なぜなら、この action を動作させる対象は `master` ブランチではなく、それを base branch とする pull request 側のブランチだから。
(当然ではあるが、直感的に間違ってしまいやすそう。)
対象の base ブランチを制限したい場合は、github context で pull_request イベントの内容を取得してブランチをチェックするようにする。

```yml
jobs:
  check-state:
    if: github.event.review.state == 'approved' && github.event.pull_request.base.ref == 'master'
```

この条件が複雑になる場合は step を分けてもいいかもしれない。

## コメントする

コメントが見つからなかった場合にのみコメントする。
コメントには [peter-evans/create-or-update-comment](https://github.com/peter-evans/create-or-update-comment) を使う。

```yml
- name: Comment
  if: steps.find-last-comment.outputs.comment-id == ''
  uses: peter-evans/create-or-update-comment@v1
  with:
    issue-number: ${{github.event.pull_request.number}}
    body: "Change for master is approved!! Merge it carefully."
```

## 完成

最終的な workflow は以下の通り。

```yml
name: Respond to approved

on:
  pull_request_review:
    types: [submitted]

jobs:
  check-state:
    if: github.event.review.state == 'approved' && github.event.pull_request.base.ref == 'master'
    runs-on: ubuntu-latest
    steps:
      - name: Find last comment
        id: find-last-comment
        uses: peter-evans/find-comment@v1
        with:
          issue-number: ${{github.event.pull_request.number}}
          comment-author: 'github-actions[bot]'
          body-includes: 'Change for master is approved!!'

      - name: Comment
        if: steps.find-last-comment.outputs.comment-id == ''
        uses: peter-evans/create-or-update-comment@v1
        with:
          issue-number: ${{github.event.pull_request.number}}
          body: "Change for master is approved!! Merge it carefully."
```
