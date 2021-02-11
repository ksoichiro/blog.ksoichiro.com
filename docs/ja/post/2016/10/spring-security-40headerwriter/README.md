---
title: "Spring Security 4.0ではHeaderWriterを使って静的リソースのキャッシュヘッダを適切につける"
created: 2016-10-30T21:22:00.001+09:00
tags: ["Spring Security","Spring Boot"]
---
以前のエントリ
[Spring BootでJavaScript/CSSライブラリにフィンガープリントをつける](http://ksoichiro.blogspot.jp/2016/03/spring-bootjavascriptcss.html)
[Spring BootでJavaScript/CSSライブラリにフィンガープリントをつける (2)](http://ksoichiro.blogspot.jp/2016/03/spring-bootjavascriptcss-2.html)
の方法だけだと、フィンガープリントを付けることはできてもSpring Securityによりキャッシュ無効化のヘッダが付いてしまうためキャッシュされない。
そこで静的リソースについてはキャッシュヘッダを無効化してみて、一見 `Cache-Control: no-cache` のようなヘッダはなくなったかのように見えたが、Font Awesomeのアイコンがどうもちらつくな…と思って調べた。

すると、静的リソースについては全体的にキャッシュ系のヘッダを無効化していたものの、Expiresヘッダだけはついてしまっていた。
※Spring Boot 1.3.2 (Spring Security 4.0.3) を使用。

<!--more-->

Stack Overflowにこの問題についての質問があった。
[How to remove Expires header with Spring cache control](http://stackoverflow.com/questions/36011255/how-to-remove-expires-header-with-spring-cache-control)

`Cache-Control: max-age=xxxx` のようなヘッダは出ているのだが、`Expires: 0` がでてしまうせいでキャッシュが効かない。

これについての [回答](http://stackoverflow.com/a/36017075/4285965) によると、Spring Security 4.0系だとワークアラウンドが必要とのこと。
回答のコードを引用：

```java
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        RequestMatcher notResourcesMatcher = new NegatedRequestMatcher(new AntPathRequestMatcher("/resources/**"));
        HeaderWriter notResourcesHeaderWriter = new DelegatingRequestMatcherHeaderWriter(notResourcesMatcher , new CacheControlHeadersWriter());
        http
            .headers()
                .cacheControl().disable()
                .addHeaderWriter(notResourcesHeaderWriter);
    }
}
```

この回答では `/resources/**` に静的リソースが全て配置されている想定だが、`/css/**`, `/js/**`, `/lib/**` に配置している場合は `new AntPathRequestMatcher("/resources/**")` ではカバーできないので [OrRequestMatcher](http://docs.spring.io/spring-security/site/docs/4.0.3.RELEASE/apidocs/org/springframework/security/web/util/matcher/OrRequestMatcher.html) を使ってみる。

```
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    private LoginService loginService;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
            .antMatchers("/css/**", "/js/**", "/lib/**").permitAll()
            .anyRequest().authenticated()
        .and()
            .formLogin()
            .loginPage("/login")
            .permitAll()
        .and()
            .logout()
            .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
            .permitAll();

        // 静的リソースのキャッシュ制御を無効化
        RequestMatcher notResourcesMatcher = new NegatedRequestMatcher(
            new OrRequestMatcher(
                new AntPathRequestMatcher("/css/**"),
                new AntPathRequestMatcher("/js/**"),
                new AntPathRequestMatcher("/lib/**")));
        HeaderWriter notResourcesHeaderWriter = new DelegatingRequestMatcherHeaderWriter(notResourcesMatcher, new CacheControlHeadersWriter());
        http
            .headers()
                .cacheControl().disable()
                .addHeaderWriter(notResourcesHeaderWriter);
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth
            .userDetailsService(loginService)
            .passwordEncoder(new BCryptPasswordEncoder());
    }
}
```

以前のエントリで書いたように、WebMvcConfigurerAdapterを継承したConfigurationでバージョンを指定し、その中で cachePeriod も指定しておいたほうがいい。
ここで指定した値は max-age に入る模様。

```java
@Configuration
public class WebMvcConfig extends WebMvcConfigurerAdapter {
    private static final int CACHE_PERIOD = 365 * 24 * 60 * 60;
    ...
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        VersionResourceResolver versionResolver = new VersionResourceResolver()
            .addContentVersionStrategy("/css/**", "/js/**")
            .addVersionStrategy(new PrefixAndFixedVersionStrategy("lib/", gitProperties.getCommitId()), "/lib/**");
        registry.addResourceHandler("/**")
            .addResourceLocations("classpath:static/")
            .setCachePeriod(CACHE_PERIOD)
            .resourceChain(true)
            .addResolver(versionResolver);
    }
}
```

これらによってキャッシュが効くようになり、アイコンのちらつきはなくなった。
