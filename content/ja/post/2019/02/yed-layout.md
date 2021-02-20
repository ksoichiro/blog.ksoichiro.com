---
title: "yEdでジョブフロー図っぽいものを描く: Layout"
createdAt: 2019-02-19T00:23:00.001+09:00
tags: ["yEd"]
---
[yEd](https://www.yworks.com/products/yed) でどこまで描けるか？本当に良いかを確認するためいくつか図を描いてみる。以下の続編。
[yEdでジョブフロー図っぽいものを描く: Edge Routing](/ja/post/2019/02/yed-edge-routing/)

## ベースとなる図

前回同様に以下をいじってみる。

![](https://lh3.googleusercontent.com/wd-NNWr9nHpDcs4xsPfaiTXjuK5HIpYGXzj1-g4zIxAYIbulZDbTI41uKufhN1zxmYG-CnjDV2Jh5g=s0)

レイアウトといいながらEdge Routingから入ってしまったが、今回はメニューのLayout直下の項目を試す。
<!--more-->
### Hierarchical

階層構造。フローチャートに向いているかも。

![](https://lh3.googleusercontent.com/Q9eAeZstc595ksyGyrGt4JM9GDi-4SEXqGu4gqzKveKOyl6hHP1oMFziZpmDaEv4hifiA6opP_m9DA=s0)

### Organic

実行するたびに微妙に変わる。

![](https://lh3.googleusercontent.com/QXaHxVT_VA2U-sFZBU4RpZUfqchxdDKgiGr66LvLcB8yVpMG9efLm580oW6-FiLEk6IWTG3VaUrwnQ=s0)

### Orthogonal > Classic

![](https://lh3.googleusercontent.com/egic4Vtgfyz9KIKntKXdht5dQyRUTO2nre8COvekvchR94OBjasz77EtymwhFjwKGaEvoffCEONNzQ=s0)

### Orthogonal > UML Style

![](https://lh3.googleusercontent.com/IPAfx75Q3bp-crrDooqEyYWUlqgEvazrL92bQX2cm7duEYFLnGQeTNzFHzFV-9Sonaog3PIhTEOTtw=s0)

### Orthogonal > Compact

コンパクトすぎる？

![](https://lh3.googleusercontent.com/RzgXXnGecYNaxfATnELLPQXl6vwPpheccjwSmHQ8D1KlTbhg6jeFdpGVezi35LgQdWWfwc-qO0qiTg=s0)

### Orthogonal > Circular

放射状な配置。

![](https://lh3.googleusercontent.com/MQdEiyF3tlwcRQD4Y-1Yl_VTzSd2I2bm55qR9NAoQ_jjGldGtKjZoh1VVV82RsiG2-jT4odzpPALiw=s0)

### Tree > Directed

Hierarchicalと似ている。

![](https://lh3.googleusercontent.com/j7XoZIFDdEI7DlnFWSfynsOsGdLCTYelHMYCGD19ijOoAyVqowDfJ4G6lNXwXZT6TaVJNBkSOH8npg=s0)

Tree＞Directedの設定画面でDirectedタブを開き、OrientationをBottom To Topにすると以下のようになる。

![](https://lh3.googleusercontent.com/O_diEuwpQ7C7CR-D1rIvrtHeK-od1nyGUMdAwdcQszaszKvvaC7fbw1CDKy4zJTpP_UX2muXwenCvg=s0)

OrientationをRight To Leftにすると以下。

![](https://lh3.googleusercontent.com/kcaCpeO_S-ekYZ3e5HcIoKmEhGfxwKRWnhvXL87k_JZKq3XlN-J1eBMe7XXnb51nia_XOEQsnZm_Cg=s0)

### Tree > Balloon

Organicと違って何度やっても同じ配置。

![](https://lh3.googleusercontent.com/W-17koIjGi5Ukll11fsWWSV5UN9FSk6zkuum2yA-b91NlDVMENhRnA5bw4Fp89prL2rV1WxzlUofig=s0)

### Radial

こちらが本当の放射状らしい。

![](https://lh3.googleusercontent.com/dAoQvI0o2Kl5G0Lef1gizk_LksXWkVLrMmL3Rfy2HWATpTiE2XsAiRM5WJLzyVkxxfSsfzdoPSAgeQ=s0)

### Series Parallel

トーナメント表っぽい配置。

![](https://lh3.googleusercontent.com/KpdHSx5U8iPrsxLwrLTuc4xR5Fqpo-KmxALPFpWBWPEfPiWofBKQAWEMAe4NYWzt_jjTY0QTa5LD2w=s0)

パラメータを変えるとさらにいろいろできそうだが、今回はここまで。
