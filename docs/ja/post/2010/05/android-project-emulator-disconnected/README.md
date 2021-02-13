---
title: "Android Project - emulator disconnected"
created: 2010-05-08T00:11:00.003+09:00
tags: ["eclipse","Android"]
---
Android Projectを作成して、デフォルトの状態のまま実行してみたのですが、何度実行しても下記のようなメッセージが表示され実行できません。
<!--more-->
```
[2010-05-07 23:55:23 - HelloWorld] Automatic Target Mode: launching new emulator with compatible AVD 'Android\_1\_6\_Device'
[2010-05-07 23:55:23 - HelloWorld] Launching a new emulator with Virtual Device 'Android\_1\_6\_Device'
[2010-05-07 23:55:44 - HelloWorld] New emulator found: emulator-5554
[2010-05-07 23:55:44 - HelloWorld] Waiting for HOME ('android.process.acore') to be launched...
[2010-05-07 23:56:15 - HelloWorld] emulator-5554 disconnected! Cancelling 'com.blogspot.ksoichiro.HelloWorldActivity activity launch'!
```

Eclipseを再起動したところ、何とか起動できました。

[![](http://3.bp.blogspot.com/_rtlYXd55yO0/S-QxK5hRRAI/AAAAAAAAFLM/FfhmxHDhoHg/s320/WS000009.BMP)](http://3.bp.blogspot.com/_rtlYXd55yO0/S-QxK5hRRAI/AAAAAAAAFLM/FfhmxHDhoHg/s1600/WS000009.BMP)

以下はその時のログです。

```
[2010-05-08 00:23:01 - HelloWorld] ------------------------------
[2010-05-08 00:23:01 - HelloWorld] Android Launch!
[2010-05-08 00:23:01 - HelloWorld] adb is running normally.
[2010-05-08 00:23:01 - HelloWorld] Performing com.blogspot.ksoichiro.HelloWorldActivity activity launch
[2010-05-08 00:23:01 - HelloWorld] Automatic Target Mode: launching new emulator with compatible AVD 'Android\_1\_6\_Device'
[2010-05-08 00:23:01 - HelloWorld] Launching a new emulator with Virtual Device 'Android\_1\_6\_Device'
[2010-05-08 00:23:10 - HelloWorld] New emulator found: emulator-5554
[2010-05-08 00:23:10 - HelloWorld] Waiting for HOME ('android.process.acore') to be launched...
[2010-05-08 00:24:12 - HelloWorld] WARNING: Application does not specify an API level requirement!
[2010-05-08 00:24:12 - HelloWorld] Device API version is 4 (Android 1.6)
[2010-05-08 00:24:12 - HelloWorld] HOME is up on device 'emulator-5554'
[2010-05-08 00:24:12 - HelloWorld] Uploading HelloWorld.apk onto device 'emulator-5554'
[2010-05-08 00:24:12 - HelloWorld] Installing HelloWorld.apk...
[2010-05-08 00:24:49 - HelloWorld] Success!
[2010-05-08 00:24:49 - HelloWorld] Starting activity com.blogspot.ksoichiro.HelloWorldActivity on device
[2010-05-08 00:25:17 - HelloWorld] ActivityManager: Starting: Intent { act=android.intent.action.MAIN cat=[android.intent.category.LAUNCHER] cmp=com.blogspot.ksoichiro/.HelloWorldActivity }
```

起動はしたものの、警告が出ています。また別の問題がありそうです。
