---
title: "SAStruts ボタンのラベル"
createdAt: 2011-06-11T22:19:00.000+09:00
tags: ["Java","JSP","SAStruts"]
---
急にSAStrutsです。

JSPに日本語を直接書かず、プロパティファイルに集約することを考えました。
<!--more-->
普通のラベルなどは<bean:message>を使うことで簡単にできましたが、ボタンのラベルに適用することができず少し手こずりました。
タグの属性にタグを使いたい時、EL式を定義するか新しいタグを作るかと思ってしまいますが
ちゃんと用意されていました。
結果的にはSAStruts(s:submit)の新しいやり方でなくStrutsのときから用意されていたやり方(html:submit)でした。

プロパティ(application\_ja.properties)：

```
labels.login_id=ログインID
```

普通のラベル表示：

```xml
<bean:message key="labels.login_id" />
```

ボタンに適用(NG)：

```xml
<s:submit value="<bean:message key="labels.login_id" />" />
```

ボタンに適用(OK)：

```xml
<s:submit><bean:message key="labels.login_id" /></s:submit>
```

ボタンに適用(OK)：

```xml
<html:submit><bean:message key="labels.login_id" /></html:submit>
```
