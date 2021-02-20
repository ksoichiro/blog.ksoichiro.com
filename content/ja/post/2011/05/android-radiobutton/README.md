---
title: "Android アノテーションでRadioButtonの値をコード値として取得"
created: 2011-05-03T13:14:00.000+09:00
tags: ["UI","Android"]
---
Androidのラジオボタンは、HTMLのラジオボタンのようなvalueを持っていません。
「どのRadioButtonが選択されたか」と「選択されたRadioButtonのテキスト」くらいしかそのラジオボタンを特定する情報がありません。
<!--more-->
そのため、ラジオボタンの値をDBへ登録しようなどと考えているとリソースIDとコード値の割り当てをハードコーディングすることになってしまいます。
例えば以下のような感じです。

```java
RadioGroup radioGroup = (RadioGroup) activity.findViewById(R.id.radio_group_foo);
int checkedId = radioGroup.getCheckedRadioButtonId();
int value;
switch (checkedId) {
case R.id.radio_button_foo_1:
  value = 1;
  break;
case R.id.radio_button_foo_2:
  value = 2;
  break;
} 
```

このマッピングを色んなところに散らかすのは嫌です。

AndroidのUIに関するプログラミングである以上、リソース(R.java)を扱うのは避けられそうにないので、外部の設定ファイルにマッピングを書くのは難しそうです。
そこで、アノテーションを使ってラジオボタンの値を設定するフィールドに情報をまとめることにしました。

ソースコードにマッピングを書くのは変わりませんが、情報がまとまるのでコードは見やすくなるはずです。
イメージは、SAStrutsのような、アノテーションをpublicフィールドに定義する感じです。

以下、必要なアノテーションです。

Radio.java

```java
@Target(value = { ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface Radio {
    int groupId();
    RadioValue[] values();
}
```

RadioValue.java

```java
@Target(value = { ElementType.ANNOTATION_TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface RadioValue {
    int id();
    String value();
}
```

ラジオボタンの以下のような定義があったとします。

```xml
<RadioGroup
  android:id="@+id/type"
  android:orientation="horizontal"
  android:layout_width="fill_parent"
  android:layout_height="wrap_content">
  <RadioButton
    android:id="@+id/type_a"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:checked="true"
    android:text="タイプA" />
  <RadioButton
    android:id="@+id/type_b"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="タイプB" />
</RadioGroup>
```

このラジオボタンの値を格納するフィールドをアノテーションを使って定義する例です。

```java
@Radio(groupId = R.id.type,
       values = { @RadioValue(id = R.id.type_a, value = "A"),
                  @RadioValue(id = R.id.type_b, value = "B") })
public String type;
```

アノテーションを使ってフィールドに値を取得するロジックです。(断片)

```java
Field field = target.getClass().getField("type");
:
Radio radio = (Radio) field.getAnnotation(Radio.class);
if (radio != null && type.equals(String.class)) {
    int groupId = radio.groupId();
    RadioGroup radioGroup = (RadioGroup) activity.findViewById(groupId);
    int checkedId = radioGroup.getCheckedRadioButtonId();
    RadioValue[] values = radio.values();
    for (int i = 0; i < values.length; i++) {
        if (values[i].id() == checkedId) {
            field.set(form, values[i].value());
            break;
        }
    }
}
```

これで、選択されたラジオボタンに応じて「A」や「B」などの値がtypeというフィールドに取得できます。

フィールド名をハードコーディングしているので、このままだとフィールド数分最後のロジックを書くことになってしまいますが、フィールドの取得部分(getField)も「クラス内の全てのpublicフィールドが対象」
などとしてしまえばだいぶ汎用的になるはずです。

注意:
上記のアノテーションRadioValueを定義せず、
Radio内にリソースIDの配列(int[] ids())と値の配列(String[] values())
を定義する方法も考えられますが、以下のAndroidのバグがあるためAndroid2.1以前では動作しません。
[Issue 11124: array of primitive types in annotation](http://code.google.com/p/android/issues/detail?id=11124)
プリミティブ型配列のアノテーションパラメータの実装が漏れていたようです。
