---
title: "Querydslで親子テーブルの複数の子レコードを親レコードの1カラムにまとめる"
created: 2016-08-22T00:05:00.001+09:00
tags: ["MySQL","H2","Querydsl","Spring Boot"]
---
「部署」と「社員」という親子関係のあるテーブルがあったとして

- 部署1: 社員1, 社員2
- 部署2: 社員3, 社員4, 社員5

という部署一覧を表示したい。適当に社員を結合してしまうと

- 部署1: 社員1
- 部署1: 社員2
- 部署2: 社員3
- 部署2: 社員4
- 部署2: 社員5

という社員一覧っぽいものになってしまうが作りたいのはあくまで部署一覧なのでNG。

これをSpring Boot + Spring Data JPA + Querydslで解決する。
<!--more-->

### 前提条件

今回は以下のような条件で考える。

- Spring Boot 1.3.3利用
- Spring Data JPA利用(基本的になるべくJPAを使いたい)
- Querydsl 3.6.7利用
- 動的に検索条件が変わる(つまり`@Query`のような静的な構成方法は適さない)
- 実行はGradleで行う (Maven用のソリューションはNG)
- MySQL(MariaDB)で動作させるが開発時はH2
- MySQL(MariaDB)はGradle実行時には起動させたくない

### QuerydslでJPASQLQueryとGROUP_CONCATを使う

JPAを使ったままでgroup byを使って何とかできないかと考えたもののうまくいかない。  
特にページネーションが絡むと正しいページ数を算出できなくなる。

ネイティブクエリでもいいので何とかならないと探ったところ`GROUP_CONCAT`がよさそうだった。  
http://d.hatena.ne.jp/kkz_tech/20100803/1280802260

MySQL, MariaDB, H2でサポートされているため、ネイティブクエリを扱えるようにQuerydslの `JPAQuery` クラスの代わりに`JPASQLQuery` クラスを使いつつ、`GROUP_CONCAT`関数を埋め込んでみる。

GROUP_CONCAT:  
https://mariadb.com/kb/en/mariadb/group_concat/  
http://www.h2database.com/html/functions.html#group_concat

### DBMS依存コードの分離と使い分け

Querydslのクラスである`JPASQLQuery`の生成には、特定のDBMSの`SQLTemplates`を指定する必要がある。
H2は`H2Templates`, MySQLは`MySQLTemplates`が存在するので、それを生成するSpringの`Service`として`SQLTemplatesService`を用意した。  
`@ConditionalOnProperty`でデータソースプラットフォームを参照してServiceを使い分けるようにして、`SQLTemplatesService`の実装クラスを2種類用意した。

あとは`GROUP_CONCAT`だが、これは偶然H2/MySQLのいずれも同じ名前の関数をサポートしていた。
ただ他のDBにも対応しやすいよう分離しておく。
`SQLTemplatesService`に`groupConcat()`を追加し、デフォルト実装として`GROUP_CONCAT`を使うようにした。

```java
public interface SQLTemplatesService {
    SQLTemplates getTemplates();
    default StringExpression groupConcat(StringPath path, OrderSpecifier orderSpecifier) {
        return StringTemplate.create("GROUP_CONCAT({0} order by {1})", path, orderSpecifier);
    }
}
```

なお`groupConcat()`は`SQLExpressions`にQuerydsl 4.xで追加されているようだが、今回テストに使ったSpring Boot 1.3.3時点で互換性のあるQuerydsl 3.6にはない。

プロパティ`spring.datasource.platform`の値でServiceを使い分けるが、未指定の場合はSpring Bootと同様にH2を使うようにする。  
つまり `matchIfMissing = true` としておく。

```java
@ConditionalOnProperty(name = "spring.datasource.platform", havingValue = "h2", matchIfMissing = true)
@Service
public class H2SQLTemplatesServiceImpl implements SQLTemplatesService {
    @Override
    public SQLTemplates getTemplates() {
        return new H2Templates();
    }
}
```

### GROUP_CONCAT用のフィールドを追加

`GROUP_CONCAT`で結合した文字列は、テーブルのカラムではないのでこれをプロジェクションするためのフィールドを用意する。

ここでは部署を表すクラス `Department`クラスに`@Transient private String employeesList`などというフィールドを追加しておく。  
(テーブルのカラムではないので `@Transient` が必要。)  
なおこのテストプロジェクトではLombokを使っているのでフィールドに対応するgetter/setterは自動生成される想定。

そして、`GROUP_CONCAT`を含むクエリを組み立て。
`Projections.constructor()`でフィールドを対応付け、最後に`SQLTemplatesService#groupConcat()`を割り当てているところがポイント。

```java
JPASQLQuery query = querydsl.applyPagination(pageable, createQuery(predicate));
List<Department> content =
    query.orderBy(department.id.asc()).list(
        Projections.constructor(
            Department.class,
            department.id,
            department.name,
            sqlTemplatesService.groupConcat(employee.name, employee.id.asc())
        ));
```

### Querydsl SQL用のメタデータクラス自動生成

これはうまくいきそうだったが、上記抜粋コード中の`createQuery()` の中で組み立てている実際のクエリにおける `leftJoin()`のon句に対して、Querydsl JPAで使う自動生成クラス(`Q*`)だけではうまく表現しきれなかった。

