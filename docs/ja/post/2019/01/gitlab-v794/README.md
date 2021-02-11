---
title: "GitLab v7.9.4 のサーバ移行とアップグレード"
created: 2019-01-20T19:47:00.001+09:00
tags: ["GitLab"]
---
GitLab Omnibus Package でインストールして運用してきた古い GitLab を別のサーバに移行し、最新版にアップグレードしたい。

ここでは v7.9.4 からの移行とアップグレードを考える。

サーバ移行については、データバックアップが取れるのでそれを新環境で取り込めば良い。

アップグレードについては Omnibus Package でインストールしたものなら基本的に以下を参照すればできる。
[https://docs.gitlab.com/omnibus/update/](https://docs.gitlab.com/omnibus/update/)

メジャーバージョンアップはバージョンをまたがない方がよい(1つずつ上げる)ということで、何度かに分けて上げる。

基本的に公式ドキュメントに記載されていることを正しく読み取って組み合わせれば良いのだが、以下では今回のケースで必要なことを事例として説明する。

## サーバ移行

データをバックアップして、tarを抽出しておく。

```sh
gitlab-rake gitlab:backup:create
```

`/var/opt/gitlab/backups` に作られた tar ファイルを利用する。
サイズを小さくしたければ gzip してから取り出す。
また、このファイルに含まれない設定ファイル群は個別にバックアップする必要がある。

移行先については、ここでは Vagrant で構築した Ubuntu のサーバを想定する。

Vagrant の場合、 [gitlab-i18n-patch](https://github.com/ksoichiro/gitlab-i18n-patch) にある Vagrantfile やシェルスクリプトを参考に構築できる。

これを参考に(日本語化パッチをあてていない) GitLab をインストールする。日本語化パッチはその後のアップグレードの妨げになるかもしれないため、必要なら最後に適用する。
なお、バージョン 9.2 以降は多言語化がサポートされているため、その内容でよければパッチは不要である。

gitlab-i18n-patch の Vagrantfile ではポートフォワードさせる設定になっているが、移行後に clone などを確認するなら `private_network` の設定をして IP アドレスを割り当て、 `/etc/gitlab/gitlab.rb` の `external_url` をその値で設定しておく。

立ち上がるようになったら、`/var/opt/gitlab/backups` の中に、旧サーバで取得した tar ファイルを配置する。

バックアップが複数ある場合はプレフィクスを指定する必要があるが、以下のようにデータベースアクセスのあるプロセスを止めた上でリストアする。

```sh
gitlab-ctl stop unicorn
gitlab-ctl stop sidekiq
gitlab-rake gitlab:backup:restore
```

あとは設定ファイルとして `/etc/gitlab/gitlab-secrets.json` や `/etc/gitlab/gitlab.rb` を適切にリストアし、`gitlab-ctl restart` で反映する。

## アップグレード

基本的に [公式ドキュメント](https://docs.gitlab.com/omnibus/update/) で説明されている通りに実施すれば良い。

v7.9.4 のような古いバージョンから最新版へアップグレードしたい場合、1回の操作でアップグレードするのではなく、 [こちらに説明されているように](https://docs.gitlab.com/ee/policy/maintenance.html#upgrade-recommendations) アップグレードパスとして推奨されているステップに沿って複数回のアップグレードを重ねる。

今回は以下の順番で実施。

1. 7.9.4->8.17.7
2. 8.17.7->9.5.10
3. 9.5.10->10.8.7
4. 10.8.7->11.6.5 (現時点での最新版)

ひとつひとつのアップグレード手順は非常に簡単。

手動でパッケージをダウンロードしてアップグレードする手順の場合、 [パッケージの配布サイト](https://packages.gitlab.com/gitlab/gitlab-ce) からファイルをダウンロードして適用する。
先ほどの Vagrantfile で構築した環境なら、ubuntu/precise のパッケージが利用できる。
以下のような手順。

```sh
cd /usr/local/src
wget --content-disposition https://packages.gitlab.com/gitlab/gitlab-ce/packages/ubuntu/precise/gitlab-ce_XXX_amd64.deb/download.deb
dpkg -i gitlab-ce_XXX_amd64.deb
gitlab-ctl restart
```

注意点として、v9.2 以降は precise のパッケージが配布されていないため、trusty にアップグレードするなどの対応が必要。
precise から trusty へのアップグレードは以下などが参考になる。
[[Ubuntu] 12.04 から 14.04 へアップデートした時のメモ](https://qiita.com/white_aspara25/items/5187b357235ce9d275bf)
GitLab で現在配布されているのは v7.10 が一番古いバージョンのようだが、これも trusty 用のものが配布されているので、新規に構築するなら最初から trusty にインストールしたほうがスムーズ。

今回は Vagrant での手順を説明したが、この環境をそのまま運用する必要はない。ここからさらにバックアップを取って、運用環境にデータを移行することもできる。アップグレードが失敗するリスクを心配する場合は、このようなやり直しがしやすい環境でアップグレードを試し、うまくいったらデータを運用環境に持っていくという手順も良いかもしれない。

## 日本語化の今後

現在は公式に日本語化も進められているようだが、v9, v10 は日本語化されている部分が少なく、最新の v11.6.5 でもまだ英語の部分が多い印象だった。

v9.2 以降での日本語化の仕方がわからなかったため検索してみたところ、gitlab-i18n-patch を使って日本語化してくれている方の記事が 2018 年のものでもいくつも見つかった。既に v11 系もリリースされているにもかかわらず、最後に追加した v9.1.4 のパッチを適用している。v9.2 での多言語化対応が開始した時点で gitlab-i18n-patch の更新はやめてしまったのだが、もしかしたら gitlab-i18n-patch での日本語化はまだニーズがあるのかもしれない。v9.2 以降のコードでも今の gitlab-i18n-patch の仕組みで翻訳できそうなら取り組んでみよう。
