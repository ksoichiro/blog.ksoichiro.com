---
title: "Gradle 2.8にしたときのSpockテストコードのビルドエラー"
created: 2015-10-30T01:51:00.001+09:00
tags: ["Gradle","Spock Framework","Groovy"]
---
4月以来の久々のテクニカルな内容。  
OSSを作るのはいいんだけど、そこで得た知見は、こういうところで書いたりしないと結果的にクローズドな感じになってしまうのでよくないなぁと思う今日この頃。  
できるだけ、日々やってきたことをここで書き残そうと思います。

で、今回は今さっき試したばかりのこと。
Gradle 2.8がリリースされていたので、[開発したプラグインの一つであるgradle-web-resource-plugin](https://github.com/ksoichiro/gradle-web-resource-plugin)に適用してみた。

すると、compileTestGroovyタスクの実行時に以下のようなエラーが発生。

```
org.gradle.api.tasks.TaskExecutionException: Execution failed for task ':plugin:compileTestGroovy'.
...
Caused by: java.lang.ExceptionInInitializerError
```

<!--more-->

で、原因となるのは

```
Caused by: groovy.lang.GroovyRuntimeException: Conflicting module versions. Module [groovy-all is loaded in version 2.4.4 and you are trying to load version 2.3.10
```

とのこと。

もともと、build.gradleに

```groovy
testCompile ('org.spockframework:spock-core:1.0-groovy-2.3')
```

として Spock Frameworkを組み込んでいたのだが、groovy-allが競合しているようなので外してみた。

```groovy
testCompile ('org.spockframework:spock-core:1.0-groovy-2.3') {
    exclude module: 'groovy-all'
}
```

すると今度は

```
:plugin:compileTestGroovy
startup failed:
Could not instantiate global transform class org.spockframework.compiler.SpockTransform specified at jar:file:/Users/ksoichiro/.gradle/caches/modules-2/files-2.1/org.spockframework/spock-core/1.0-groovy-2.3/762fbf6c5f24baabf9addcf9cf3647151791f7eb/spock-core-1.0-groovy-2.3.jar!/META-INF/services/org.codehaus.groovy.transform.ASTTransformation  because of exception org.spockframework.util.IncompatibleGroovyVersionException: The Spock compiler plugin cannot execute because Spock 1.0.0-groovy-2.3 is not compatible with Groovy 2.4.4. For more information, see http://versioninfo.spockframework.org
Spock artifact: file:/Users/ksoichiro/.gradle/caches/modules-2/files-2.1/org.spockframework/spock-core/1.0-groovy-2.3/762fbf6c5f24baabf9addcf9cf3647151791f7eb/spock-core-1.0-groovy-2.3.jar
Groovy artifact: file:/Users/ksoichiro/.gradle/wrapper/dists/gradle-2.8-all/5gvqtptsvj5jeqpfiir33enq91/gradle-2.8/lib/groovy-all-2.4.4.jar

1 error

:plugin:compileTestGroovy FAILED
```

とのこと。Spockは確かバージョン1.0からGroovyのバージョンチェックをしているので、Groovy 2.4がdependencyに入っているならSpockは1.0-groovy-2.4を使う必要がある。

ということで、

```groovy
testCompile ('org.spockframework:spock-core:1.0-groovy-2.4') {
    exclude module: 'groovy-all'
}
```

として、Spockに含まれるgroovy-allを除外すると、無事にテストコードのビルドが成功。

GradleのGroovyが2.4になったことと、groovy-allが競合していると言われるようになったことの影響はもう少し調べてみた方がいいかもしれない。
