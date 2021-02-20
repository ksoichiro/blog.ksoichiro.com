---
title: "Android SonyTablet SをMacのadbで認識させる"
originalCreatedAt: 2012-01-07T22:35:00.000+09:00
tags: ["SonyTablet","Android"]
---
SonyTablet Sを、Windowsでは接続できましたがMacで接続できず試行錯誤していましたが、
SONYのサイトに説明がありました。
[http://www.sony.jp/support/tablet/products/info/sdk.html](http://www.sony.jp/support/tablet/products/info/sdk.html)
<!--more-->
単純に接続しただけでは以下のようになり、adbで認識されません。

```sh
% adb devices
List of devices attached 

%
```

上記サイトの説明のようにすると、下記の通りadbでデバイスを認識するようになります。

```sh
% echo "0x54c" >> $HOME/.android/adb_usb.ini
% adb kill-server
% adb start-server
* daemon not running. starting it now on port 5037 *
* daemon started successfully *
% adb devices
List of devices attached 
4289142435fa597 device

%
```
