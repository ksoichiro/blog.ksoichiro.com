---
title: "[Android] Galaxy Nexus でのDB書き込みエラー"
created: 2013-09-15T17:13:00.000+09:00
tags: ["CWM","Galaxy Nexus","root","Android"]
---
Galaxy NexusをAndroid 4.3のroot化済みで使っています。
Android 4.3にアップデートした後、Evernoteでノートが作れませんでした。
Dropboxでファイルがダウンロードできません。
QuickPicでサムネイルが作れません。
<!--more-->
アンインストールして再インストールしても解消しないことから、
どうやらSDカード配下のファイルがおかしいかもしれないと思い確認したところSDカード以下の該当アプリのディレクトリを削除することすらできませんでした。
(もちろんsuしています。)
そこで、[http://coosee.blog.fc2.com/blog-entry-8.html](http://coosee.blog.fc2.com/blog-entry-8.html)でヒントを得て、CWMを使えるようにした上で

```
adb recovery
adb shell
# cd /data/media/0/Android/data
# ls -l
```

と実行してみると、OSアップデート前のデータのアクセス権がおかしなことになっていました。
所有者がroot:sdcard\_rとなっているディレクトリがあります。

```
/data/media/0/Android/data # ls -l
drwxrwxr-x    3 media\_rw media\_rw      4096 Dec  6  2012 com.adcyclic
drwxrwxr-x    3 root     sdcard\_r      4096 Jul 27 01:04 com.adobe.reader
drwxrwxr-x    2 root     sdcard\_r      4096 Jul 27 00:56 com.alensw.PicFolder
drwxrwxr-x    3 media\_rw media\_rw      4096 Aug 10 10:13 com.alphonso.pulse
drwxrwxr-x    3 root     sdcard\_r      4096 Jul 27 01:02 com.android.chrome
drwxrwxr-x    3 media\_rw media\_rw      4096 Oct  6  2012 com.android.providers.media
drwxrwxr-x    2 root     sdcard\_r      4096 Jul 26 23:13 com.box.android
drwxrwxr-x    3 media\_rw media\_rw      4096 Dec  8  2012 com.chartboost.sdk
drwxrwxr-x    3 media\_rw media\_rw      4096 Aug 30 10:55 com.deploygate
drwxrwxr-x    3 root     sdcard\_r      4096 Jul 27 01:01 com.dropbox.android
drwxrwxr-x    7 root     sdcard\_r      4096 Jul 27 01:00 com.estrongs.android.pop
drwxrwxr-x    3 root     sdcard\_r      4096 Jul 27 01:00 com.evernote
:
```

じゃあアクセス権を修正すれば良い？ということで、同じディレクトリで

```
chown -R media\_rw:media\_rw \*
```

としたところ解決しました。
OSアップデート手順に何か間違いがあったんでしょうね。。。
解決の参考になったブログの方には感謝です。
