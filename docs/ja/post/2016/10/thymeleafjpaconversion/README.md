---
title: "Thymeleaf/JPAのConversion"
created: 2016-10-30T20:56:00.001+09:00
tags: ["JPA","Thymeleaf","Spring Boot"]
---
基本的な部分かもしれないが、Thymeleaf、JPAでの型変換を行う方法について。

### Thymeleafでの型変換

Thymeleafでは、SpringのConverterが定義されていれば`${{variable}}`の形式で書くことでConverterで変換した結果を出力してくれる。
なので、HTML上で分岐を書いたり独自の変換用のBeanを定義するよりはこの仕組みを使ったほうがいい。

例えば以下のような列挙型を定義していたとする。
<!--more-->

```java
public enum TaskStatusEnum {
    NOT_YET(0),
    DOING(1),
    CANCELLED(3),
    HOLD(2),
    DONE(4);

    private int code;

    TaskStatusEnum(int code) {
        this.code = code;
    }

    public int getCode() {
        return code;
    }

    public static TaskStatusEnum fromCode(int code) {
        for (TaskStatusEnum e : values()) {
            if (e.getCode() == code) {
                return e;
            }
        }
        throw new IllegalArgumentException("Unknown code: " + code);
    }
}
```

これに対して以下のような日本語を割り当てたいとする。

```properties
task.status.NOT_YET=未着手
task.status.DOING=作業中
task.status.HOLD=保留
task.status.CANCELLED=中止
task.status.DONE=完了
```

これには、以下のような TaskStatusEnum→StringのConverterのComponentを用意すればいい。

```java
import org.springframework.core.convert.converter.Converter;

@Component
public class TaskStatusToStringConverter implements Converter<TaskStatusEnum, String> {
    @Autowired
    private MessageSource messageSource;

    @Override
    public String convert(TaskStatusEnum source) {
        return messageSource.getMessage("task.status." + source.name(), null, Locale.getDefault());
    }
}
```

その上で、以下のように `th:text="${{entity.status}}"`の書き方をすれば、上記のConverterを使って文字列を変換してくれる。

```html
    <tr th:each="entity : ${tasks}">
        <td th:text="${{entity.status}}"></td>
    </tr>
```

このConverterは単一方向の変換なので、文字列からEnumに変換する場合にはそのためのConverterが必要。

```java
import org.springframework.core.convert.converter.Converter;

@Component
public class StringToTaskStatusConverter implements Converter<String, TaskStatusEnum> {
    @Override
    public TaskStatusEnum convert(String source) {
        return TaskStatusEnum.fromCode(Integer.parseInt(source));
    }
}
```

### JPAでの型変換

JPAのEntityでもEnumなどの型でフィールドを定義して、DBのテーブル上のデータ型とマッピングすることができる。

これはSpringでなくJPAの枠組みなので、JPAのAttributeConverterを使う。

以下のようにTaskStatusEnum(＝アプリで扱うための型)とInteger(＝DB上の型)の変換を定義する。

```java
import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter
public class TaskStatusConverter implements AttributeConverter<TaskStatusEnum, Integer> {
    @Override
    public Integer convertToDatabaseColumn(TaskStatusEnum attribute) {
        return attribute.getCode();
    }

    @Override
    public TaskStatusEnum convertToEntityAttribute(Integer dbData) {
        return TaskStatusEnum.fromCode(dbData);
    }
}
```

その上で、以下のようにEntityを定義する。

```java
import lombok.Data;
import javax.persistence.Convert;
import javax.persistence.Entity;

@Entity
@Data
public class Task {
    ...
    @Convert(converter = TaskStatusConverter.class)
    private TaskStatusEnum status;
    ...
}
```

こうすると、自分で都度変換する必要はなく、上記のAttributeConverterで相互に型を変換してくれる。

このようなAttributeConverterを用意しなくてもEnumとIntegerは自動的に変換をしてくれるので、上記のConverterは必要なのか？と思ってしまうが、これにはEnumのordinal()(＝定数の定義順)を使って値を相互変換しているので注意が必要。

ordinal()の値とコード値が同じならこれを使っても良いかもしれないが、Entityから離れた場所で定義されているEnum定数の定義順序がDB上のコード値と紐付いているとは、場合によっては気付きにくく、誤って順番を変えてしまうことなどもあるかもしれない。
(実は、この違いを確認できるように、上記サンプルコードでのTaskStatusEnumのcodeは低数値の定義順の通りにしていない。)

