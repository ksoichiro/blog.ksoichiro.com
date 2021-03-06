---
title: ブログを nuxt/content に移行 - 1. 旧記事の移行
tags: ["Blogger", "VuePress", "nuxt/content"]
---
[ブログの移行と VuePress による実装](/ja/post/2021/01/migrating-blog/)で Blogger からの移行をしていた。
新しい記事をそちらで書くのには問題がなかったものの、過去の記事を移行してみると問題が出てきて、結果として VuePress から [nuxt/content](https://content.nuxtjs.org/ja/) に変更した。
特別に frontend 周りを研究したいわけでもないのにいつまでブログを弄っているのかと自分でも思ってしまうが、ようやく移行できたので振り返ってみたい。
最終的に nuxt/content にしたものの、一覧表示の仕方にこだわらなければ Blogger から VuePress に移行するのも問題はないと思うので、VuePress へ移行した過程も含めて書いておく。
<!--more-->
## Blogger 投稿のダウンロードと加工

実際のコンテンツは StackEdit にも残っているはずなのだが、StackEdit が途中でバージョンアップしていて引き継げていなかったり、古いものは直接 Blogger で編集しているので、Blogger の記事をベースに編集することにした。

Blogger の投稿は、[バックアップとして XML 形式でダウンロードできる](https://support.google.com/blogger/answer/41387?hl=ja)。

これで巨大な XML をダウンロードして、[xmllint](http://xmlsoft.org/xmllint.html) で抽出・加工すれば良いと思ったのだが、うまく動作しない。文字化けが直せない。
仮に動作したとしても、frontmatter を追加したり日付を元にしたディレクトリ構成を作ったりと、コマンドでは面倒な内容も必要になりそうだったので、Go で簡単なツールを書くことにした。

ディレクトリを作って `README.md` を出力するところまではうまくいったが、コンテンツの整形はやはり難しい。
そのまま出力すると `<pre>` タグあたりでエラーが大量に出てしまい表示できない。
最終的に [html-to-markdown](https://github.com/JohannesKaufmann/html-to-markdown) で変換した。
HTML を Markdown に変換するようにしたが、これもコードブロック部分に問題があり、コード中の改行がすべてなくなり1行になってしまうような状態だった。

どちらを選んでもコードブロックがうまく処理できないので、結局、HTML to Markdown で変換した上で1記事ずつチェックし、おかしい場合は元の Blogger の編集画面または表示結果をコピーしていくことにした。

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

これを `tools/converter/main.go` のようなファイルに保存し、同じディレクトリに `blogger.xml` としてダウンロードしたファイルを置く。

package.json に 以下のようなコマンドを定義し

```json
    "scripts": {
        "blogger:convert": "cd tools/converter; go run main.go -f blogger.xml"
    },
```

`npm run blogger:convert` で変換する。

これで `docs/ja/post/2010/05/android-project-build-path/README.md` のようなパスで Markdown ファイルの投稿が出力される (これはまだ VuePress 向けの内容)。

その上で、以下のような地道な修正を手作業で進めていった。

- ブログ内のリンクをドメイン以下の相対パスに置き換える
- 改行が消えてくっついてしまっているものを整形
- 無駄に入っていた改行を削除

ようやく修正が終わり、devモードでなくビルドしてみると、`{{ site.github.url }}` のような記述がエラーになる。

`th:text="${{entity.status}}"` も。 `{{` を `{\{` にして回避。...と思ったがこれだとそのまま文字が出てしまう。`${{variable}}` もダメ。改めてそのページをdevモードで動かすとエラーになった。

[vuepressのテンプレート内で二重波括弧をエスケープ](https://tips.weseek.co.jp/%E9%96%8B%E7%99%BA%E6%97%A5%E8%A8%98/vuepress%E3%81%AE%E3%83%86%E3%83%B3%E3%83%97%E3%83%AC%E3%83%BC%E3%83%88%E5%86%85%E3%81%A7%E4%BA%8C%E9%87%8D%E6%B3%A2%E6%8B%AC%E5%BC%A7%E3%82%92%E3%82%A8%E3%82%B9%E3%82%B1%E3%83%BC%E3%83%97)
これだった。
`<code v-pre>` でエスケープする必要があるらしい。

[ブログを nuxt/content に移行 - 2. description の自動生成](/ja/post/2021/03/migrate-blog-to-nuxt-content2/) に続く。
