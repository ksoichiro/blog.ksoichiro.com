---
title: "ghq rootが複数あると最後のrootにcloneされるようになった"
created: 2020-01-17T00:58:00.002+09:00
tags: ["ghq"]
---
最初のrootが使われると思っていたが、最後(2つめ)が使われた。

調べてみると以下の issue があり、v0.17から挙動が変更されていた。当初意図したものではなかったようだが、今後この仕様になるとのこと。

[https://github.com/motemen/ghq/issues/239](https://github.com/motemen/ghq/issues/239)

README には最初の root に clone されると説明されていたので、修正の pull request を送ったところすぐに修正を取り込んでいただけた。

というわけで、README の説明の通り `ghq.root` が複数定義されている場合は最後のものが clone に使われるので、`ghq list` に Go の `GOPATH` のような固有のパスを含めたい場合は `ghq get` で使ってほしいパスを最後に書くと良い。
