---
title: "Spring Data ElasticsearchのローカルのノードにHTTPでアクセスする"
originalCreatedAt: 2016-12-31T17:20:00.001+09:00
tags: ["Elasticsearch","Spring Boot"]
---
忘れがちなのでメモ。
Spring Data ElasticsearchのローカルのノードにHTTPでアクセスするには、application.yml に以下を追加すればいい。

```yaml
spring:
    data:
        elasticsearch:
            properties:
                http:
                    enabled: true
```

`http://localhost:9200/` でアクセスできる。
<!--more-->
