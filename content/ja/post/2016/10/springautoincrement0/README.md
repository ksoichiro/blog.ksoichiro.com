---
title: "Springでauto_incrementなカラムに対して0を指定する"
createdAt: 2016-10-30T23:30:00.001+09:00
tags: ["MySQL","MariaDB","Spring Boot"]
---
ユニーク制約の一部にNullableなカラムを含めたいが、それではユニークにならないので回避したい。

(a, b, c) という複数カラムのユニーク制約を定義したい場合に、この中にNULLを許可するカラムがありNULLが入ってきてしまうと、MySQLなどではユニーク性が担保されない。

これを回避するために NULL の代わりに 0 を使ってみたら良さそうだが、Springではどうやればいいのか？
<!--more-->

以下のようなテーブル構造を例とする。

```sql
create table `account` (
    `id` int primary key auto_increment,
    `username` varchar(255) not null,
    `name` varchar(255) not null,
    `password` varchar(255) not null,
    `enabled` tinyint(1) not null default 1,
    `role_id` int not null,
    `created_at` datetime(3),
    `updated_at` datetime(3)
);

create table `team` (
    `id` int primary key auto_increment,
    `cd` varchar(255) not null,
    `name` varchar(255) not null,
    `created_at` datetime(3),
    `updated_at` datetime(3)
);

create table `tag` (
    `id` int primary key auto_increment,
    `team_id` int,
    `account_id` int not,
    `name` varchar(128) not null,
    `created_at` datetime(3),
    `updated_at` datetime(3)
);
alter table `tag`
    add unique `uq_tag` (`team_id`, `account_id`, `name`);
```

tagテーブルはteamとaccountと紐付いており、チームが所有するタグと個人が所有するタグがあるとする。
そして同一チーム内、同一個人内では同じ名前のタグは定義できないようにしたいとする。
tagから見てどのチームやアカウントと紐付いているのかを`team_id`、`account_id` で指定する。

この用途からすると、チーム単位のタグではアカウントを特定する必要がないため `tag.account_id` にNULLを入れることになる。
しかしNULLが入ってしまうとユニーク制約が機能しなくなってしまうので、これを以下のようにNOT NULLに変更してデフォルト値を0にする。
`team_id`や`account_id` が0のものは関連をもたない意味とする。

```sql
create table `tag` (
    `id` int primary key auto_increment,
    `team_id` int not null default 0,
    `account_id` int not null default 0,
    `name` varchar(128) not null,
    `created_at` datetime(3),
    `updated_at` datetime(3)
);
alter table `tag`
    add unique `uq_tag` (`team_id`, `account_id`, `name`);
```

テーブル的にはこれで機能するが、Springでこのテーブルを扱うとするといくつか問題がある。

まず、tag.id = 0 を表現できない。

以下のような Tag エンティティを定義すると、teamやaccountに何も設定せずに保存しようとするとNULLで保存しようとすることになり、エラーが発生する。

```java
@Entity
@Data
@AllArgsConstructor
public class Tag {
    @Id
    @GeneratedValue
    protected Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Team team;

    @ManyToOne(fetch = FetchType.LAZY)
    private Account account;
    ...
}
```

そこで、id=0のレコードを予め登録しておいた上で、id=0のエンティティを定数として定義しておいてそれを利用する。

teamを例にしてみると、まず番兵的な id = 0 のレコードを以下のように初期データとして用意しておく。
このデータを用意しておかないと、teamId=0で保存されたTagをJPAで取得した時にEntityNotFoundExceptionが発生してしまう。

```sql
insert into `team` values (0, '', '', '1970-01-01 00:00:00', '1970-01-01 00:00:00');
```

そして、Tag クラスでは `@PrePersist`, `@PreUpdate` を使って保存直前のイベントを拾い、teamがnullの場合の処理を追加する。
   
```java
@Entity
@Data
@AllArgsConstructor
public class Tag {
    ...
    @PrePersist
    @PreUpdate
    public void preSave() {
        if (team == null) {
            team = Team.empty();
        }
    }
```

そして、`Team.empty()` を用意する。
`team_id = 0` を指定したいEntity全体で使用するため、Team側に定義している。

```java
@Entity
@Data
@AllArgsConstructor
public class Team {
    ...
    public static Team empty() {
        Team team = new Team(...);
        team.setId(0);
        team.setCreatedAt(new Date(0));
        team.setUpdatedAt(new Date(0));
        return team;
    }
}
```

