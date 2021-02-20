---
title: "Concourse CI チュートリアルの実践"
originalCreatedAt: 2018-12-24T22:36:00.001+09:00
tags: ["CI","Concourse CI"]
---
[前回のエントリ](/ja/post/2018/12/ci/) でふれた Concourse CI について。
チュートリアルを試したのだが、いくつか躓くポイントがあったため記録しておく。
※Concourse CI を批判するわけではなく、単なる記録。
<!--more-->
環境としては Windows 10、Docker Toolbox の Docker で Concourse をインストールした。

### コンソール出力

Concourse は fly コマンドを使って操作することになっているが、まず、 fly コマンドを実行したときに色がうまく出ない。

```
C:\Users\soichiro\workspace\concourse-tutorial>fly -t tutorial watch -j hello-world/job-hello-world�[35maborted�[0m
```

builds コマンドでは着色されていたりするので、環境的な問題というよりコマンドごとの問題なのかもしれない。

### スクリプトの実行

[https://concoursetutorial.com/basics/task-scripts/](https://concoursetutorial.com/basics/task-scripts/)

そのままだと以下のようなエラーが発生して実行できない。

```
Backend error: Exit status: 500, message: {"Type":"","Message":"runc exec: exit status 1: exec failed: container_linux.go:348: starting container process caused \"exec: \\\"./task-scripts/task_show_uname.sh\\\": permission denied\"\n","Handle":"","ProcessID":"","Binary":""}
```

`./test.sh` の形式だとアクセス権がなく実行できない模様。
Windows全般の問題？

シェバンが `#!/bin/sh` なら、`sh test.sh` の形式にすることで実行はできる。

```yaml
run:
  path: sh
  args: ["./task-scripts/task_show_uname.sh"]
```

バイナリの場合は問題になるかも。

### スリープからの復帰失敗(未解決)

途中、PCをスリープさせたところ `docker-machine` 内からHTTPアクセスできなくなりジョブが失敗するようになったため、`docker-machine` を restart した。

```sh
docker-machine ssh default
sudo su -
shutdown -r now
docker-machine restart default
eval "$(docker-machine env)"
```

その後、unpause してジョブは動いているかのように見えたがことごとく失敗しており、CLI からリソースチェックしても以下のようになっていた。

```sh
$ fly -t tutorial cr -r hello-world/my-timer
error: check failed with exit status '70':
unknown handle: 7c3bb164-0233-44df-67b1-0d9d0bae2dcd
```

[concourseのissue#2603](https://github.com/concourse/concourse/issues/2603) より、workers を確認するのが良さそうだった。

```sh
$ fly -t tutorial workers
name          containers  platform  tags  team  state    version
43aec2779db0  0           linux     none  none  running  2.1


the following workers have not checked in recently:

name          containers  platform  tags  team  state    version
03dd08af10de  0           linux     none  none  stalled  2.1

these stalled workers can be cleaned up by running:

    fly -t tutorial prune-worker -w (name)
```

ここで `stalled` の表示になっているものを prune してみる。

```sh
$ fly -t tutorial prune-worker -w 03dd08af10de
pruned '03dd08af10de'

```

workers の一覧からは消えたが、解決しない。

`unknown handle` と表示されているのは container のようだが、これを削除するやり方があるのだろうか。

```sh
$ fly -t tutorial cs
handle                                worker        pipeline     job              build #  build id  type   name         attempt
098b0351-20c8-415a-50c5-f8911b8b8e27  43aec2779db0  none         none             none     none      check  none         n/a
5a6de26c-6544-40c2-69ac-2a09d756363c  43aec2779db0  hello-world  job-hello-world  9        21        task   hello-world  n/a
7c3bb164-0233-44df-67b1-0d9d0bae2dcd  43aec2779db0  none         none             none     none      check  none         n/a
fafbf18d-0116-4be9-4afb-472a10142432  43aec2779db0  none         none             none     none      check  none         n/a
```

わからないが、コンテナ自体は確認できるため

```sh
fly -t tutorial i -c hello-world/my-timer
```

でコンテナの中に入ってみたものの、何を見たら良いものか…
と考えているうちに、いつの間にか、定期的にトリガーイベントを発生させる `my-timer` のリソースと、チュートリアルのコード `resource-tutorial` の check は正常になり、動き始めていた。

しかし、結局タスク自体は失敗している。

```
task config 'resource-tutorial/tutorials/basic/task-hello-world/task_hello_world.yml' not found
```

リポジトリは clone できているのでそんなことはないはずなのだが…

[https://github.com/concourse/concourse/issues/1796](https://github.com/concourse/concourse/issues/1796)
これを参考にしてみると、この方の対処では

> - stop Concourse containers: docker-compose down
> - delete worker folder: rm -rf
> - start Concourse containers: docker-compose up -d
> - wait for worker to stall (or rather, wait for Fly to report it stalled), then prune it
> - everything goes back to normal

ということなので、worker のフォルダを docker の別ボリュームで分けておいて物理的に削除できるようにしたほうが良いのかもしれない。これは未確認。

改めて container を確認すると、使われていないものが残ったままになっている。

```sh
$ fly -t tutorial containers
handle                                worker        pipeline     job              build #  build id  type   name         attempt
098b0351-20c8-415a-50c5-f8911b8b8e27  43aec2779db0  none         none             none     none      check  none         n/a
5a6de26c-6544-40c2-69ac-2a09d756363c  43aec2779db0  hello-world  job-hello-world  9        21        task   hello-world  n/a
62c4120f-c67e-466b-77d6-c4c3a074a2b7  43aec2779db0  hello-world  job-hello-world  20       64        get    my-timer     n/a
6687c1f4-7636-4a0b-4940-0e6c7f891d62  43aec2779db0  hello-world  job-hello-world  19       63        get    my-timer     n/a
f192aa51-9e47-4d84-4af0-35e2248d57f7  43aec2779db0  none         none             none     none      check  none         n/a
fafbf18d-0116-4be9-4afb-472a10142432  43aec2779db0  none         none             none     none      check  none         n/a
```

一度 pipeline の設定から resource を削除し、ジョブを失敗させた後に再びもとの設定を反映した。(ビルド履歴を残したままにしようとした)

今度は `file not found` の結果となってしまった…。

仕方ないので pipeline を削除して再作成したが、同じ結果。
Windows で docker を使って試しているせいなのか…これだとかなり信頼性が低いと言わざるを得ない。

Concourse 自体を再起動してみる。

```sh
docker-compose restart
```

また `unknown handle` が出る…。

もう少し試したいが、今回は断念。
Windows の Docker Toolbox ではなく Vagrant で Linux の VM を作った上でその中で docker をインストールするとか、Windows のバイナリを実行するようにしたら変わるのかもしれない。