パスの情報がJPA用に定義されており、純粋なSQLとして実行させると不正なSQLになってしまう。

`leftJoin()`のon句を省略してしまうと、条件なしに結合されてしまい`GROUP_CONCAT`した内容が全ての行で同じになってしまう。

正しく設定するには、やはりQuerydsl SQLのために別の自動生成クラス(`S*`)を生成しなければならないらしい。
https://github.com/querydsl/querydsl/blob/0cfeeb5595e8f8924122bb1b341abce08827b07e/querydsl-jpa/src/test/java/com/querydsl/jpa/domain/sql/SAnimal.java

`S*`の生成には、生成時にDBに接続する必要がある。
DBからメタ情報を取得して自動生成するらしい。
http://blog.wktk.co.jp/archives/229
http://blog.physalis.net/2013/05/30/migrate-from-maven-to-gradle.html
http://www.querydsl.com/static/querydsl/3.6.7/reference/html_single/#d0e408

前提条件に書いた通り、MySQLで運用するとしても開発時にこれを必須にしたくはない。
ビルド時のH2の起動は許容できるが、H2サーバを起動すればいいのか？
Gradleプラグインを探してみたが適切なものがない。
以下は良さそうに見えたがMaven Centralなどに公開されていない模様。
https://github.com/jamescarr/h2-gradle-plugin

あれこれ試行錯誤した結果、H2は普通にインメモリで起動すれば十分だとわかった。
Groovyの`Sql`クラスが使える。
注意点としては、H2のドライバをSqlクラスに渡して動かす必要があるがそのまま起動するとクラスローダがドライバを読み込んでいない。
以下を参考にして、適当な専用の`configuration`を用意してそこでドライバ(org.h2.Driver)をロードさせることで認識するようになった。
https://discuss.gradle.org/t/jdbc-driver-class-cannot-be-loaded-with-gradle-2-0-but-worked-with-1-12/2277/3

スキーマ情報は`src/main/resources/schema.sql`ファイルにあるので、Sqlクラスに`schema.sql`を読ませてメタ情報を取得し、`MetaDataExporter`を実行すれば`S*`を作成できる。

```groovy
configurations {
    jdbcdriver
}

dependencies {
    jdbcdriver "com.h2database:h2"
    // ...
}

def querydslDir = file('src/main/generated')

task generateQuerydslSql {
    doLast {
        URLClassLoader loader = GroovyObject.class.classLoader
        configurations.jdbcdriver.each { File file ->
            loader.addURL(file.toURI().toURL())
        }
        def sql = Sql.newInstance('jdbc:h2:mem:', 'org.h2.Driver')
        def statements = project.file('src/main/resources/schema.sql').text
        statements.split(';').each { stmt ->
            sql.execute(stmt)
        }
        MetaDataExporter exporter = new MetaDataExporter()
        exporter.setNamePrefix('S')
        exporter.setPackageName('com.example.spring.domain.sql')
        exporter.setTargetFolder(querydslDir)
        exporter.export(sql.getConnection().getMetaData())
    }
}
```

これで`leftJoin()`のon句を正しく書くことができて、正しい結果が取得できた。

```java
SDepartment department = SDepartment.department;
SEmployee employee = SEmployee.employee;
JPASQLQuery query = createBaseQuery(predicate)
    .leftJoin(employee).on(employee.departmentId.eq(department.id))
    .groupBy(department.id);
```

### ページネーション

ページネーションをするためには`Pageable`, `PageImpl`などを使い、件数をカウントするクエリも必要になる。

JPA(JPQLQuery)の場合は単に`JPQLQuery#count()`を使えば良かったが、JPASQLQueryを使っても、`GROUP_CONCAT` を使うために `groupBy()` をつけているせいで`JPASQLQuery#count()`ではユニークな結果が得られず失敗する。  
`select count(*)`でなく`select count(department.id)` とできればいいのだがやり方が見つからない。

そこで `groupBy` を外した`JPASQLQuery`を用意しておき、カウントはそちらで取得するように修正。
別途`groupBy()`と`leftJoin()`をつけた`JPASQLQuery`を作成して結果を取得する。

```java
private JPASQLQuery createBaseQuery(Predicate predicate) {
    SDepartment department = SDepartment.department;
    JPASQLQuery query = new JPASQLQuery(entityManager, sqlTemplatesService.getTemplates()).from(department);
    if (predicate != null) {
        query.where(predicate);
    }
    return query;
}

private JPASQLQuery createQuery(Predicate predicate) {
    SDepartment department = SDepartment.department;
    SEmployee employee = SEmployee.employee;
    JPASQLQuery query = createBaseQuery(predicate)
        .leftJoin(employee).on(employee.departmentId.eq(department.id))
        .groupBy(department.id);
    if (predicate != null) {
        query.where(predicate);
    }
    return query;
}
```

なお、limit/offsetやソートの調整は`JPAQuery`の場合はSpring Data JPAが提供する`Querydsl`クラスで行っていたが、Querydsl SQL 用のものがない。
これには、Querydslクラスを参考に独自に`QuerydslSQL` クラスを作成した。

全体のソースコードはGitHubに登録。
gradlew bootRunしてlocalhost:8080にアクセスすれば動作確認できる。
https://github.com/ksoichiro/spring-boot-practice/tree/master/contents/20160821-querydsl-join
