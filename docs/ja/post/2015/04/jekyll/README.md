---
title: "Jekyllでチュートリアルを作る"
created: 2015-04-12T14:18:00.001+09:00
tags: ["Jekyll","GitHub"]
---
チュートリアルサイトを作りたいと考えたが、
コンテンツはMarkdownで書きたい。
そうするとGitHub PagesとJekyllが楽かな、と考えた。
おまけ的にGithubプロジェクトの紹介ページを作ってみたことはあったが、今回の場合それがメインのコンテンツになる。
GitHubのリポジトリで静的なサイトを作る場合にどうしたら良いのか（ただしブログ ではない）という点で調べたり試行錯誤したことをまとめてみる。
<!--more-->

### ブランチはどうする？

ユーザのページを作るにはユーザ名.github.ioというリポジトリを作るとか、
プロジェクトのページはgh-pagesブランチにすれば良いというのは分かっていたが、今回の場合はGitHub Pagesしか必要ないプロジェクトなので、リポジトリのページにアクセスした時はGitHub Pagesの内容が表示されるようにしたかった。

masterブランチをpushしたときにJekyllでGitHub Pagesを生成してくれれば良いのだが…と思っていたが、これは単にGitHubのリポジトリ設定画面でgh-pagesをDefault branchとして設定すればOKだった。

### どうやって始める？

これは、ここであまり詳しく書いても仕方ないが少しだけ。

1. Rubyをインストール
1. gemをインストール
1. Jekyllをインストール(`gem install jekyll`)
1. プロジェクトを作成(`jekyll new projectname`)
1. プロジェクトに移動(`cd projectname`)し起動、起動(`jekyll serve`)
1. `http://localhost:4000/`にアクセスして動作確認

基本的にはこれだけでOK。
あとはコンテンツをMarkdownで編集したり、レイアウトのHTMLを修正したりすればいい。
公開するには、これをコミットしてGitHubのgh-pagesブランチにpushするだけ。

### READMEは含まれる？

チュートリアルサイトなので、GitHubのリポジトリのページはあまり意味がないが、やはりREADMEは置いておき、手元でコンテンツを修正・確認する方法やライセンスなどを書いておきたいところ。
内容に間違いがあればPull requestを送ってもらえるようにしておきたいというのもある。

そこで、README.mdを置くとサイト上でアクセス可能になってしまうんだろうか？というのが気になった。
見えても問題ないといえばないが、Markdownのコンテンツがそのまま表示されたりすると困る。
何かの設定ファイルで除外するファイルを定義する必要があるのか？と思ったが、特に気にすることはなかった。

[GitHub Pagesの説明にあるように](https://help.github.com/articles/using-jekyll-with-pages/#frontmatter-is-required)、コンテンツには、Jekyllで用意されている[Front-matter](http://jekyllrb-ja.github.io/docs/frontmatter/)が必要とのこと。
これが書かれていないMarkdownファイルは無視される模様。
実際に無視されているのかどうかは、ビルドされたファイルの出力先(`_site`フォルダ)を見ればわかる。

### 静的なページはどこに格納？

`_posts`がブログのコンテンツのようだったので、同じように`_chapters`というフォルダを作ってみたが、何も生成されなかった。
静的なコンテンツを置くには、単純に`chapters`で良かった。
普通は、アンダースコア(`_`)で始まるフォルダは無視されてしまう模様。
(`_posts`は特別なフォルダだった。)

ディレクトリ構造については以下で説明されている。
http://jekyllrb.com/docs/structure/

### ローカルでもGitHub Pagesでもリンクを有効にするには？

ローカルで動作確認すると、`http://localhost:4000`というURLで起動するが、ここで動くように書くとルートから指定するようになってしまう。
（`/index.html`など）
実際にはGitHubのプロジェクト名が間に入るため、`/project/index.html`というパスになり、リンク切れ状態になってしまう。
これを解決するには、`{{ site.github.url }}`を使えば良い。
例えば以下のような形。

* `{{ site.github.url }}/`
* `{{ site.github.url }}/css/syntax.css`

### ハイライトはできる？

`jekyll new`で生成したプロジェクトでは、サンプルのブログエントリMarkdownに以下のようなコードが書かれていた。

```ruby
{% highlight ruby %}
 def print_hi(name)
   puts "Hi, #{name}"
 end
 print_hi('Tom')
 #=> prints 'Hi, Tom' to STDOUT.
{% endhighlight %}
```

気になったのは、ソースコードのハイライトをするときに

```
 ```ruby
 ```
```

のような書き方が使えないのか？ということ。
結果的には問題なく使えたので一安心。
こっちの方が簡潔で断然良いと思うんだけど、なぜわざわざRuby風なコードでサンプルを書いているんだろうなぁ…

### 変更を監視するには？

```
jekyll serve -w
```

で起動すればOK。
