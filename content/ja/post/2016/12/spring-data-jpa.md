---
title: "Spring Data JPAで複数テーブルを結合した結果を返すクエリを作る"
originalCreatedAt: 2016-12-31T23:29:00.001+09:00
tags: ["JPA","Spring Boot"]
---
少し前に検証したものだが、改めて整理。

テーブルAとテーブルBを結合した結果を取得したい場合に、普通にSpring DataのRepositoryを作って`@Query` のメソッドを定義してもうまくいかない。
例えば以下のようなクエリは表現できない。

```sql
select a.id, b.id, b.name from a join b on b.id = a.b_id;
```

これを何とかRepositoryで表現するための方法について。
<!--more-->

### 具体例

もう少し具体的な例で説明していく。

departmentとemployeeという1対多の関係を持つテーブルを考える。

```sql
create table `department` (
    id int primary key auto_increment,
    name varchar(255) not null
);

create table `employee` (
    id int primary key auto_increment,
    department_id int not null,
    name varchar(255) not null
);
```

このようなテーブルに対して、以下のようなEntityを作る。

```java
@Data // Lombok利用
@Entity
public class Department {
    @Id
    @GeneratedValue
    private Integer id;

    private String name;

    @OneToMany(mappedBy = "department")
    private List<Employee> employees;
}

@Data
@Entity
public class Employee {
    @Id
    @GeneratedValue
    private Integer id;

    private String name;

    @ManyToOne
    private Department department;
}
```

ここで、以下のようなクエリを実行したいとする。

```sql
select e.id, e.name, d.name
from employee e 
left join department d on d.id = e.department_id
order by e.id 
```

これくらいだと実装は普通にできてしまうが…JPAの枠組みで単にJOINすると、employee.getDepartment().getName()というように各レコードに対してアクセスする都度クエリが発行されてしまうN + 1問題が発生するし、かといってこれをJOIN FETCHで無理に結合して取得しようとすると、Hibernateが

```
firstResult/maxResults specified with collection fetch; applying in memory!
```

というような警告ログを出力したりする。
これを避けるためにNative queryにすると、今度は結合はできても結果がfetchされなくなってN + 1問題が再発する…。

そんな状況を避けたい。

### 解決策1

それには、上記のような項目リストを持つ新しいEntityを定義する方法が使えそう。

```java
@Data
@AllArgsConstructor
public class ExtendedEmployee {
    private Integer id;
    private String name;
    private String departmentName;
}
```

このクラスは`@Entity`を付与していないので、

```java
public interface ExtendedEmployeeRepository extends JpaRepository<ExtendedEmployee, Integer>
```

のようなRepositoryを定義することはできない。

元のEmployeeに対するEmployeeRepositoryを以下のように定義していたとすると

```java
public interface EmployeeRepository extends JpaRepository<Employee, Integer>
```

戻り値としてExtendedEmployeeを扱うことはできないが、Object[]を扱うことはできる。
これを利用して、EmployeeRepositoryの方に新しいメソッドを用意する。

```java
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
    // e.nameとd.nameで名前が重複しないように as dname を付与している。
    @Query(value = "select e.id, e.name, d.name as dname "
        + "from employee e "
        + "left join department d on d.id = e.department_id "
        + "where d.name = ?1 "
        + "order by e.id ",
        nativeQuery = true)
    List<Object[]> findByDepartmentNameRaw(String departmentName);

    // 呼び出し側でObject[]をそのまま扱うのは不便なので変換する。
    default List<ExtendedEmployee> findByDepartmentName(String departmentName) {
        return findByDepartmentNameRaw(departmentName)
            .stream()
            .map(ExtendedEmployee::new)
            .collect(Collectors.toList());
    }
}
```

ExtendedEmployeeには以下のようなコンストラクタを追加しておく。

```java
    public ExtendedEmployee(Object[] objects) {
        this((Integer) objects[0], (String) objects[1], (String) objects[2]);
    }
```

これで動作はするのだが、わかりにくいし面倒。

### 解決策2

Object[]を扱うのを避けるには、JpaRepositoryの型パラメータに、拡張したEntityを直接していするしかない。
それをするにはそのEntityは `@Entity` を付与している必要がある。
ということで、今度は `@Entity` を付与したクラスを用意する。

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class ExtendedEmployee2 {
    @Id
    private Integer id;
    private String name;
    private String departmentName;
}
```

`@Id` を使っているのがポイント。`@Id` がないと動作しない。
そして、Repositoryを定義する。

```java
public interface ExtendedEmployeeRepository extends JpaRepository<ExtendedEmployee2, Integer> {
    @Query(value = "select e.id as id, e.name as name, d.name as department_name "
        + "from employee e "
        + "left join department d on d.id = e.department_id "
        + "where d.name = ?1 "
        + "order by e.id ",
        nativeQuery = true)
    List<ExtendedEmployee2> findByDepartmentName(String departmentName);
}
```

項目名を列挙しないといけないのは通常に比べると面倒ではあるものの、通常の native query と大差ない実装になった。

存在しないテーブルに対するEntityを定義するので、プロジェクトの中で混乱を生む可能性もあるが、パッケージを分けるとか工夫をすればいい。

---

別の考え方としてQueryDSLを使う方法もある。
QueryDSLでも実現可能だが、今回は静的なSQLを定義する方法を想定しているので割愛。

今回の検証のソースは[こちら](https://github.com/ksoichiro/spring-boot-practice/tree/master/contents/20161012-native-query)。
