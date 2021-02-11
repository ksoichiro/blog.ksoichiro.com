---
title: "Spring Data ElasticsearchのローカルのノードにHTTPでアクセスする"
created: 2016-12-31T17:20:00.001+09:00
tags: ["Elasticsearch","Spring Boot"]
---
忘れがちなのでメモ。
Spring Data ElasticsearchのローカルのノードにHTTPでアクセスするには、application.yml に以下を追加すればいい。

```
spring:
    data:
        elasticsearch:
            properties:
                http:
                    enabled: true
```

`http://localhost:9200/` でアクセスできる。