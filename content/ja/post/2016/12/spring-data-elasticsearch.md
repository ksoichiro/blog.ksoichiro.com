---
title: "Spring Data Elasticsearchが実行するクエリを確認する"
createdAt: 2016-12-31T17:23:00.001+09:00
tags: ["Elasticsearch","Spring Boot"]
---
Spring Data ElasticsearchのElasticsearchTemplateなどを使って最終的に実行されたクエリを確認するには以下を application.yml に設定すれば良い。

```yaml
spring:
    data:
        elasticsearch:
            properties:
                index:
                    search:
                        slowlog:
                            threshold:
                                query:
                                    info: "0s"
```
