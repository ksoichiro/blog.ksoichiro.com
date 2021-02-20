---
title: "GitLab CI をセットアップする"
createdAt: 2019-05-01T14:36:00.001+09:00
tags: ["GitLab","CI","Docker"]
---
今さらだが、自分でセットアップする機会ができたので。

ただのセットアップは公式のマニュアルなどで確認できるので、ここでは実際にビルド、テスト、レビューで活用できるようにするためのことを書く。
かなりの長文なので注意。
<!--more-->
## 事前準備

検証には [gitlab-i18n-patch](https://github.com/ksoichiro/gitlab-i18n-patch) を利用して Vagrant の GitLab v11.9.8 の VM を使用する。
`private_network` で IP アドレス `192.168.33.10` を指定しておく。
GitLab の VM には CPU x 2、4 GB を割り当てておく。
GitLab Runner の VM には CPU x 2、3GB を割り当てておく。

## GitLab Runner インストール

こちらを参考にインストールする。
[https://docs.gitlab.com/11.9/runner/install/linux-manually.html](https://docs.gitlab.com/11.9/runner/install/linux-manually.html)

Vagrant で ubuntu/trusty64 の VM を作成。
インストールできるバージョンについては以下を参照。

- [https://docs.gitlab.com/11.9/runner/install/bleeding-edge.html#download-any-other-tagged-release](https://docs.gitlab.com/11.9/runner/install/bleeding-edge.html#download-any-other-tagged-release)
- [https://gitlab.com/gitlab-org/gitlab-runner/tags](https://gitlab.com/gitlab-org/gitlab-runner/tags)

```sh
vagrant ssh
sudo su -
wget -O /usr/local/bin/gitlab-runner https://gitlab-runner-downloads.s3.amazonaws.com/v11.9.2/binaries/gitlab-runner-linux-amd64
chmod +x /usr/local/bin/gitlab-runner
curl -sSL https://get.docker.com/ | sh
useradd --comment 'GitLab Runner' --create-home gitlab-runner --shell /bin/bash
gitlab-runner install --user=gitlab-runner --working-directory=/home/gitlab-runner
gitlab-runner start
```

これでインストールは完了。

## トークン取得、初期設定

GitLab の 管理＞概要＞Runner からトークンを参照する。

```sh
root@vagrant-ubuntu-trusty-64:~# gitlab-runner register
Runtime platform                                    arch=amd64 os=linux pid=10312 revision=fa86510e version=11.9.2
Running in system-mode.

Please enter the gitlab-ci coordinator URL (e.g. https://gitlab.com/):
http://192.168.33.10/
Please enter the gitlab-ci token for this runner:
DZt6Gx2oWtbm1T9G3xZE
Please enter the gitlab-ci description for this runner:
[vagrant-ubuntu-trusty-64]:
Please enter the gitlab-ci tags for this runner (comma separated):

Registering runner... succeeded                     runner=DZt6Gx2o
Please enter the executor: shell, docker+machine, docker-ssh+machine, docker, docker-ssh, parallels, ssh, virtualbox, kubernetes:
docker
Please enter the default Docker image (e.g. ruby:2.1):
ruby:2.1
Runner registered successfully. Feel free to start it, but if it's running already the config should be automatically reloaded!
root@vagrant-ubuntu-trusty-64:~# gitlab-runner restart
Runtime platform                                    arch=amd64 os=linux pid=10320 revision=fa86510e version=11.9.2
```

登録が完了すると、GitLab の 管理＞概要＞Runner の画面で一覧表示される。
最初は `locked` の表示になっているため、鉛筆のアイコンから編集してロックを解除する。

試してみると、以下のようなエラーで失敗。

```
Running with gitlab-runner 11.9.2 (fa86510e)
  on vagrant-ubuntu-trusty-64 FrxqXAaT
Using Docker executor with image node:8.15.0-alpine ...
ERROR: Failed to create container volume for /builds/root Error response from daemon: OCI runtime create failed: container_linux.go:348: starting container process caused "process_linux.go:297: copying bootstrap data to pipe caused \"write init-p: broken pipe\"": unknown (executor_docker.go:423:1s)
ERROR: Preparation failed: Error response from daemon: OCI runtime create failed: container_linux.go:348: starting container process caused "process_linux.go:297: copying bootstrap data to pipe caused \"write init-p: broken pipe\"": unknown (executor_docker.go:423:1s)
Will be retried in 3s ...
```

[GitLab Runner #3457](https://gitlab.com/gitlab-org/gitlab-runner/issues/3457) に辿り着いたが、こちらを参考にすると以下のセットアップが必要だった模様。

[https://docs.gitlab.com/ee/ci/docker/using\_docker\_build.html](https://docs.gitlab.com/ee/ci/docker/using_docker_build.html)

```sh
sudo -u gitlab-runner -H docker info
```

以下の結果となった。

```
Got permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: Get http://%2Fvar%2Frun%2Fdocker.sock/v1.38/info: dial unix /var/run/docker.sock: connect:permission denied
```

gitlab-runner ユーザを docker グループに追加。

```sh
usermod -aG docker gitlab-runner
```

もう一度確認すると、この確認は成功した。

```sh
sudo -u gitlab-runner -H docker info
Containers: 0
 Running: 0
 Paused: 0
 Stopped: 0
Images: 1
Server Version: 18.06.3-ce
Storage Driver: aufs
 Root Dir: /var/lib/docker/aufs
 Backing Filesystem: extfs
 Dirs: 1
 Dirperm1 Supported: false
...
```

しかしジョブをリトライするとまたもや失敗。
以下も失敗していて、dockerのインストール自体がうまくいっていなかった模様。

```sh
docker run hello-world
```

以下を参考に Docker を再インストール。

[https://github.com/opencontainers/runc/issues/1343](https://github.com/opencontainers/runc/issues/1343)

```sh
apt-get -y install --force-yes docker-ce=18.06.1~ce~3-0~ubuntu
```

`docker run hello-world` は成功。リトライすると、ジョブも無事成功。

```
Running with gitlab-runner 11.9.2 (fa86510e)
  on vagrant-ubuntu-trusty-64 FrxqXAaT
Using Docker executor with image node:8.15.0-alpine ...
Pulling docker image node:8.15.0-alpine ...
Using docker image sha256:e8ae960eaa9e4aeb9741d7d34178e375d218e59f98699962dc03ffcd3c8192bf for node:8.15.0-alpine ...
Running on runner-FrxqXAaT-project-2-concurrent-0 via vagrant-ubuntu-trusty-64...
Initialized empty Git repository in /builds/root/gitlab-ci-test/.git/
Clean repository
Fetching changes...
Created fresh repository.
From http://192.168.33.10/root/gitlab-ci-test
 * [new branch]      master     -> origin/master
Checking out b71eea8f as master...

Skipping Git submodules setup
$ npm install
added 196 packages from 543 contributors and audited 400 packages in 32.854s
found 1 high severity vulnerability
  run `npm audit fix` to fix them, or `npm audit` for details
$ npm test

> @ test /builds/root/gitlab-ci-test
> nyc mocha



  index
    ✓ #func()


  1 passing (45ms)

----------|----------|----------|----------|----------|-------------------|
File      |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
----------|----------|----------|----------|----------|-------------------|
All files |      100 |      100 |      100 |      100 |                   |
 index.js |      100 |      100 |      100 |      100 |                   |
----------|----------|----------|----------|----------|-------------------|
Job succeeded
```

なお、このときの `.gitlab-ci.yml` の内容は以下の通り。
GitLab.com で CI を試したプロジェクト [citest](https://gitlab.com/ksoichiro/citest) を利用した。

```yaml
image: node:8.15.0-alpine

stages:
  - build

before_script:
  - npm install

build:
  stage: build

  script: npm test
```

## 複数の Runner のセットアップ

以下のようにコマンドを複数回実行すれば良い。
トークンは検証用の VM で発行したもので実際のものに読み替える。

```sh
sudo gitlab-runner register -n \
  --url http://192.168.33.10/ \
  --registration-token DZt6Gx2oWtbm1T9G3xZE \
  --executor docker \
  --description "My Docker Runner" \
  --docker-image "docker:stable" \
  --docker-privileged
```

## Artifact の利用

例えば Java のプロジェクトであれば jar ファイルなど、ビルドの成果物 (artifact) を利用することがあるはず。

サンプルの Java プロジェクトとして GitHub においてある [task](https://github.com/ksoichiro/task) リポジトリを利用。

以下のように `.gitlab-ci.yml` を追加する。

```yaml
image: adoptopenjdk/openjdk8:x86_64-ubuntu-jdk8u212-b03-slim

stages:
  - build

build:
  stage: build

  before_script:
    - apt-get update > /dev/null
    - apt-get install -y git > /dev/null
    - chmod +x gradlew

  script:
    - ./gradlew assemble --stacktrace --no-daemon

  after_script:
    - ls -al subprojects/site/build/libs

  artifacts:
    paths:
      - subprojects/*/build/libs/*.jar
    expire_in: 1 week
```

これで、ジョブから jar ファイルをダウンロードできるようになる。

## キャッシュの利用

上記の Java プロジェクトでは Gradle を使っているが、Gradle Wrapper を使ってダウンロードされた Gradle などをキャッシュしないと、ビルドの都度外部からダウンロードすることになり非常に遅いため、キャッシュの設定を追加する。

Gradle のファイルが通常キャッシュされる位置はプロジェクトのフォルダではないが、GitLab CI のキャッシュはプロジェクトフォルダ配下のみのようなので調整する必要がある。

[Stackoverflow](https://stackoverflow.com/a/35478988) を参考にすると、`GRADLE_USER_HOME` 環境変数を変更すれば良いらしい。

`cache:paths` でキャッシュのパスを指定しつつ、起点となるディレクトリを `before_script` で `GRADLE_USER_HOME` 環境変数を使って指定する。

```yaml
image: adoptopenjdk/openjdk8:x86_64-ubuntu-jdk8u212-b03-slim

stages:
  - build

build:
  stage: build

  cache:
    paths:
      - .gradle/wrapper
      - .gradle/caches

  before_script:
    - apt-get update > /dev/null
    - apt-get install -y git > /dev/null
    - chmod +x gradlew
    - export GRADLE_USER_HOME=`pwd`/.gradle

  script:
    - ./gradlew clean assemble --stacktrace --no-daemon

  after_script:
    - ls -al subprojects/site/build/libs
    - ls -al .gradle/wrapper
    - ls -al .gradle/caches

  artifacts:
    paths:
      - subprojects/*/build/libs/*.jar
    expire_in: 1 week
```

## Danger を使う

レビューの一部を自動化するために [Danger](https://danger.systems/ruby/) を導入する。
JavaScript にしたかったが、現時点ではまだ JavaScript 版は GitLab と統合できていないようなので見送り。

プロジェクトの設定＞CI / CD＞環境変数にて、`DANGER_GILTAB_API_TOKEN` を定義しておく。値は自分自身またはボット用アカウントで発行した API アクセストークン。
トークンはユーザの設定画面のアクセストークン画面で、api のスコープにチェックを入れて発行する。

また、以下の値を `.gitlab-ci.yml` の variables に定義しておく。

- `DANGER_GITLAB_HOST`
- `DANGER_GITLAB_API_BASE_URL`

以下は `review` というジョブを追加したもの。

```yaml
stages:
  - build

variables:
  DANGER_GITLAB_API_BASE_URL: http://192.168.33.10/api/v4
  DANGER_GITLAB_HOST: 192.168.33.10

review:
  stage: build

  image: ruby:2.6-stretch

  only:
    variables:
      - $DANGER_GITLAB_API_TOKEN

  before_script:
    - gem install danger-gitlab
    - danger --version

  script:
    - danger --fail-on-errors=true
```

そして以下のような `Dangerfile` を作成しておく。

```ruby
warn "This is test for using Danger"
```

これでブランチを作成して適当なコミットをした上でマージリクエストすると、Danger が実行され `1 warning` として `This is test for using Danger` のメッセージがコメントされる。

同じブランチで修正してプッシュした場合、もう一度パイプラインが実行されるが、 Danger のコメントは新しく追加されるのではなく更新される模様。

マージリクエストでないジョブの場合は Danger の実行は自動的にスキップされる。

```sh
$ danger --fail-on-errors=true
Not a GitLabCI Pull Request - skipping `danger` run.
```

ここまでできてしまえば、あとは Dangerfile を編集していけばレビュー内容をブラッシュアップしていくだけのはず。

また、 [GitLab Community Edition のリポジトリ](https://gitlab.com/gitlab-org/gitlab-ce/) が Danger を採用しているので内容はこちらが非常に参考になる。

## Docker プライベートレジストリ

Java の例では、ビルド手順において git コマンドを使うため、`before_script` で `apt-get install -y git` を実行した。また Danger の例では `gem install danger-gitlab` で Danger をインストールした。このような事前準備は可能な限り Docker のイメージにしておき、ビルド時間を短縮したい。

ただし、単に Docker のイメージをビルドする処理 (Dockerfile) に移しただけでは、イメージを毎回ビルドすることになりビルド時間の短縮にならない。Docker プライベートレジストリを用意してプッシュしておくようにする。

registry のセットアップは簡単で、Docker でセットアップできる。

この検証では、GitLab の VM (192.168.33.10) に同居させておく。

```sh
curl -sSL https://get.docker.com/ | sh
apt-get -y install --force-yes docker-ce=18.06.1~ce~3-0~ubuntu
docker pull registry:2.7
docker run hello-world
docker run -d -p 5000:5000 --name registry -v /docker:/var/lib/registry registry:2.7
```

これで registry は準備できた。

## ビルドの中での Docker の利用

次のステップとして、CI でイメージをビルドして registry にプッシュするようなリポジトリを準備する必要がある。(手作業で準備してもいいが、ビルド用イメージもプロジェクトを構成する成果物のうち、と考えればリポジトリや CI のプロセスを準備するべきだろう。)

CI で Docker イメージをビルドするということは GitLab Runner の中で docker コマンドを利用できるようにする必要がある。Docker イメージのビルドの説明の中にある [Use docker in docker executor](https://docs.gitlab.com/ee/ci/docker/using_docker_build.html#use-docker-in-docker-executor) の説明が参考になる。

以下の方法では GitLab Runner を `--docker-privileged` で起動しておく必要があるが、Shell executor を使ったりソケットを共有する方法を使ったりすることもできるらしい。

```yaml
image: docker:stable

stages:
  - build

services:
  - docker:dind

before_script:
  - docker info

build:
  stage: build
  script: docker run hello-world
```

これで、ビルドの中で Docker イメージをビルドして registry にプッシュすることもできる。
…が、後述の問題により、プッシュできるようにするにはさらに変更が必要。

## レビュー用コンテナのビルドとプライベートレジストリへのプッシュ

[GitLab CE を参考にビルド用イメージのリポジトリを作成して](https://gitlab.com/gitlab-org/gitlab-build-images) Danger 用(レビュー用)のイメージを作成してみる。

このイメージをわざわざ提供するのは gem でインストールする時間を省くのが主な目的。

`Dockerfile.danger`:

```dockerfile
FROM ruby:2.6-stretch

RUN gem install danger-gitlab --no-document \
    && echo "Danger version " $(danger --version)
```

ビルド時につけるタグはプッシュするホスト・ポートをつけておく。

```yaml
image: docker:stable

stages:
  - build

services:
  - docker:dind

before_script:
  - docker info

danger:
  stage: build

  script:
    - docker build -t 192.168.33.10:5000/build-images/review:latest -f Dockerfile.danger .
    - docker push 192.168.33.10:5000/build-images/review:latest
```

しかし、ここまでの手順で準備した Runner では以下のように push が失敗してしまう。

```sh
$ docker push 192.168.33.10:5000/build-images/review:latest
The push refers to repository [192.168.33.10:5000/build-images/review]
Get https://192.168.33.10:5000/v2/: http: server gave HTTP response to HTTPS client
ERROR: Job failed: exit code 1
```

http だと push できない模様。

[こちら](https://github.com/docker/distribution/issues/1874) を参考にすると、プッシュするホストの Docker デーモンに対して`/etc/docker/daemon.json` で `{ "insecure-registries":["192.168.33.10:5000"] }` と指定する必要がある。
GitLab Runner を実行する側の `/etc/docker/daemon.json` を以下のように作成する。

```json
{
  "insecure-registries": [
    "192.168.33.10:5000"
  ]
}
```

`/etc/init.d/docker restart` で Docker を再起動してパイプラインを再実行。

しかしこれは GitLab Runner のホストに対する設定なのでこのままでは効かない。

Runner を privileged で登録するのをやめ、ソケットを共有する方式で起動する。

以下の Runner を登録し、古いものは停止しておく。

```sh
sudo gitlab-runner register -n \
  --url http://192.168.33.10/ \
  --registration-token DZt6Gx2oWtbm1T9G3xZE \
  --executor docker \
  --description "My Docker Runner" \
  --docker-image "docker:stable" \
  --docker-volumes /var/run/docker.sock:/var/run/docker.sock
```

これでもう一度試すと、プッシュが成功した。

副次的な効果として、ホストの Docker を共有しているため、別のジョブでダウンロード済みの image を pull する場合はすぐに完了するというメリットもあった。

実際にビルド用イメージのリポジトリを準備する際は、`.gitlab-ci.yml` にもう少し工夫が必要だろう。このままだと、master 以外のブランチのビルドで作られたイメージで latest タグが更新されてしまう。

## レビュー用コンテナを使ってビルドする

次は、このイメージを使ってビルドしてみる。

以下のように、`.gitlab-ci.yml` の Danger を使うジョブの定義で `image` に `192.168.33.10:5000/build-images/review:latest` を指定すれば良い。

```yaml
stages:
  - build

variables:
  DANGER_GITLAB_API_BASE_URL: http://192.168.33.10/api/v4
  DANGER_GITLAB_HOST: 192.168.33.10

review:
  stage: build

  image: 192.168.33.10:5000/build-images/review:latest

  only:
    variables:
      - $DANGER_GITLAB_API_TOKEN

  script:
    - danger --fail-on-errors=true
```

## ビルドの条件

[公式マニュアル](https://docs.gitlab.com/ee/ci/yaml/README.html#onlyexcept-basic) を参考に、基本的には `only` / `except` を使えばジョブの実行条件を指定することができる。以下にいくつか使えそうなものをリストアップしてみる。

### master ブランチのみ

MR と master ブランチでは異なる内容を実行したいこともあるはず。

```yaml
only:
  refs:
    - master
```

### MR のみ

レビューすることが前提となるもの。Danger も上述の通り、そのジョブが MR でトリガーされているのかどうかをチェックしてくれるようだが、このカテゴリに含めるのが良さそう。

```yaml
only:
  refs:
    - merge_requests
```

### 特定のファイルが更新された場合のみ

具体的には、Gradle ファイルまたは API、画面のサブプロジェクトのファイルが更新された MR のみ、という例。

Markdown ファイルだけ更新した場合に CI をスキップしたいとか、関連のないサブプロジェクトのビルドを避けて時間短縮したいとか、工夫ができそう。ただし、条件を正しく設定しないとテスト漏れに繋がる。

```yaml
only:
  refs:
    - merge_requests
  changes:
    - subprojects/{api,site}-*/*
    - **/*.gradle
```

以上。

別途、以下のようなトピックについても検討してみたい。

- docker-compose を使ったプロジェクトでのビルド・テストのやり方
- 特定の種類のブランチの場合にジョブの中で自動的にマージする
- Dangerfile を編集した場合のチェック用に、ローカルで Danger を実行できるようにする方法
