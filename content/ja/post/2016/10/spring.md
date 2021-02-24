---
title: "Springのテストを速くする工夫"
noEnglish: true
originalCreatedAt: 2016-10-09T21:24:00.001+09:00
tags: ["Spring Boot"]
---
Spring BootでControllerを含めたテストをする場合に、`MockMvcBuilders.webAppContextSetup()` でセットアップして `@WebIntegrationTests` にすると通常のアプリケーションとしてテストできるが、数が多くなってくると重い。

いくつか改善できそうなポイントを調べたので記録しておく。

なお、極力Springを使わないのがベストだが、今回はそれができないケースを想定しているので除外。
<!--more-->

### WebIntegrationTestsをやめる

Tomcatを起動するため、やはり遅い。
代わりに `@WebAppConfiguration` だけにしてみる。

### Hibernateが読み込むSQLを小さくする

デフォルトでは、`src/main/resources/data.sql` というファイルがあればそれが起動時に読み込まれてしまう。

これを、以下のように `src/test/resources/data-empty.sql` というファイルを用意して

```sql
select 1;
```

テストクラスに以下のように付与する。

```java
@TestPropertySource(properties = "spring.datasource.data: /data-empty.sql")
```

すると、デフォルトの data.sql は読み込まれずにこちらのファイルが読み込まれる。
data.sql が大きいファイルの場合は多少効果があるかもしれない。

### Auto-configurationを削減する

例えば `spring-boot-starter-data-elasticsearch` の dependency を取り込んでいると、それだけで Spring Boot 起動時に Elasticsearch が起動してしまう。
Elasticsearch の機能を使う Controller なら仕方ないが、関係のない Controller のテストでは起動しないようにしたい。
Spring BootのAuto-configurationによってこれが起動してしまうため、Elasticsearch関連のAuto-configurationを除外すればいいが、これだけだと、`ElasticsearchRepository` を使っている `@Service` のDIが失敗するため、これらも ComponentScan の対象外にする必要がある。

以下のようなアノテーションを定義して

```java
// ElasticsearchRepositoryを使うServiceに対して
// @Serviceの代わりに付与
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@Service
public @interface ElasticsearchDependentService {
}

// ElasticsearchDependentServiceを使うControllerに対して
// @Controllerの代わりに付与
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@Controller
public @interface ElasticsearchDependentController {
}

// Elasticsearchを使わないアプリケーションクラスに付与。
// com.example.spring.App は SpringBootApplication を付与したクラス。
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@Configuration
@ComponentScan(value = "com.example.spring", excludeFilters = {
    @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = App.class),
    @ComponentScan.Filter(type = FilterType.ANNOTATION, classes = ElasticsearchDependentService.class),
    @ComponentScan.Filter(type = FilterType.ANNOTATION, classes = ElasticsearchDependentController.class)
})
@EnableAutoConfiguration(exclude={ElasticsearchAutoConfiguration.class, ElasticsearchDataAutoConfiguration.class})
@EnableJpaRepositories("com.example.spring.repository")
@EntityScan("com.example.spring.domain")
public @interface NoElasticsearchConfiguration {
}
```

テスト用のアプリケーションクラスを定義しておく。

```java
@NoElasticsearchConfiguration
public class NoElasticsearchTestApp {
}
```

このクラスを SpringApplicationConfiguration としてテストクラスで使えば、Elasticsearchを起動せずにテストできる。

```java
@SpringApplicationConfiguration(classes = NoElasticsearchTestApp.class)
```

### WebAppConfigurationを使わない

Controller が全てスキャンされてしまうのも避けたいが、上記のように ComponentScan の excludeFilter を調整しても `@WebAppConfiguration`をつけただけで結局スキャンされてしまう。

`@WebAppConfiguration` を使わないと色々DIに失敗するため、自分で `@Bean` を定義してやる必要がある。

まず全部の Controller をスキャン対象外にするアノテーションを用意。

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@Configuration
@ComponentScan(value = "com.example.spring", excludeFilters = {
    @ComponentScan.Filter(type = FilterType.ANNOTATION, classes = SpringBootApplication.class),
    @ComponentScan.Filter(type = FilterType.ANNOTATION, classes = ElasticsearchDependentService.class),
    @ComponentScan.Filter(type = FilterType.ANNOTATION, classes = Controller.class)
})
@EnableJpaRepositories("com.example.spring.repository")
@EntityScan("com.example.spring.domain")
public @interface StandaloneControllerConfiguration {
}
```

これを付与した内部クラスを作って、その中で不足しているBeanを登録する。
ここでは ErrorAttributes と テスト対象の Controller。

```java
@SpringApplicationConfiguration(classes = {NoElasticsearchAutoConfigurationConfiguration.class, ProjectControllerNoWebAppTests.Config.class})
public class ProjectControllerNoWebAppTests {
    @StandaloneControllerConfiguration
    static class Config {
        @Bean
        ErrorAttributes errorAttributes() {
            return new DefaultErrorAttributes();
        }
        @Bean
        ProjectController projectController() {
            return new ProjectController();
        }
    }

    @ClassRule
    public static final SpringClassRule SPRING_CLASS_RULE = new SpringClassRule();

    @Rule
    public final SpringMethodRule springMethodRule = new SpringMethodRule();

    protected MockMvc mockMvc;

    @Autowired
    private ProjectController projectController;

    @Before
    public void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(projectController).build();
    }
```

ErrorAttributes は、独自にエラーハンドリングをする際に ErrorController を実装したクラスを用意してその中でDIしたりする。
WebAppConfiguration でないと、DIできるクラスがないということで `@Autowired` が失敗する。

また、Pageable を使ったメソッドがある場合、インスタンス化できないというエラーで失敗する。
これには `PageableHandlerMethodArgumentResolver` を使えばいい。

```java
mockMvc = MockMvcBuilders.standaloneSetup(projectController)
    .setCustomArgumentResolvers(new PageableHandlerMethodArgumentResolver())
    .build();
```

----

ソースコードは[こちら](https://github.com/ksoichiro/spring-boot-practice/tree/master/contents/20160927-mock-controller-tests)。
