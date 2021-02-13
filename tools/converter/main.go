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
	// reH2 *regexp.Regexp
	// reH3 *regexp.Regexp
	// reH4 *regexp.Regexp
	// reP *regexp.Regexp
	// rePre *regexp.Regexp
	// reOl *regexp.Regexp
	// reBr *regexp.Regexp
	converter *md.Converter
)

func init() {
 	// reH2 = regexp.MustCompile("<h2(?: .+?)?>(.*?)</h2>")
 	// reH3 = regexp.MustCompile("<h3(?: .+?)?>(.*?)</h3>")
 	// reH4 = regexp.MustCompile("<h4(?: .+?)?>(.*?)</h4>")
 	// reP = regexp.MustCompile(" *<p(?: .+?)?>(.*?)</p>")
	// // Trim spaces
 	// rePre = regexp.MustCompile(" *(<pre(?: .+?)?>.*?</pre>)")
 	// reOl = regexp.MustCompile(" *(<ol(?: .+?)?>.*?</ol>)")
	// // Newline
 	// reBr = regexp.MustCompile(" *<br */?>")

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
	// c := e.Content
	// c = reH2.ReplaceAllString(c, "\n\n## $1\n\n")
	// c = reH3.ReplaceAllString(c, "\n\n### $1\n\n")
	// c = reH4.ReplaceAllString(c, "\n\n#### $1\n\n")
	// c = reP.ReplaceAllString(c, "\n$1\n")
	// c = rePre.ReplaceAllString(c, "$1")
	// c = reOl.ReplaceAllString(c, "$1")
	// c = reBr.ReplaceAllString(c, "\n")
	// Remove redundant new lines
	// c = strings.ReplaceAll(c, "\n\n\n", "\n\n")
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
