---
title: "Heroku + Node.js + Express + Mongoose"
created: 2012-10-27T01:00:00.000+09:00
tags: ["Mongoose","MongoDB","Heroku","Node.js","MongoHQ","Express"]
---
Heroku + Node.js + Express + Mongoose で、とあるアプリケーションを作成しているのですが、Heroku上ではどのバージョンの組み合わせが動くのか分からず嵌ってしまいました。 以下は、現時点(2012/10/26)で動作したpackage.jsonの内容です。 誰かの参考になれば幸いです。
<!--more-->
```json
{
  "name": "hoge",
  "version": "0.0.1",
  "private": true,
  "dependencies": {
    "express": "3.0.0",
    "mongoose": "1.7.4",
    "jade": "*"
  },
  "engines": {
    "npm": "1.1.41",
    "node": "0.6.13"
  }
}
```
