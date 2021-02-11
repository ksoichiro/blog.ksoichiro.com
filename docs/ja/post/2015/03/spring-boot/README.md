---
title: "Spring Bootでユーザ認証"
created: 2015-03-28T16:59:00.001+09:00
tags: ["Java","Spring Boot"]
---
Spring Bootで(というかSpring Securityのような気もするが)
ユーザ認証を実装する方法について。
とりあえずハードコードで、という方法は見つかるのだが

* DBにユーザ情報を格納し
* ID以外のユーザ情報にもアクセスできるようにする

という場合の方法が見つからず苦労したので記録しておく。
<!--more-->

### 概要

以下の作業が必要。

* Spring Securityをdependencyに追加する
* `WebSecurityConfigurerAdapter`を継承して設定する
* `UserDetailsService`を継承して認証ロジックをカスタマイズする

### Spring Securityをdependencyに追加する

`build.gradle`の`dependencies`に`spring-boot-starter-security`を追加する。
(バージョンは適切なものを選ぶ)

```gradle
dependencies {
    :
    compile 'org.springframework.boot:spring-boot-starter-security:1.2.2.RELEASE'
}
```

### WebSecurityConfigurerAdapterを継承して設定する

ルートパッケージに以下のようなクラスを作成する。

```java
@Configuration
@EnableWebMvcSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
                .antMatchers("/", "/css/**", "/webjars/**").permitAll()
                .anyRequest().authenticated()
                .and()
            .formLogin()
                .loginPage("/login")
                .permitAll()
                .and()
            .logout()
                .logoutRequestMatcher(new AntPathRequestMatcher("/logout")) // Required to use GET method for logout
                .permitAll();
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth
            .userDetailsService(userDetailsService)
            .passwordEncoder(new StandardPasswordEncoder());
    }
}
```

ポイント：

* DIしている`UserDetailsServiceImpl`クラスはこれから作成するクラス（後述）。
* `.antMatchers("/", "/css/**", "/webjars/**")`の部分は認証なしでアクセスできるパスの指定。必要に応じて変更する必要あり。
* `.logoutRequestMatcher(new AntPathRequestMatcher("/logout"))`の指定は、
ログアウトのリンクをformでなくアンカー(GET)で作る場合に必要。これがないと、/logoutにアクセスした時にCSRFトークンのチェックに引っ掛かる。
* `.passwordEncoder(new StandardPasswordEncoder())`
の指定は、パスワードの暗号化方法を指定している。

### UserDetailsServiceを継承して認証ロジックをカスタマイズする

デフォルトではログインに使用する`username`だけしか
セッションに保管されないのだが、
実際の`user`テーブルと関連を持つテーブルは`user.id`などで参照させると思う。
これを取得するためにいちいちSELECTするのもおかしな話なので
認証とともに`User`クラスをセッションに持たせるようにしたい。
つまり、以下のようにコントローラのアクションで`Principal`パラメータを持たせたら

```java
@RequestMapping
public String index(Principal principal, TodoForm form, Model model) {
```

そこからユーザ情報が取り出せるようにしたい。

```java
Authentication authentication = (Authentication) principal;
User user = (User) authentication.getPrincipal();
model.addAttribute("allTodos", todoService.findAll(user.getId()));
```

そこで、既に名前だけ登場している`UserDetailsServiceImpl`をserviceパッケージ内に作る。

```java
@Component
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {
        User user = null;
        if (null == username || "".equals(username)) {
            throw new UsernameNotFoundException("Username is empty");
        } else {
            User domainUser = userRepository.findByUsername(username);
            if (domainUser == null) {
                throw new UsernameNotFoundException("User not found for name: " + username);
            } else {
                List<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();
                if (domainUser.getRoles() != null) {
                    for (Role role : domainUser.getRoles()) {
                        authorities.add(
                                new SimpleGrantedAuthority(role.getName()));
                    }
                }
                user = new User(username,
                        domainUser.getPassword(),
                        domainUser.isEnabled(),
                        true, true, true, authorities);
                user.setId(domainUser.getId());
                user.setCreatedAt(domainUser.getCreatedAt());
                user.setUpdatedAt(domainUser.getUpdatedAt());
                user.setRoles(domainUser.getRoles());
            }
        }
        return user;
    }
}
```

ここで登場する`User`クラスはプロジェクト内で定義しているクラスだが、`org.springframework.security.core.userdetails.User`を継承しているのがポイント。

```java
@Entity
public class User extends org.springframework.security.core.userdetails.User {
    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    private boolean enabled;

    @Column(nullable = false)
    private Long createdAt;

    @Column(nullable = false)
    private Long updatedAt;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(name = "role_user", joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles;

    public User() {
        super("INVALID", "INVALID", false, false, false, false, new ArrayList<GrantedAuthority>());
    }

    public User(String username, String password, boolean enabled, boolean accountNonExpired,
                boolean credentialsNonExpired, boolean accountNonLocked, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, enabled, accountNonExpired, credentialsNonExpired, accountNonLocked, authorities);
        setUsername(username);
        setPassword(password);
        setEnabled(enabled);
    }

    // getter/setterは省略
}
```
