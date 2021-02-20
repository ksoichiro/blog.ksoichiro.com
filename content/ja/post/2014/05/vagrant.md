---
title: "[Vagrant] 開発環境用のテンプレート"
createdAt: 2014-05-02T21:29:00.002+09:00
tags: ["Ubuntu","VIM","Vagrant","Android"]
---
Vagrantfileやセットアップ用のスクリプトをテンプレートとしてGitHubにいくつか登録してみた。
[https://github.com/ksoichiro/vagrant-templates](https://github.com/ksoichiro/vagrant-templates)
<!--more-->
セットアップは基本的にすべてシェルスクリプト。
(結果的に、Dockerで書きたくなったときに移植しやすいので良かったかも)

## Ubuntu上でDockerが使えるテンプレート

Macならboot2dockerがあるのでメリットはないが、Windowsでも使えるようにしたい場合に役立つかも？
[https://github.com/ksoichiro/vagrant-templates/tree/master/templates/precise64-docker](https://github.com/ksoichiro/vagrant-templates/tree/master/templates/precise64-docker)

## Ubuntu上でGitLabが使えるテンプレート

英語、かつバージョンは固定です。
[https://github.com/ksoichiro/vagrant-templates/tree/master/templates/precise64-gitlab](https://github.com/ksoichiro/vagrant-templates/tree/master/templates/precise64-gitlab)

## Ubuntu上でAndroid SDKが使えるテンプレート

こちらもバージョンは固定なものの、少し変更すれば他のバージョンでもすぐに使える。
ホストOSにAndroid開発環境がなくてもアプリがビルドできる。
Dockerの方が使えそう。
[https://github.com/ksoichiro/vagrant-templates/tree/master/templates/precise64-android](https://github.com/ksoichiro/vagrant-templates/tree/master/templates/precise64-android)

## Ubuntu上でAndroidエミュレータが使えるテンプレート

上のAndroid SDKにエミュレータを追加したもの。
エミュレータはARMなので遅いです。
[https://github.com/ksoichiro/vagrant-templates/tree/master/templates/precise64-android-emulator](https://github.com/ksoichiro/vagrant-templates/tree/master/templates/precise64-android-emulator)

## VIM(日本語利用可)が使えるテンプレート

実行環境用途だけでなく編集もしたい、という場合の参考に。
[https://github.com/ksoichiro/vagrant-templates/tree/master/templates/precise64-vim-jp](https://github.com/ksoichiro/vagrant-templates/tree/master/templates/precise64-vim-jp)

上記はすべて Ubuntu Precise 64bitの base image から作っているもので、
vagrant up && vagrant stop && vagrant package してできた box を以下からダウンロードできるようにしてみた。
[http://customboxes.herokuapp.com/](http://customboxes.herokuapp.com/)
