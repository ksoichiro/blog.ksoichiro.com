---
title: VuePress で正しい最終更新日を表示する
tags: ["VuePress", "GitHub Actions"]
---
ローカルでビルドしている限りは問題なかったのだが、 GitHub Actions でビルドして Firebase Hosting にデプロイするように変更したところ、最終更新日が現在日時になってしまったので対処した。

## 何が起きたか？

デプロイしたブログを確認してみると、日付がおかしいことに気づいた。
トップページにすべて同じ日付が表示されている。
ページ一覧にも手を入れていたのでそれを疑ったが、各ページを表示してみてもすべて同じ日付になっている。

ローカルでは正しく表示されているので、ビルド周りがおかしいと考えた。
<!--more-->
## @vuepress/plugin-last-updated を確認

[@vuepress/plugin-last-updated のソースコード](https://github.com/vuejs/vuepress/blob/master/packages/%40vuepress/plugin-last-updated/index.js)を確認して、最終更新日が `git log -1 --format="%at"` というコマンドから取得されているということがわかった。
しかし、 git の [pretty formats](https://git-scm.com/docs/pretty-formats)などを見ても、現在時刻が取得されるようには見えない。

## actions/checkout を確認

とはいえ、ローカルとの差分があるとなると git repository に差分があるのだろうと考えて `actions/checkout` の action を確認してみると、デフォルトでは `fetch-depth` が `1` になっているようで、履歴がフェッチされていないらしい。
履歴がないため、記事の Markdown ファイルの author date (`%ai`) も取得できていなかったようだった。

以下のように [`fetch-depth` に `0` を指定することで履歴が取得できる](https://github.com/marketplace/actions/checkout#fetch-all-history-for-all-tags-and-branches)ようになった。

```yaml
steps:
  - uses: actions/checkout@v2
    with:
      fetch-depth: 0
```

このリポジトリが大きくなってきたらビルドが遅くなることもあるかもしれないが、それはそのときに考える。

## 日付の形式を修正

さらに、CI でビルドすることによってタイムゾーンも `Asia/Tokyo` でなくなり、不自然な日付を表示してしまうようだったので、指定するようにした。

[dayjs](https://github.com/iamkun/dayjs) を使って、`.vuepress/config.js` に `@vuepress/plugin-last-updated` を以下のように指定。

```js
[
  '@vuepress/last-updated',
  {
    transformer: (timestamp, lang) => {
      const dayjs = require('dayjs')
      const utc = require('dayjs/plugin/utc')
      const timezone = require('dayjs/plugin/timezone')
      dayjs.extend(utc)
      dayjs.extend(timezone)
      return dayjs(timestamp).tz('Asia/Tokyo').format('YYYY/MM/DD HH:mmZ')
    }
  }
],
```

これで最終更新日は `2021/02/05 00:28+09:00` のような形式で出力される。
タイムゾーンを指定しているので、選択した言語や実行環境によらず日本時間で表示される。
(ブログの日付にしては細かすぎるけど :innocent:)