なので、個人的にはEnumをEntityの型に使うときはAttributeConverterを定義するのが良いだろうと思う。

### ユニットテスト

こういった自動的にやってくれるものについてはテストを省略してしまいがちな気がするが、少なからず実装コードがあり、手動で動作確認してOK、としているといつの間にか壊れていることもあるので、やはりテストを書いておきたい。

以下は、上記それぞれの変換をテストするための参考コード。

#### Thymeleaf

`messages_ja.properties` にメッセージを定義している場合には、デフォルトロケールを設定するコードがないと、環境によってテストが失敗してしまう。

```java
@SpringApplicationConfiguration(App.class)
public class TaskStatusToStringConverterJaTests {
    @ClassRule
    public static final SpringClassRule SPRING_CLASS_RULE = new SpringClassRule();

    @Rule
    public final SpringMethodRule springMethodRule = new SpringMethodRule();

    // デフォルトロケールを保存
    private static Locale defaultLocale = Locale.getDefault();

    @Autowired
    private TaskStatusToStringConverter converter;

    @BeforeClass
    public static void setUpClass() {
        // テスト開始時にロケールを ja に変更
        Locale.setDefault(Locale.JAPANESE);
    }

    @AfterClass
    public static void tearDownClass() {
        // テスト終了時にロケールを戻す
        Locale.setDefault(defaultLocale);
    }

    @Test
    public void convert() {
        assertThat(converter.convert(TaskStatusEnum.NOT_YET), is("未着手"));
        assertThat(converter.convert(TaskStatusEnum.DOING), is("作業中"));
        assertThat(converter.convert(TaskStatusEnum.CANCELLED), is("中止"));
        assertThat(converter.convert(TaskStatusEnum.HOLD), is("保留"));
        assertThat(converter.convert(TaskStatusEnum.DONE), is("完了"));
    }
}
```

#### JPA

DBからの取得時の変換は、予めSQLで登録したものをRepositoryで取得して変換結果をチェック。
DBへの保存時の変換は、Repositoryで保存したものをJdbcTemplateで取得して変換結果をチェック。

```java
@Sql({"/truncate.sql", "/data-task-status-converter.sql"})
@SpringApplicationConfiguration(App.class)
public class TaskStatusConverterTests extends AbstractTransactionalJUnit4SpringContextTests {
    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Test
    public void convertFromDatabase() {
        assertThat(taskRepository.findOne(1).getStatus(), is(TaskStatusEnum.NOT_YET));
        assertThat(taskRepository.findOne(2).getStatus(), is(TaskStatusEnum.DOING));
        assertThat(taskRepository.findOne(3).getStatus(), is(TaskStatusEnum.CANCELLED));
        assertThat(taskRepository.findOne(4).getStatus(), is(TaskStatusEnum.HOLD));
        assertThat(taskRepository.findOne(5).getStatus(), is(TaskStatusEnum.DONE));
    }

    @Test
    public void convertToDatabase() {
        Account account = accountRepository.findOne(1);

        for (TaskStatusEnum e : TaskStatusEnum.values()) {
            Task task = new Task("a", e, null, account);
            task = taskRepository.save(task);
            Integer status = Integer.parseInt(jdbcTemplate.queryForList("SELECT * FROM task WHERE id = ?", new Object[]{task.getId()}).get(0).get("status").toString());
            assertThat(status, is(e.getCode()));
        }
    }
}
```

data-task-status-converter.sql:

```sql
insert into `role` values (1, 'admin', 'Administrator', '2016-01-01 00:00:00', '2016-01-01 00:00:00');

insert into `account` values (1, 'a', 'A', 'PASSWORD', 1, 1, '2016-10-01 09:00:00', '2016-10-01 09:00:00');

insert into `task` values
(1, 'Send a mail1', 0, 1, current_date(), '2016-10-02 09:00:00', '2016-10-02 09:00:00'),
(2, 'Send a mail2', 1, 1, current_date(), '2016-10-02 09:00:00', '2016-10-02 09:00:00'),
(3, 'Send a mail3', 3, 1, current_date(), '2016-10-02 09:00:00', '2016-10-02 09:00:00'),
(4, 'Send a mail4', 2, 1, current_date(), '2016-10-02 09:00:00', '2016-10-02 09:00:00'),
(5, 'Send a mail5', 4, 1, current_date(), '2016-10-02 09:00:00', '2016-10-02 09:00:00');
```
