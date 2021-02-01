---
title: Migrating my blog and implementing with VuePress
description: I decided to migrate my blog from Blogger, and implemented with VuePress.
date: 2021-01-31
tags: ["VuePress"]
---
## Background

I decided to migrate my blog from Blogger, and implemented with [VuePress](https://vuepress.vuejs.org/).

I've been using Blogger for a long time since it's very easy to use, but at the same time, there were some difficulties when I wanted to customize something or do some elaborate things.
So actually I considered migrating my blog several times.
The main reason to this descision is that I wanted to write my blog in English.
In my work, I don't have to speak English so far (though there are chances to do so if I want to try), but sometimes I have to write something in English, and such scenes are increasing day by day.
I thought it's good for me to start writing something I want to write, and got an idea to write my blog in English.

## What I want to do

My motivations are:

- I'd like to write in English, but also I'd like to keep an option to write in Japanece.
- I don't want to mix Japanese and English because it might disturb the readers. And maybe it's not good in SEO point of view...?
- I'd like to provde posts with separated paths like `/ja/` and `/en/`.

## Generating site with VuePress and hosting using Firebase Hosting

I chose VuePress to generate static site, and Firebase Hosting to host my site.

## Initialize project for Firebase Hosting

I've initialized the Firebase project using firebase-tools.

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

## Building site with VuePress

I started with the official guide, and configured for my requirements.

### i18n

It's supported by VuePress.
https://vuepress.vuejs.org/guide/i18n.html#site-level-i18n-config

### Listing posts

Thanks to this article, I could add a list of posts on top page.
https://techblog.raccoon.ne.jp/archives/1537944919.html

### Breaks with newline

Adding following config in `docs/.vuepress/config.js`.

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

Note that this requires restart when you're using `vuepress dev`.
