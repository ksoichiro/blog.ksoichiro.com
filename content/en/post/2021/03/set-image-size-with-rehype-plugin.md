---
title: "Set image size with rehype plugin"
tags: ["rehype", "nuxt/content", "Lighthouse"]
---
There is an audit item named `Image elements have explicit width and height` in Lighthouse.
Its detail is described in [Images without dimensions](https://web.dev/optimize-cls/#images-without-dimensions), which says that setting `width` and `height` attributes to `<img>` tag improves CLS (Cumulative Layout Shift).

However, in nuxt/content, it seemed that they are not set automatically when the images are specified with `![](URL)` notation. So I created a [rehype](https://github.com/rehypejs/rehype) plugin named [rehype-img-size](https://github.com/ksoichiro/rehype-img-size) and let it set image size attributes automatically by reading files.
<!--more-->
## How does this plugin resolve this issue?

We can access local file system if we build pages with SSG as prerequisites, so it's possible to read image file size from `src` attribute of `<img>` tag and set `width` and `height` attributes by manipulating HTML which is converted from Markdown with `rehype`.

In addition, if you write CSS like below, even the large files won't overflow, so you can easily handle this issue without checking size of every files or rewriting them as `<img width="..>"`.

```css
p img {
  max-width: 100%;
  height: 100%;
}
```

## Usage of the plugin

First, you must install the plugin as described in the README of rehype-img-size plugin.

```
npm install rehype-img-size
```

For example, there is a Markdown file

```markdown
![](img.png)
```

and `example.js` as follows:

```js
const unified = require('unified')
const parse = require('remark-parse')
const remark2rehype = require('remark-rehype')
const stringify = require('rehype-stringify')
const vfile = require('to-vfile')
const rehypeImgSize = require('rehype-img-size')

unified()
  .use(parse)
  .use(remark2rehype)
  .use(rehypeImgSize)
  .use(stringify)
  .process(vfile.readSync('index.md'), function(err, file) {
    if (err) throw err
    console.log(file.contents)
  })
```

If you run `node example`, then `width` and `height` attributes will be added to the `<img>` tag.

```html
<p><img src="img.png" alt="" width="640" height="480"></p>
```

This is the usage as a rehype plugin. When you use it with nuxt/content, you just have to add a config to `content.markdown.rehypePlugin` in `nuxt.config.js`.

```js
export default {
  content: {
    markdown: {
      rehypePlugins: [
        [ 'rehype-img-size', { dir: 'static' } ]
      ]
    }
  }
}
```

On nuxt/content, `static` directory is the location for static files by default, so if the published image paths are written in Markdown files in `content` directory which the Markdown files are located, the plugin cannot open the files because the plugin doesn't know `static` directory.
That's why the configuration above has the option `dir` to specify the location of static files.

With this configuration, an image file specified by `![](/image.png)` in Markdown can be recognized as `./static/image.png` by the plugin.

## How did I make this plugin?

Maybe it is easy for you to imagine that remark or rehype can be used because it's explained in the very beginning of the nuxt/content document such as [Writing content](https://content.nuxtjs.org/writing).

I tried to find an appropriate plugin from [the list of rehype plugin](https://github.com/rehypejs/rehype/blob/main/doc/plugins.md), but couldn't find it. [rehype-resolution](https://github.com/michaelnisi/rehype-resolution) seemed to be very close to what I was looking for, but this is a tool to set `srcset` attribute and didn't match to my requirement.

There is a `Create plugin` section in the bottom of this page, and the linked article [Creating a plugin with unified](https://unifiedjs.com/learn/guide/create-a-plugin/) might help you understand how to create a plugin. I thought I must learn lots of API first, but it was not true. Basically all I have to do is to receive the AST and write what I want to do with it. This AST is an HTML syntax tree called [hast](https://github.com/syntax-tree/hast), and by using `unist-util-visit` for [unist](https://github.com/syntax-tree/unist) that is more abstract concept than hast, you can start writing some process against a node with less code.

```js
const visit = require('unist-util-visit')

module.exports = attacher

function attacher(options) {
  function transformer(tree, file) {
    visit(tree, 'element', visitor)

    function visitor(node) {
      // some process with node
    }
  }
}
```
