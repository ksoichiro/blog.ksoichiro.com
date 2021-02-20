---
title: "Play Frameworkのアプリ内にパスワード生成プロジェクトを追加"
originalCreatedAt: 2015-03-28T15:47:00.001+09:00
tags: ["Java","Scala","SBT","Play Framework"]
---
Webアプリケーションのユーザをテーブルで管理する場合MySQLなどのDBで、`SHA2()`関数などを使ってパスワードを変換しても良いのだが、プログラム側で生成するとした場合は開発中のテストユーザのパスワードを生成するのに困る。

Play Frameworkの場合は`BCrypt`を使う例を見かけたのでこれを使うタスクをSBTで定義できたら良いのかな、と考えた。
…が、結局（知識不足なためだろうが）うまくできずサブプロジェクトとして用意して解決できたのでそのメモ。
(Play Frameowrk 2.3.8, Java 7)

<!--more-->

### build.sbt

ルートプロジェクトの`build.sbt`に以下を追加して、`passgen`というプロジェクトを登録する。
（名前は何でも良いが、変更する場合は以降の文字列も読み替えてください）
この書き方だと`passgen`というディレクトリがプロジェクトのディレクトリになる。

```scala
lazy val passgen = project
```
 
### プロジェクト追加

`passgen`というディレクトリを追加して、`build.sbt`を作成。
`jbcrypt`というdependencyを使うので、以下のようにする。

```scala
libraryDependencies ++=  Seq(
  javaCore,
  "org.mindrot" % "jbcrypt" % "0.3m"
)
```

### ジェネレータ作成

Javaで書いているが、ScalaでもOK(なはず)。
`passgen/src/main/java/PassGen.java`を作成し、以下のようにする。

```java
import org.mindrot.jbcrypt.BCrypt;

public class PassGen {
    public static void main(String[] args) {
        if (args.length == 0) {
            System.err.println("Password string is required");
            System.exit(0);
        }
        String password = args[0];
        String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt(8));
        System.out.println(hashedPassword);
    }
}
```

### 実行

activatorを実行し、以下のように操作する。

```
(passgenプロジェクトに移動)
$ project passgen

(パスワード生成)
> run password
(出力された値をパスワードとしてテスト用SQLなどに貼り付ける)

(rootに戻るときは以下を実行)
> project root
```

### プロジェクトにした理由

当初はSBTだけで解決しようとしたのだが、dependencyを使ったところ認識してくれず断念した。
`build.sbt`では式しか書けない、というのは分かっていて`Build.scala`などに分離して記述したのだが`build.sbt`に書いているdependency (`jbcrypt`)が認識されない。
これができていたら、全体としてもう少しスマートに書ける気がするのだが…。
独自タスクを作成する方法はSBTのマニュアルにも書いてあるのだが、独自タスクの中でdependencyを取り扱う方法がわからなかった。
Gradleはこの点で特別なことをすることなく簡単に書けるので楽だなと感じる。（単純に自分の理解度の差かもしれないが）

### その他

今回はやらなかったが、ルートプロジェクトと同じdependencyを使うので、各`build.sbt`でそれぞれバージョン指定するのではなく、どこかでまとめた方が良いはず。
さらに、saltのパラメータなどはプロジェクト本体と共通でなければならないので本体プロジェクトが`passgen`プロジェクトを参照するような形にした方が良いはず。