Teamオブジェクトを自分で作らなくても、`TeamReposistory#findOne()` で取得して設定しても良いのかもしれない。
しかしRepositoryを扱うとなるとやはりEntityクラスではなくServiceレイヤで実装することになり、このような(ビジネスロジックというより)データの定義そのものに強く紐付いた処理を書くのは微妙な気がするのでEntityで記述できる方法にしておく。

H2ではこれで動作するが、MySQL/MariaDBなどの場合はこれだけだと不十分で、`auto_increment` な項目に0を指定して保存すると `auto_increment` された値が保存されてしまう。
0を指定した場合に0として保存できるようにするには`sql_mode='NO_AUTO_VALUE_ON_ZERO'`を指定する必要がある。

これをJDBCドライバで設定するなら、以下のようにsql_modeを指定する必要がある。

```yaml
spring:
    datasource:
        platform: mariadb
        url: "jdbc:mariadb://192.168.33.10/test?sessionVariables=sql_mode='NO_AUTO_VALUE_ON_ZERO'"
```

これでも動くが、これだと初期データの登録だけでなくアプリケーションコードからの保存時にも0での登録を許してしまうので良くない。

id=0のデータは初期データとして用意しておけば良いので、data.sqlにそのような記述をしておけば十分。

```sql
set sql_mode=NO_AUTO_VALUE_ON_ZERO;
...
insert into `team` values (0, '', '', '1970-01-01 00:00:00', '1970-01-01 00:00:00');
```

これはMySQL/MariaDB向けの記述だが、これを書いてしまうとH2で起動しなくなってしまう。

そこで、`data.sql` を `src/main/resources` に配置するのではなく `src/main/sql/data.sql` として用意しておき、ここにMySQL/MariaDB用の記述もしておいた上で、これをインプットとして Gradle でH2用、MySQL/MariaDB用の `data.sql` を生成してみる。

Spring Bootは `data-プラットフォーム名.sql` を認識するので、`data-h2.sql`、`data-mariadb.sql` のようにプラットフォーム別のSQLファイルを用意しておけばそれを初期データとして読み込んでくれる。

`build.gradle` に、以下のようなタスクを追記して、`set `で開始するステートメントをH2向けには出力しないようにする。

```groovy
task processSql << {
    def sqlFile = file("src/main/sql/data.sql")
    file("src/main/resources/data-h2.sql").withWriter { writer ->
        file("src/main/sql/data.sql").eachLine { line ->
            if (!line.startsWith("set ")) {
                writer.println(line)
            }
        }
    }
    copy {
        from sqlFile
        into "src/main/resources"
        rename "data.sql", "data-mariadb.sql"
    }
}
```

`resources` のファイルを処理するタスクである `processResources` の前に実行されるようにしておく。

```groovy
processResources.dependsOn 'processSql'
```

もともと `application.yml` に `spring.datasource.platform` を定義していなかった場合は以下のように`h2` を明示的に書いておく必要がある。

```yaml
spring:
    datasource:
        platform: h2
```

なお、 `data-h2.sql` や `data-mariadb.sql` は自動生成されるファイルなので、バージョン管理下におかないように `.gitignore` にも追記しておく。

```
src/main/resources/data-*.sql
```

これで、カラムをNOT NULLにすることができ、ユニーク制約も適切に動作するようになったはず。

追記：
結局JDBCドライバ経由ではid = 0 を保存できるようにする設定(`sessionVariables=sql_mode='NO_AUTO_VALUE_ON_ZERO'`)を書かないなら、Entityの `@PrePersist` で`@Id`のフィールドに0を設定する処理はいらないのでは？と一瞬思ってしまったので追記。
これはやはり必要で、`@PrePersist` の部分がないと null で保存しようとしてしまいエラーが発生する。Hibernateにid = 0 のinsert文を生成させるためには必要な処理。
もちろん、Entityを保存する処理が Service の特定箇所に集約されている場合にはそこで `teamRepository.findOne(0)` して取得した Team を設定するようにしても良い。
…が、繰り返しになるが、前述の通りビジネスロジックというよりはデータ管理の領域なのでデータ定義の箇所にまとめた方が良いのでは、と思う。
