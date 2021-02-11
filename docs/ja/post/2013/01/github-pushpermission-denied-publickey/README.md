---
title: "GitHub pushすると「Permission denied (publickey)」"
created: 2013-01-03T14:58:00.001+09:00
tags: ["GitHub"]
---
先日、GitHubにpushしようとしたところで と表示されてしまいました。

原因は、単純にGitHub上に現在のsshキーが登録されていなかった(削除してしまった？)ことでした。 単純すぎますが、解決するまでの過程をメモしておきます。

## エラー

普通にpushします。

## 確認

GitHubのトラブルシューティングの通り、コマンドで確認してみると、GitHub用のキーのエントリがありませんでした。(フィンガープリントは念のため伏せています)

## 追加

ssh-addでエントリを追加しました。(この手順、結局要るのかどうかは不明です。)

## GitHubにキーを追加

公開鍵ファイルの内容をコピーして、GitHubのSSH Keysから登録します。下記も一部内容は伏せています。

## 再確認

もう一度コマンドで確認してみると、問題ないようです。これでsshでpushできるようになりました。
参考:
[Error: Permission denied (publickey)](https://help.github.com/articles/error-permission-denied-publickey)
