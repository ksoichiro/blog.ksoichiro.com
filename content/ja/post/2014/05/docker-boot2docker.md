---
title: "[Docker] boot2dockerでの共有フォルダ設定を忘れずに実行する"
originalCreatedAt: 2014-05-02T22:57:00.001+09:00
tags: ["boot2docker","Docker"]
---
[boot2docker](https://github.com/boot2docker/boot2docker) がすごく便利。
でも共有フォルダの設定が現時点ではまだサポートされていないようで・・
上記のREADMEでもfolder sharingはAdvanced Usageとして書かれている。
上記で紹介されているのが次のPull Requestで説明されている方法。
[https://github.com/boot2docker/boot2docker/pull/284](https://github.com/boot2docker/boot2docker/pull/284)
<!--more-->
boot2docker initで入るイメージではなく、手を入れたisoに差し替えた上で、vboxsfを使うようにコマンドを実行しなければならない。
これはboot2dockerを起動するたびに実行しなければいけないようなので.zshrcに以下のように書いてみた。

```sh
export DOCKER_HOST=tcp://localhost:4243
boot2docker status
if [ $? -ne 0 ]; then
  boot2docker up
  boot2docker ssh "sudo modprobe vboxsf && mkdir -p $HOME && sudo mount -t vboxsf home $HOME"
else
  echo "boot2docker is already running. Execute this manuallly:"
  echo 'boot2docker ssh "sudo modprobe vboxsf && mkdir -p $HOME && sudo mount -t vboxsf home $HOME"'
fi
```

boot2dockerが起動していなければ起動して共有フォルダ設定まで行い、 すでに起動していた場合は、共有フォルダ設定できていないかもしれないので 手動でコピー＆ペーストで設定できるようにコマンドを表示しておく。
