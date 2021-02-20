---
title: "Gradle実行時のメモリオプション指定方法"
createdAt: 2015-12-11T00:55:00.001+09:00
tags: ["Gradle","Travis CI"]
---
Gradleを実行する時のメモリを調整したい場合、いつでも下記に説明されているような`org.gradle.jvmargs`を使えば良いとつい最近まで思っていた。
https://docs.gradle.org/current/userguide/build_environment.html
しかしこのオプションが有効なのは、上記で説明されている通り**デーモンとして起動した場合**だ。
デーモンとして起動しない場合は適用されないので注意。
だから、gradle.propertiesに`org.gradle.daemon=false`と書いておきながら`org.gradle.jvmargs=...`とか書いていても意味がない。

デーモン起動でない場合にメモリなどのJVMパラメータを指定したい場合は`GRADLE_OPTS`, `JAVA_OPTS`を使うといいらしい。
(これも上記ドキュメントで説明されているが)

先日、Travis CIでの実行時にのみメモリ調整が必要なケースがあり、上記の違いを理解した。
なおTravis CIならば、.travis.ymlに例えば

```
env:
  global:
  - GRADLE_OPTS="-Xmx1024m -Xms256m -XX:MaxPermSize=256m -XX:PermSize=256m"
```

とか書けばいい。
