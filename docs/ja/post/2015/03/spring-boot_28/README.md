---
title: "Spring Bootのアプリ内にパスワード生成タスクを追加"
created: 2015-03-28T17:42:00.001+09:00
tags: ["Java","Spring Boot"]
---
以前のエントリ [Play Frameworkのアプリ内にパスワード生成プロジェクトを追加](http://ksoichiro.blogspot.jp/2015/03/play-framework.html)のようなことをSpring Bootで行う方法について。
上記エントリで書いたように、Gradleで簡単に定義できる。

暗号化方法は、[Spring Bootでユーザ認証](http://ksoichiro.blogspot.jp/2015/03/spring-boot.html)で書いたように`WebSecurityConfigurerAdapter`の継承クラスで`new StandardPasswordEncoder()`を設定している前提。
他のEncoderを使う場合はタスクの内容を適宜書き換えれば良いはず。
<!--more-->

### タスク作成

`build.gradle`に以下を追記する。
Webアプリ側でSpring Securityを既に追加しているなら、taskだけ書き足してIDEにimportを補ってもらうだけで済むはず。

```gradle
import org.springframework.security.crypto.password.StandardPasswordEncoder

:

dependencies {
    :
    compile 'org.springframework.boot:spring-boot-starter-security:1.2.2.RELEASE'
    :
}

task encodePassword << {
    StandardPasswordEncoder encoder = new StandardPasswordEncoder()
    String username = 'test'
    if (project.hasProperty('args')) {
        username = project.args.split('\\s+')[0]
    }
    println "Encoded password for user ${username}:"
    println encoder.encode(username)
}
```

### 実行

以下を実行すると`test`というパスワードを暗号化した文字列が表示される。

```
./gradlew encodePassword -Pargs="test"
```
