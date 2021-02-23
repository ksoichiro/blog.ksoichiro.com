---
title: "vim でタスク管理"
originalCreatedAt: 2018-12-31T11:36:00.001+09:00
tags: ["VIM"]
---
これもまた少し前の話になるが、vim スクリプトで簡単なタスク管理用スクリプトを作った。
結果は以下のようなイメージ。

![TODO](/img/2018-12-vim_1.png)
`~/.vimrc`

### 要件

タスク管理のツールは世の中に数え切れないほどあるが、自分の場合は以下のようなことが要件で、ちょうど良いものが見つからなかった。
<!--more-->
- 入力が簡単である (とにかく漏らさないことが大事)
- チーム利用ではなく個人のタスクを管理できれば良い (開発プロジェクトのものではなく、GitLab などに載せるものではない。むしろ載せるとまずいタスクも含む)
- 業務で使いたいため、クラウドサービスではない (ルール上不可)
- 無料
- 運用の手間はかけられない
- タスクを階層化して管理できる
- 検索ができる
- 完了と未完了両方が見える (完了したら消えるのは困る)
- 完了したものの表示はわかりやすくあってほしい
- タスクの説明、補足情報を記入できる
- カテゴリ分け、タグ付け的なことができる

上記の整理をするまで、クラウドサービスを使うとか、OSSをローカルで動かすとか、Webアプリを作ろうかとか色々考えてきたのだが、実際に試したのは Excel でシートを作ったり、テキストファイルに`□■`などステータスを表す記号を付けて管理したり、といったことだった。

チームで扱うなら Web のツールを考えたほうが良さそうだし、分析・フィルタリングなどをするなら Excel などを使うのが良さそうだったが、今一番重要視したいのは入力が簡単、かつ自由に情報を追加できることだったので、意外にもシンプルにテキストで管理することに落ち着いていた。

よく考えると `■` ってキーストロークが多いから `x` にしようとか、そうするとどれが終わったのか一目では見分けがつきにくいな…などと考える中で、これは vim スクリプトで実現するのが一番手軽で確実なのではと思いこれを作ってみた。

### 仕様

おおまかな仕様は以下。

- 拡張子 `todo` で動作する
- 先頭の文字が `x` で完了、`_` で未完了、`-` が中止、`.` が仕掛り
- 完了・中止は色を暗くして目立ちにくくする
- `[タグ]` は色を変えてどのカテゴリのタスクなのかが見やすいようにする
- `[タグ]` は複数書ける
- インデントを下げて別のタスク行を書ける
- タスクの完了/未完了のトグル、完了などいくつかの頻繁に使う操作はショートカットを割り当てる

### 実装

現時点でプラグイン化はしておらず、まだ改善の余地もありそうなので手作業でファイルを用意して利用している。

以下のように `~/.vimrc` に定義していて、 `~/.vim` に各種ファイルを配置すれば読み込んでくれる構成を想定。

```vim
execute 'set runtimepath+=' . $HOME . '/.vim'
```

`~/.vim/syntax/todo.vim` のファイルを以下の内容で作成する。

```vim
syntax region todoTag start=/\[/ end=/\]/
syntax region todoDone start=/^\s*x /ms=e-1 end=/^\s*[_x\-.]/me=s-1

hi link todoTag Constant
if &background == "light"
  hi todoDone ctermfg=darkgray guifg=#999999
else
  hi todoDone ctermfg=darkgray guifg=#666666
endif

set cursorline

command! -nargs=0 TodoToggle call TodoToggle()
function! TodoToggle()
  if !empty(matchstr(getline('.'), '\(\s*\)x '))
    s/\(\s*\)x /\1_ /
  elseif !empty(matchstr(getline('.'), '\(\s*\)_ '))
    s/\(\s*\)_ /\1x /
  endif
endfunction

command! -nargs=0 TodoDone call TodoDone()
function! TodoDone()
  if !empty(matchstr(getline('.'), '\(\s*\)[_\-.] '))
    s/\(\s*\)[_\-.] /\1x /
  endif
endfunction

command! -nargs=0 TodoUndone call TodoUndone()
function! TodoUndone()
  if !empty(matchstr(getline('.'), '\(\s*\)[x\-.] '))
    s/\(\s*\)[x\-.] /\1_ /
  endif
endfunction

map <Leader>tt :TodoToggle<CR><Esc>
map <Leader>td :TodoDone<CR><Esc>
map <Leader>tu :TodoUndone<CR><Esc>

let b:current_syntax = "todo"
```

`~/.vimrc` にて、拡張子 `todo` と紐付ける。

```vim
au BufNewFile,BufRead *.todo setf todo
```

### 利用方法

冒頭のスクリーンショットのように拡張子 `todo` のテキストファイルを vim で開いて利用するだけ。

例えば先頭の文字を `x` にすると色が変わるはず。

Leader がスペースの場合、`スペース t t` で完了・未完了を切り替えられる。
