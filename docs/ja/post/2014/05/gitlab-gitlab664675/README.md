---
title: "[GitLab] GitLab6.6.4〜6.7.5 日本語化パッチ"
created: 2014-05-02T21:17:00.003+09:00
tags: ["GitLab"]
---
GitHubでのような開発がしたい！ということでGitLabを利用。
日本語には対応していないだが、英語に抵抗のあるメンバーもいるのでどうしても日本語化しておきたい・・・
ということで(かなり強引な感じの)日本語化のパッチを作成した。
[https://github.com/ksoichiro/gitlab-i18n-patch](https://github.com/ksoichiro/gitlab-i18n-patch)

**追記(2014/05/11)**

現時点で最新の6.8.1にも対応しています。
以前はインストールするのも大変だったが、今では
GitLab Omnibus Packageというパッケージが出ており
これで簡単にインストールできるようになっている。
[https://www.gitlab.com/downloads/](https://www.gitlab.com/downloads/)
CentOS, Ubuntu, Debianに対応している。

これをサーバにインストールして、gitlab-ctl reconfigureなどすれば
GitLabは(ほぼ)セットアップ完了。

上記の日本語化パッチは、この中のアプリ部分である gitlab-rails に適用する。

```sh
cd /opt/gitlab/embedded/service/gitlab-rails
patch -p1 < ~/app_ja.patch
```

基本的にはこれを実行して gitlab-ctl restart すればOK。
すでに稼働させている環境の場合は、public/assetsにあるキャッシュを更新しなければならないので以下も必要。

```sh
cd /opt/gitlab/embedded/service/gitlab-rails
rm -rf public/assets
export PATH=$PATH:/opt/gitlab/embedded/bin
rake assets:precompile RAILS_ENV=production
```

普通に使っていて見える部分を日本語化することを目的にしており、
動かなくなっている部分もあるかもしれないので、
もし利用してみたい方がいれば自己責任でご利用ください。

なお、各種文言の一部はDBに保存されたりするものもあるので、
日英が混ざった感じになることにも注意。
