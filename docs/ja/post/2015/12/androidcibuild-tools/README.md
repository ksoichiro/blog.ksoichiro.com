---
title: "AndroidのCIでbuild-toolsの新しいバージョンが見つからない場合の対処"
created: 2015-12-06T17:55:00.001+09:00
tags: ["wercker","Travis CI","Android"]
---
久しぶりにAndroid-ObservableScrollViewのAndroid SDKのバージョンなどを
アップデートしたが、Travis CIでもwerckerでもビルドが失敗してしまった。

もちろんローカルでは成功している。

API Levelの問題などではなく、build-tools-23.0.2が見つからなかったというもの。

結論としては、toolsを先にアップデートすれば良い。  
<!--more-->

### Travis CI

Travis CIの場合はlanguageをandroidにしておけば、
toolsをアップデート対象に含めておくだけで良さそう。  
(参考: https://github.com/travis-ci/travis-ci/issues/5036)

しかしAndroid-ObservableScrollViewでは
ドキュメントのWebサイトもTravis CIでビルドしているので、
languageにandroidを指定していない。  
そのため Travis CI が用意している `android-update-sdk` を使っている。  
.travis.ymlから`install:`の問題部分だけ抜粋すると、
失敗したビルドでは

```yaml
install:
- android-update-sdk --accept-licenses='android-sdk-license-.+' --components=build-tools-23.0.2
- android-update-sdk --accept-licenses='android-sdk-license-.+' --components=tools
```

としていた。
これだと、toolsがアップデートされる前にbuild-toolsをアップデートしようとするのだが、toolsが古いとbuild-tools-23.0.2を見つけることができない模様。  
順番を入れ替えて、tools -> build-tools の順でアップデートするとうまくいった。

```yaml
install:
- android-update-sdk --accept-licenses='android-sdk-license-.+' --components=tools
- android-update-sdk --accept-licenses='android-sdk-license-.+' --components=build-tools-23.0.2
```

### wercker

こちらも同様。YAMLで `android-sdk-update` を指定することで
アップデートできるが、`wercker.yml` にはもともと

```yaml
    - android-sdk-update:
        filter: tools,platform-tools,android-21,android-22,android-23,build-tools-23.0.2,extra-android-support,extra-android-m2repository
```

のように1行ですべて指定していた。
これだと、やはりtools自体がアップデートされる前にbuild-toolsその他のパッケージを検索しようとするため新しいバージョンが見つからないケースがある。

対処としては、toolsを先にアップデートして、その他を別の `android-sdk-update` に分ければいい。
platform-toolsは特にバージョンをidに含んでいないのでtoolsと一緒にしてしまっても問題ない。

```yaml
    - android-sdk-update:
        filter: tools,platform-tools
    - android-sdk-update:
        filter: android-21,android-22,android-23,build-tools-23.0.2,extra-android-support,extra-android-m2repository
```
