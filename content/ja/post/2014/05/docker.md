---
title: "[Docker] &lt;none&gt;のimageを一括削除"
originalCreatedAt: 2014-05-02T21:04:00.001+09:00
tags: ["Docker"]
---
Dockerでいろいろ試していたら、いつの間にかREPOSITORY, TAGが "&lt;none&gt;"のimageばかりに。。。
名前のついていないイメージを削除する方法：

```
docker rmi $(docker images | grep "" | awk '{ print $3 }')
```

Containerを削除する方法：

```
docker rm $(docker ps -a -q)
```
