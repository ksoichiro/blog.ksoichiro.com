---
title: "Android CheckStyle設定"
originalCreatedAt: 2011-05-05T23:01:00.000+09:00
tags: ["CheckStyle","eclipse","Android"]
---
AndroidプロジェクトでのCheckStyle設定についてです。

Android Open Source Projectのコードスタイルでは、フィールド名はmから開始する、
などのルールがあります。
<!--more-->
[Code Style Guidelines for Contributors](http://source.android.com/source/code-style.html)

これはコントリビューター向けのものではありますが、自分のアプリの書くコードもなるべくこれに沿っていた方が見やすいかなと思っています。

> 多くはCode Completeにあるような推奨されるor避けるべき書き方の話なのでAndroid特有のルールというのは実は少ないかもしれません。

そこでCheckStyleでチェックしようとしたのですが、ちょっと苦労したので載せておきます。
Android用のCheckStyle設定を公開してくださっている方がいます。
[Checkstyle for Android](http://knol.google.com/k/fred-grott/checkstyle-for-android/166jfml0mowlh/48)

でもこれ、一部間違いがあって動きませんでした。

内容的にもちょっとチェックが緩いかなと思うので、上記を参考にしつつも普通に作ってみました。
結局、特にAndroidっぽくないんですが…

**ファイル一覧**

まずは、必要なファイルの一覧です。
C:\\eclipseフォルダにEclipseがインストールされているとします。
ワークスペースはC:\\eclipse\\workspaceにあるとします。

C:\\eclipse\\tools\\android-checkstyle.xml
C:\\eclipse\\workspace\\プロジェクト\\checkstyle.header
C:\\eclipse\\workspace\\プロジェクト\\checkstyle\_suppressions.xml

import-controlのファイルも用意しても良いですが、個人で開発しているのなら邪魔になるだけなのでやめておきます。

**ファイル内容**

個別のファイルの内容です。

C:\\eclipse\\tools\\android-checkstyle.xml

ポイントは26行目～のMemberNameです。
publicフィールドは通常の命名、その他はmから開始する名前としています。
実際にはこのままpublicフィールドを定義すると「privateにすべきです」と言われてしまうんですが。

あとは、通常のJavaでの話ですが、日本語のJavadocを書くなら19行目のようにJavadocStyleのプロパティで「。」が１文目の末尾に来ていいように変えたほうが良いです。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE module PUBLIC "-//Puppy Crawl//DTD Check Configuration 1.3//EN" "http://www.puppycrawl.com/dtds/configuration_1_3.dtd">

<!--
    This configuration file was written by the eclipse-cs plugin configuration editor
-->
<!--
    Checkstyle-Configuration: android_checkstyle
    Description: none
-->
<module name="Checker">
  <property name="severity" value="warning"/>
  <module name="TreeWalker">
    <property name="tabWidth" value="4"/>
    <module name="JavadocMethod"/>
    <module name="JavadocType"/>
    <module name="JavadocVariable"/>
    <module name="JavadocStyle">
      <property name="endOfSentenceFormat" value="([。.?!][ \t\n\r\f&lt;])|([。.?!]$)"/>
    </module>
    <module name="AbstractClassName"/>
    <module name="ClassTypeParameterName"/>
    <module name="ConstantName"/>
    <module name="LocalFinalVariableName"/>
    <module name="LocalVariableName"/>
    <module name="MemberName">
      <property name="applyToPublic" value="true"/>
      <property name="applyToProtected" value="false"/>
      <property name="applyToPackage" value="false"/>
      <property name="applyToPrivate" value="false"/>
      <property name="format" value="^[a-zA-Z0-9]*$"/>
    </module>
    <module name="MemberName">
      <property name="applyToPublic" value="false"/>
      <property name="applyToProtected" value="true"/>
      <property name="applyToPackage" value="true"/>
      <property name="applyToPrivate" value="true"/>
      <property name="format" value="^m[a-zA-Z0-9]*$"/>
    </module>
    <module name="MethodName"/>
    <module name="MethodTypeParameterName"/>
    <module name="PackageName"/>
    <module name="ParameterName"/>
    <module name="StaticVariableName"/>
    <module name="TypeName"/>
    <module name="AvoidStarImport"/>
    <module name="IllegalImport"/>
    <module name="RedundantImport"/>
    <module name="UnusedImports"/>
    <module name="LineLength">
      <property name="max" value="100"/>
      <property name="tabWidth" value="4"/>
    </module>
    <module name="MethodLength"/>
    <module name="ParameterNumber"/>
    <module name="EmptyForIteratorPad"/>
    <module name="GenericWhitespace"/>
    <module name="MethodParamPad"/>
    <module name="NoWhitespaceAfter"/>
    <module name="NoWhitespaceBefore"/>
    <module name="OperatorWrap"/>
    <module name="ParenPad"/>
    <module name="TypecastParenPad"/>
    <module name="WhitespaceAfter"/>
    <module name="WhitespaceAround"/>
    <module name="ModifierOrder"/>
    <module name="RedundantModifier"/>
    <module name="AvoidNestedBlocks"/>
    <module name="EmptyBlock"/>
    <module name="LeftCurly"/>
    <module name="NeedBraces"/>
    <module name="RightCurly"/>
    <module name="EmptyStatement"/>
    <module name="EqualsHashCode"/>
    <module name="HiddenField"/>
    <module name="IllegalInstantiation"/>
    <module name="InnerAssignment"/>
    <module name="MagicNumber"/>
    <module name="MissingSwitchDefault"/>
    <module name="RedundantThrows"/>
    <module name="SimplifyBooleanExpression"/>
    <module name="SimplifyBooleanReturn"/>
    <module name="DesignForExtension"/>
    <module name="FinalClass"/>
    <module name="HideUtilityClassConstructor"/>
    <module name="InterfaceIsType"/>
    <module name="VisibilityModifier"/>
    <module name="ArrayTypeStyle"/>
    <module name="FinalParameters"/>
    <module name="TodoComment">
      <property name="severity" value="ignore"/>
      <metadata name="net.sf.eclipsecs.core.lastEnabledSeverity" value="inherit"/>
    </module>
    <module name="UpperEll"/>
    <module name="AnnotationUseStyle"/>
    <module name="MissingDeprecated"/>
    <module name="MissingOverride"/>
    <module name="PackageAnnotation"/>
    <module name="SuppressWarnings"/>
    <module name="StringLiteralEquality"/>
    <module name="ArrayTrailingComma"/>
    <module name="UnnecessaryParentheses"/>
    <module name="OneStatementPerLine"/>
    <module name="ParameterAssignment"/>
    <module name="PackageDeclaration"/>
    <module name="NoFinalizer"/>
    <module name="NestedTryDepth"/>
    <module name="DefaultComesLast"/>
    <module name="GenericWhitespace"/>
    <module name="EmptyForInitializerPad"/>
    <module name="DeclarationOrder"/>
  </module>
  <module name="NewlineAtEndOfFile">
    <property name="severity" value="ignore"/>
    <metadata name="net.sf.eclipsecs.core.lastEnabledSeverity" value="inherit"/>
  </module>
  <module name="Translation"/>
  <module name="FileLength"/>
  <module name="FileTabCharacter">
    <property name="severity" value="ignore"/>
    <metadata name="net.sf.eclipsecs.core.lastEnabledSeverity" value="inherit"/>
  </module>
  <module name="JavadocPackage"/>
  <module name="RegexpSingleline">
    <property name="severity" value="ignore"/>
    <property name="format" value="\s+$"/>
    <property name="message" value="Line has trailing spaces."/>
    <metadata name="net.sf.eclipsecs.core.lastEnabledSeverity" value="inherit"/>
  </module>
  <module name="Header">
    <property name="headerFile" value="${project_loc}/checkstyle.header"/>
  </module>
  <module name="SuppressionFilter">
    <property name="file" value="${project_loc}/checkstyle_suppressions.xml"/>
  </module>
</module>
```

C:\\eclipse\\workspace\\プロジェクト\\checkstyle.header

各ファイルの先頭につけるヘッダです。
これはプロジェクトごとに書いた方が良いと思いますので、上記のandroid-checkstyle.xmlの中でプロジェクトフォルダ以下(${project\_loc})に置くようにしています。

```java
/*
 * Copyright (C) 2011 XXX
 */
```

C:\\eclipse\\workspace\\プロジェクト\\checkstyle\_suppressions.xml

チェックを除外する設定です。
自動生成されるR.javaをCheckStyleにかけるとひどいことになるので、これは除外しなければなりません。
それが6行目の記述です。
また、上記のFred Grottさんの設定で動かなかったのは7行目です。
「.\*\\.properties」とすべきところが「\*\\.properties」となっているので動作しませんでした。

```xml
<?xml version="1.0"?>
<!DOCTYPE suppressions PUBLIC
    "-//Puppy Crawl//DTD Suppressions 1.1//EN"
    "http://www.puppycrawl.com/dtds/suppressions_1_1.dtd">
<suppressions>
    <suppress checks="[a-zA-Z0-9]*" files="R\.java"/>
    <suppress checks="[a-zA-Z0-9]*" files="BuildConfig\.java" />
    <suppress checks="." files=".*\.properties"/>
    <suppress checks="." files=".*[\\/]grammars[\\/]Generated[a-zA-Z]*\.java"/>
    <suppress checks="." files=".*[\\/]grammars[\\/]Generated[a-zA-Z]*\.java"/>
    <suppress checks="." files=".*[\\/]checkstyle[\\/]gui[\\/]"/>
</suppressions>
```

**[2013/02/16 追記]**

現在のCheckStyleのバージョン(5.6)では、android-checkstyle.xmlの以下の記述により ビルドできなくなってしまうため、削除しました。

```xml
<module name="DoubleCheckedLocking"/>
```

**[2013/04/28 追記]**

現在のAndroidではgenフォルダ内にBuildConfig.javaも生成されるため、checkstyle\_suppressions.xmlに以下を追記しました。

```xml
<suppress checks="[a-zA-Z0-9]*" files="BuildConfig\.java" />
```
