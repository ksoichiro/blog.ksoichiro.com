---
title: Migrating blog to nuxt/content - 1. migration of old posts
tags: ["Blogger", "VuePress", "nuxt/content"]
---
I've been migrating my blog from Blogger as written in [Migrating my blog and implementing with VuePress](/post/2021/01/migrating-blog/).
There had been no problem for writing new posts, but when it comes to migrate old posts, I had an issue, and eventually I switched from VuePress to [nuxt/content](https://content.nuxtjs.org/).
Why do I keep changing my blog for a long time, though I don't have much passion for studying frontend? I don’t even know the answer.
But I could have migrated it finally, so I'd like to look back.
<!--more-->
## Download and edit Blogger posts

Actual contents might be still in StackEdit, but some posts are lost due to the updates of StackEdit, or I've been writing old posts on Blogger directly, so I decided to create Markdown posts based on the HTML contents on Blogger.

Blogger posts [can be downloaded with XML format as a backup](https://support.google.com/blogger/answer/41387).

I excpected that I could download a big XML file and it could be manipulated by using [xmllint](http://xmlsoft.org/xmllint.html), but it didn't work. I couldn't fix garbled characters.
Even if I could make it work fortunately, I should also have to add frontmatter and make directory structure based on creation dates, which must be hard to handle only by CLI. Therefore I wrote a small tool by Golang.

I could create directories and wrote `README.md`, but as I thought it was difficult to format contents.
If it is output as is, many errors are caused around `<pre>` tags and the post couldn't be shown.
Eventually, I used [html-to-markdown](https://github.com/JohannesKaufmann/html-to-markdown) to convert posts.
With this tool I converted HTML to Markdown, but this also had an issue around code blocks, which made all newlines lost and became 1 line.

I couldn't make code blocks converted nicely either way, so finally I converted posts with `html-to-markdown` and checked all posts one by one, and if I saw a wierd part I copied the original code from Blogger editor screen.

```go
package main

import (
	"encoding/xml"
	"flag"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
	"time"

	md "github.com/JohannesKaufmann/html-to-markdown"
)

var (
	converter *md.Converter
)

func init() {
	converter = md.NewConverter("", true, nil)
}


type Feed struct {
	XMLName	 xml.Name `xml:"feed"`
	EntryList []Entry	`xml:"entry"`
}

type Entry struct {
	XMLName			xml.Name	 `xml:"entry"`
	Title				string		 `xml:"title"`
	Published		string		 `xml:"published"`
	CategoryList []Category `xml:"category"`
	Content			string		 `xml:"content"`
	LinkList		 []Link		 `xml:"link"`
}

type Category struct {
	Scheme string `xml:"scheme,attr"`
	Term	 string `xml:"term,attr"`
}

type Link struct {
	Rel string `xml:"rel,attr"`
	Href string `xml:"href,attr"`
}

func main() {
	var filename string
	flag.StringVar(&filename, "f", "", "target file name")
	flag.Parse()
	file, err := os.Open(filename)
	if err != nil {
		panic(err)
	}
	defer file.Close()
	data, err := ioutil.ReadAll(file)
	if err != nil {
		panic(err)
	}
	feed := Feed{}
	err = xml.Unmarshal(data, &feed)
	if err != nil {
		panic(err)
	}

	for _, v := range feed.EntryList {
		if !v.IsPost() {
			continue
		}

		convert(&v)
	}
}

func (e *Entry) IsPost() bool {
	for _, c := range e.CategoryList {
		if c.Scheme == "http://schemas.google.com/g/2005#kind" &&
			c.Term == "http://schemas.google.com/blogger/2008/kind#post" {
			return true
		}
	}
	return false
}

func (e *Entry) GetPagePath() string {
	for _, l := range e.LinkList {
		if l.Rel == "alternate" {
			arr := strings.Split(l.Href, "/")
			file := arr[len(arr) - 1]
			ext := filepath.Ext(file)
			return file[0:len(file)-len(ext)]
		}
	}
	panic("valid link not found")
}

func (e *Entry) GetTags() string {
	var tags []string
	for _, c := range e.CategoryList {
		if c.Scheme == "http://www.blogger.com/atom/ns#" {
			tags = append(tags, fmt.Sprintf("\"%s\"", c.Term))
		}
	}
	return strings.Join(tags, ",")
}

func (e *Entry) GetContent() string {
	markdown, err := converter.ConvertString(e.Content)
	if err != nil {
		return e.Content
	}
	return markdown
}

func convert(v *Entry) {
	t, _ := time.Parse("2006-01-02T15:04:05.000-07:00", v.Published)
	y := t.Local().Year()
	m := t.Local().Month()
	pathJa := fmt.Sprintf("../../docs/ja/post/%04d/%02d/%s", y, m, v.GetPagePath())
	os.MkdirAll(pathJa, os.ModePerm)

	content := fmt.Sprintf(`---
title: "%s"
created: %s
tags: [%s]
---
%s
`,
		v.Title,
		v.Published,
		v.GetTags(),
		v.GetContent(),
	)

	readmePath := fmt.Sprintf("%s/README.md", pathJa)
	ioutil.WriteFile(readmePath, []byte(content), 0644)
}
```

Saved this code to a file like `tools/converter/main.go`, and also located the downloaded XML file as `blogger.xml` in the same directory.

Then defined a command like below in the `package.json`

```json
    "scripts": {
        "blogger:convert": "cd tools/converter; go run main.go -f blogger.xml"
    },
```

and convert posts by running `npm run blogger:convert`.

With this, I could get Markdown files like `docs/ja/post/2010/05/android-project-path/README.md` (these files are still for VuePress).

In addition to that, I manually did the following works steadily.

- Replace links toward my blog with relative paths
- Format lines which lost newlines
- Delete redundant newlines

At last I finished this updates and run build (not in dev mode), saw an error in notations like `{{ site.github.url }}`.

It also occurred in `th:text="${{entity.status}}"`. I thought I managed to avoid this by replacing `{{` to `{\{`...but with this modification the raw text is shown. `${{variable}}` notation didn't work neither. Once again I tried to run it on dev mode and there were certainly errors in that page.

[vuepressのテンプレート内で二重波括弧をエスケープ](https://tips.weseek.co.jp/%E9%96%8B%E7%99%BA%E6%97%A5%E8%A8%98/vuepress%E3%81%AE%E3%83%86%E3%83%B3%E3%83%97%E3%83%AC%E3%83%BC%E3%83%88%E5%86%85%E3%81%A7%E4%BA%8C%E9%87%8D%E6%B3%A2%E6%8B%AC%E5%BC%A7%E3%82%92%E3%82%A8%E3%82%B9%E3%82%B1%E3%83%BC%E3%83%97)
This was the solution.
It seems that inline code should be escaped by using `<code v-pre>`.

Continues to [Migrating blog to nuxt/content - 2. generate description automatically](/post/2021/03/migrate-blog-to-nuxt-content2).
