---
title: "Gradleで依存関係が含まれているかを判定する方法"
created: 2015-12-16T23:00:00.001+09:00
tags: ["Gradle"]
---
Gradleのあるプロジェクトが、あるdependencyを**直接**持っているかどうかは以下で確認できる。

```gradle
boolean hasDependency(Project project, String group, String module) {
    project.configurations.compile.incoming.resolutionResult.allComponents.any {
        it.group == group && it.name == module
    }
}
```

しかし、これだと推移的依存関係が判定できない。  
つまり、「このプロジェクトにはライブラリAが含まれているか？」を判定したい場合に、「ライブラリAに依存しているライブラリB」を使用している場合は、上記の判定メソッドは false を返してしまう。
この推移的依存関係も判定するには次のようにする。

```gradle
boolean hasDependency(Project project, String group, String module) {
    project.configurations.compile.incoming.resolutionResult.allComponents.findAll {
        it.getId() instanceof ModuleComponentIdentifier
    }.collect {
        it.getId() as ModuleComponentIdentifier
    }.any {
        it.group == group && it.module == module
    }
}
```

いずれの場合も、プロジェクトが評価された後でなければ動作しない。  
つまり以下のようにafterEvaluateを使う必要がある。

```gradle
afterEvaluate { Project project ->
    if (hasDependency(project, 'com.example', 'awesomelib')) {
        // 'com.example:awesomelib'が含まれていた場合の処理
    }
}
```

特に後者の”推移的依存関係が判定できる版”をGradleプラグインで使う場合、
Gradle TestKitでないと正しくテストできないので注意が必要。
普通のProjectBuilderを使ったテストでは
project.evaluate()などとしても正しい結果が得られない模様。

2015/12/16 23:36 追記

GradleプラグインのGroovyファイルでproject.evaluate()しても結果が得られなかったのは、

```groovy
project.repositories {
    mavenCentral()
}
```

が入っていなかったからだった。
dependencyを解決できないはずだが、単にproject.evaluate()を呼ぶだけでは何も例外がスローされないらしい。
