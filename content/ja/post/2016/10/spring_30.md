---
title: "Springのバリデーションエラーメッセージを通常メッセージに統合する"
originalCreatedAt: 2016-10-30T19:11:00.001+09:00
tags: ["Spring Boot"]
---
Bean ValidationのエラーメッセージはValidationMessages.propertiesもしくはValidationMessages_ja.propertiesに書かなければならないと思っていたが、そうではなかった。

以下のようにMessageSourceで読み込んだ内容をLocalValidatorFactoryBeanに渡せば良い。

```java
@Configuration
public class WebMvcConfig extends WebMvcConfigurerAdapter {
    @Autowired
    private MessageSource messageSource;

    @Bean
    public LocalValidatorFactoryBean validator() {
        LocalValidatorFactoryBean localValidatorFactoryBean = new LocalValidatorFactoryBean();
        localValidatorFactoryBean.setValidationMessageSource(messageSource);
        return localValidatorFactoryBean;
    }

    @Override
    public Validator getValidator() {
        return validator();
    }
}
```

messages.propertiesはnative2asciiで変換せず直接マルチバイトのメッセージを書いていても動作するので、この方法の方がいいかもしれない。
(コードレビューでも直接日本語のメッセージが読めるし)
