---
title: "Spring Bootのバージョン定義の集約"
created: 2015-04-01T23:52:00.001+09:00
tags: ["Gradle","Spring Boot"]
---
Spring Boot 1.2.3.RELEASEが出ていたので、早速todoサンプルプロジェクトに適用してみた。

Spring Bootはstarterなどで複数の同じバージョンのdependencyを使うので、バージョンは集約して定義しておいた方がメンテナンスしやすそう。

ということで、`gradle.properties`をプロジェクトルートに作成し、
<!--more-->

```
SPRING_BOOT_VERSION=1.2.3.RELEASE
```

などと書いておき、

build.gradle(抜粋):
```groovy
buildscript {
    repositories {
        jcenter()
    }
    dependencies {
        classpath "org.springframework.boot:spring-boot-gradle-plugin:${SPRING_BOOT_VERSION}"
        classpath "org.springframework:springloaded:1.2.1.RELEASE"
        classpath "org.springframework.boot:spring-boot-starter-security:${SPRING_BOOT_VERSION}"
    }
}
```

app-site/build.gradle(抜粋):
```groovy
dependencies {
    compile project(':app-client')
    compile "org.springframework.boot:spring-boot-starter-web:${SPRING_BOOT_VERSION}"
    compile "org.springframework.boot:spring-boot-starter-thymeleaf:${SPRING_BOOT_VERSION}"
    compile "org.springframework.boot:spring-boot-starter-data-jpa:${SPRING_BOOT_VERSION}"
    compile "org.springframework.boot:spring-boot-starter-security:${SPRING_BOOT_VERSION}"
    compile 'mysql:mysql-connector-java:5.1.34'
    compile 'org.hibernate:hibernate-validator:5.1.3.Final'
    compile 'org.apache.tomcat.embed:tomcat-embed-el:8.0.15'
    testCompile "org.springframework.boot:sprintg-boot:starter-test:${SPRING_BOOT_VERSION}"
}
```

とした。
これで、`gradle.properties`の1箇所を変更すれば漏れなく簡単にアップデートできる。

ちなみに上記はマルチプロジェクト構成だが、ルートの`gradle.properties`に定数を定義しておけば、サブプロジェクトの`build.gradle`からでも参照できる。

最初はルートプロジェクトの`build.gradle`に

```groovy
def vSpringBootVersion = '1.2.3.RELEASE'
```

などと書いてみたが、これだとサブプロジェクトから参照できず、各プロジェクトで定義しなくてはならなくなるため、良い方法とは言えない。
