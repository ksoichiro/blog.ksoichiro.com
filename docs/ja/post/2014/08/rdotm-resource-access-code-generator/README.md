---
title: "rdotm - Resource access code generator for Objective-C"
created: 2014-08-10T16:51:00.001+09:00
tags: ["iOS","Android"]
---
[Qiitaにも投稿しましたが](http://qiita.com/ksoichiro/items/4befb2695b1efdff72dd)、
iOSアプリ開発でもAndroidのR.javaのような仕組みでリソースに安全にアクセスする仕組みを作りました。
**[rdotm - GitHub](https://github.com/ksoichiro/rdotm)**

R.mというファイルを自動生成し、XMLに定義した文字列を「文字列ではなくコードで」アクセスできるようにします。

"R.java iOS"などと検索すると、
以下のように海外でも探している人がいるようなので(3年前ですけどね...)
[Equivalent to R in iOS - Stackoverflow](http://stackoverflow.com/questions/7082336/equivalent-to-r-in-ios)
試しに英語でも書いておこうと思います。

----

Recently, I developed the tool [rdotm](https://github.com/ksoichiro/rdotm)(R.m) for iOS app development.

## What's this tool?

rdotm(R.m) is the Objective-C resource definition generator like Android app's `R.java`.
See the following demo especially auto-completion of `string_*`.

![Demo][1]

<!--more-->

## Background

The tool **`rdotm`** is for Objective-C (iOS), but the idea came from Android app's deveopment.

In Android app's development, R.java mechanism enables us to access the resources defined by XML safely.
Because misspelling the resource name causes compile errors, so we can never release the app including misspelled resource name.

For example, the following code generates a constant `R.string.app_name`.

```
<resources>
    <string name="app_name">Foo</string>
</resources>
```
We can get "Foo" by `getString(R.string.app_name)`.

In iOS develpment, although there is a great i18n(l10n?) system using `NSLocalizedString`,
we should specify the name of the string resource by `NSString`.

When we define `Localizable.strings` like this,

```
"something" = "anything";
```

then we can refer this string with the following code:

```objc
// OK, this will be @"anything"
NSString *s = NSLocalizedString(@"something", nil);
```

but you may mistype it:

```objc
NSString *s = NSLocalizedString(@"s0mething", nil);
```

This **DOES NOT** cause any compile errors and the result will be the 1st param `s0mething`.
This means that you must run the app manually and detect this bug with your eyes, or write some test codes to detect it.
I didn't want to test it manually nor checking someone's code to detect this kind of bugs.

There was a discussion in Stackvoverflow about this three years ago.
[Equivalent to R in iOS - Stackoverflow](http://stackoverflow.com/questions/7082336/equivalent-to-r-in-ios)
But unfortunately, it seems that it's not resolved.

So I introduced `R.java` mechanism into my iOS app develoment by developing `rdotm`.

## What can I do with 'rdotm'?

It generates Objective-C codes from XML.

### Getting NSStirng via method

#### Without rdotm

Localizable.strings:

```
"title_top" = "Demo";
```

Objective-C code:

```
NSString *title = NSLocalizedString(@"title_top", nil);
```

#### With rdotm

strings.xml:

```
<string name="title_top">Demo</string>
```

Objective-C code:

```
NSString *title = [R string_title_top];
```

You don't have to write `@"title_top"` to get localized string any more.
If you misspell, it will cause compile error.

### Getting UIColor via method

#### Without rdotm

Objective-C code:

```
[label setTextColor:[UIColor colorWithRed:0/255.0 green:153/255.0 blue:204/255.0 alpha:153/255.0]];
```

#### With rdotm

colors.xml:

```
<color name="default_text">#990099cc</color>
```

Objective-C code:

```
[label setTextColor:[R color_default_text]];
```

You don't have to use raw ARGB values.

### Getting UImage via method

#### Without rdotm

Objective-C code:

```
UIImage *logo = [UIImage imageNamed:@"logo"];
```

#### With rdotm

Objective-C code:

```
UIImage *logo = [R drawable_logo];
```

You don't have to write `@"logo"` to show `"logo@2x.png"`.
rdotm checks the resource directory when generating the codes,
which means you can not access non-existent images.

## How to install

Please check the latest [README on GitHub](https://github.com/ksoichiro/rdotm).

### Using Homebrew

If you are a OS X user, you can use Homebrew:

```
$ brew tap ksoichiro/rdotm
$ brew install rdotm
```

### Using Go

If you have golang environment,

```
$ go get github.com/ksoichiro/rdotm
```

### Using 'gom'

[gom](https://github.com/mattn/gom) is a great dependency manager for golang.
You can use this to install inside your Xcode app project.
golang is required for this method.

#### Install gom

```
$ go get github.com/mattn/gom
```

#### Create Gomfile

```
$ echo "gom 'github.com/ksoichiro/rdotm'" > Gomfile
```

#### Install dependencies(rdotm)

```
$ gom install
```

## Add rdotm to your build process

You can use rdotm to build process by the following settings.

1. Select your TARGET's 'Build Phase' view
2. Select 'New Run Script Build' above the 'Compile Sources' phase
3. Write some script to use rdotm

If you use gom, the script will be like this:

```
export PATH=_vendor/bin:${PATH}
rdotm \
-res ${SRCROOT}/YOUR_PROJECT/XML_LOCATED_DIR \
-out ${SRCROOT}/YOUR_PROJECT/GENERATED_CODES_DIR \
-clean
```

That's all.
Sorry for my bad English.

If you have any questions, requests, or something
please contact me by comment form or [GitHub issue](https://github.com/ksoichiro/rdotm/issues).

  [1]: https://lh5.googleusercontent.com/-qrrNq3XyigU/U-cc9FNBnBI/AAAAAAAANZM/Xi3R9IdDHlc/s600/demo.gif "demo.gif"
