---
title: "Play FrameworkでSQLで初期データ投入する方法"
created: 2015-03-28T16:00:00.001+09:00
tags: ["Java","Play Framework"]
---
Play Frameworkでは、EBeanを使い
YAMLで初期データを書くようだが、
SpringのようにSQLファイルで初期化したい場合。
Scalaだとanormが使えるようだが、Javaだと以下のような感じに作るしかなさそう。
Play Frameworkは2.3.8。JavaはOracle JDK 7。

<!--more-->

### conf/initial-data.sql

このファイルに必要な初期データのSQLを記述する。
文はセミコロン(`;`)で区切る。

### app/Global.java

`conf/initial-data.sql`がある前提で、それを初期化時に実行する。


```java
public class Global extends GlobalSettings {
  @Override
  public void onStart(Application application) {
    // リロードするだけで実行されてしまうので注意。
    // if (Users.〜)など、初期化する条件を限定する必要あり
    try (Connection conn = DB.getConnection();
       BufferedReader reader = new BufferedReader(
        new InputStreamReader(Play.application().resourceAsStream("initial-data.sql")))) {
      conn.setAutoCommit(false);
      String line;
      StringBuilder sb = new StringBuilder();
      while ((line = reader.readLine()) != null) {
        if (line.startsWith("-- ")) {
          continue;
        }
        sb.append(line);
        if (!line.endsWith(";")) {
          continue;
        }
        String sql = sb.toString();
        Logger.info("SQL: " + sql);
        conn.createStatement().execute(sql);
        sb = new StringBuilder();
      }
      conn.commit();
    } catch (Exception e) {
      throw new RuntimeException("Failed to load initial data", e);
    }
  }

```

注意点としては、上記のコード中のコメントでも書いているように
リロードしただけでも流れてしまうので
実行条件を限定するように何か書く必要がありそう。

### Java 8

上記はJava 7の範囲で書いたが、Java 8のAPIを使えばもっと簡単になる(はず)。
 Groovyで書いてももっと簡単になるはず。
 