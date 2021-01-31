---
description: 長年使っていた Blogger からブログを移行し、VuePress でブログを実装してみることにした。
---
# ブログの移行と VuePress による実装

## 背景

長年使っていた Blogger からブログを移行し、 [VuePress](https://vuepress.vuejs.org/) でブログを実装してみることにした。

Blogger は手軽に使えて良いのだが、何か変えようとうすると独自にトリッキーなカスタマイズを入れなくてはならなかったり、あまり凝ったことはできないため、何度か移行を考えたことがあった。
今回移行に踏み切った主な動機は、英語でもブログを書いてみようと思ったこと。
業務では話すことはないが書くことはたまに発生する。そしてその機会が増えている。
書きたいことを書いてみようとするところからスタートするのが良さそうと思ったため、英語でブログを書いてみようと考えたのだった。

## やりたいこと

今回の動機は以下。

- 英語も書くが、日本語でも書けるようにしておきたい。
- 日本語と英語が混ざらないようにしたい。複数のページを見るときに邪魔になるため。あとは、SEO的にも...？
- `/ja/`, `/en/` のようにパスを分けて提供したい。

## VuePress での生成と Firebase Hosting でのホスティング

今回は記事の生成に VuePress を選び、 Firebase Hosting でホスティングすることにした。

### Firebase Hosting 用のプロジェクトの初期化

firebase-tools を使って作成。

```
❯ firebase -V
9.2.2

❯ firebase init

     ######## #### ########  ######## ########     ###     ######  ########
     ##        ##  ##     ## ##       ##     ##  ##   ##  ##       ##
     ######    ##  ########  ######   ########  #########  ######  ######
     ##        ##  ##    ##  ##       ##     ## ##     ##       ## ##
     ##       #### ##     ## ######## ########  ##     ##  ######  ########

You're about to initialize a Firebase project in this directory:

  /******/blog.ksoichiro.com

? Which Firebase CLI features do you want to set up for this folder? Press Space to select features, then Enter to confirm your choices. Hosting: Configure and deploy Firebase Hosting sites

=== Project Setup

First, let's associate this project directory with a Firebase project.
You can create multiple project aliases by running firebase use --add,
but for now we'll just set up a default project.

? Please select an option: Create a new project
i  If you want to create a project in a Google Cloud organization or folder, please use "firebase projects:create" instead, and return to this command when you've created the project.
? Please specify a unique project id (warning: cannot be modified afterward) [6-30 characters]:
 ******
? What would you like to call your project? (defaults to your project ID) ******
✔ Creating Google Cloud Platform project
✔ Adding Firebase resources to Google Cloud Platform project

🎉🎉🎉 Your Firebase project is ready! 🎉🎉🎉

Project information:
   - Project ID: ******
   - Project Name: ******

Firebase console is available at
https://console.firebase.google.com/project/******/overview
i  Using project ****** (******)

=== Hosting Setup

Your public directory is the folder (relative to your project directory) that
will contain Hosting assets to be uploaded with firebase deploy. If you
have a build process for your assets, use your build's output directory.

? What do you want to use as your public directory? public
? Configure as a single-page app (rewrite all urls to /index.html)? No
? Set up automatic builds and deploys with GitHub? No
✔  Wrote public/404.html
✔  Wrote public/index.html

i  Writing configuration info to firebase.json...
i  Writing project information to .firebaserc...

✔  Firebase initialization complete!
```

## VuePress での構築

公式のガイドを参考に作ってみて、その後自分の要求に合うように設定を変更した。

### 多言語化

サポートされている。
https://vuepress.vuejs.org/guide/i18n.html#site-level-i18n-config

### 一覧表示

こちらを参考にさせていただいて、トップ画面に一覧を追加してみる。
https://techblog.raccoon.ne.jp/archives/1537944919.html

### 改行で br を追加する

`docs/.vuepress/config.js` に以下のような設定を追加する。

```javascript
module.exports = {
  markdown: {
    extendMarkdown: md => {
      md.set({
        breaks: true,
        linkify: true,
      })
    }
  }
}
```

`vuepress dev` で起動している場合は再起動する必要がある。
