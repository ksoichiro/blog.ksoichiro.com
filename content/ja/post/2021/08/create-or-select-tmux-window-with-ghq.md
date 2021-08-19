---
title: ghq で tmux window を作成または選択する
tags: ["tmux", "zsh", "ghq"]
---
複数のプロジェクトを頻繁に行き来して作業する場合。
VSCode であれば [vscode-ghq](https://marketplace.visualstudio.com/items?itemName=marchrock.vscode-ghq) を使って切り替えるだけで事足りるのだが、terminal の作業が必要な場合に VSCode の terminal ではなく iTerm2 などの terminal で作業したいと思う。
VSCode と似たことをやりたいのだが、VSCode での場合と違って以下のような操作をしていた。

1. (記憶で)既存のwindowに該当リポジトリがないか探す
2. すでに開いていればそこに移動
3. なければ prefix + c で window 作成し ghq で移動

これを以下のように 1 コマンドでできるようにする方法を説明する。

1. 任意の window から ghq でリポジトリの一覧を表示する
2. 選択したリポジトリにいる window を探す
3. すでに開いている window があればその window に移動する
4. すでに開いている window がなければ新しく window を作成して移動し、そのリポジトリに移動する

<!--more-->

2 つの方法を試した。

1. zsh
2. tmux (+ zsh)

他にも差分があるかもしれないが、以下が機能的な差分。

| 機能 | zsh | tmux |
| --- | --- | --- |
| vim などを開いているときに使える | No | Yes |
| ディレクトリの移動の履歴が残る | Yes | No |

結論としては、以下が使いやすいと思う。

1. tmux (+ zsh) の方法で設定する。
2. 同名の window がすでにあったり同じ window 内で移動したりしたい場合は、その場で移動するコマンドを別途 zsh で用意して移動する。

## zsh での方法

<img src="/img/2021-08-create-or-select-tmux-window-with-ghq_1.webp" />

以下のような定義を `.zshrc` に追加する。

```bash
function fzf-select-ghq-tmux () {
  local selected_dir=$(ghq list -p | fzf-tmux -p 80% --reverse --query "$LBUFFER" --preview 'bat --color=always --style=plain $(find {} -maxdepth 1 | grep -i -e "readme\(.\.*\)\?")')
  if [ -n "$selected_dir" ]; then
    local repo=$(basename ${selected_dir})
    BUFFER="tmux neww -S -n $repo -c $selected_dir"
    zle accept-line
  fi
}
zle -N fzf-select-ghq-tmux
bindkey '^h' fzf-select-ghq-tmux
```

キーバインドは自由に定義すればいいが、ここでは Ctrl + h とした。

前半の function について、分解して順番に見ていく。

まず以下の部分が ghq でリポジトリを選択する部分である。

```bash
local selected_dir=$(ghq list -p | fzf-tmux -p 80% --reverse --query "$LBUFFER" --preview 'bat --color=always --style=plain $(find {} -maxdepth 1 | grep -i -e "readme\(.\.*\)\?")')
```

`ghq list -p` は ghq 管理下にあるリポジトリの一覧を表示する。
`fzf-tmux` で tmux のポップアップウィンドウを表示して fzf を利用することができる。
`ghq list -p` の結果を `fzf-tmux --reverse` に渡すことによって、上部にプロンプトが表示され候補が上から並ぶスタイルで fzf を表示する。

`-p 80%` はウィンドウの幅と高さの割合を指定する。

今回やりたいことに対して必須ではないが、`--preview` オプションで最上部の候補のリポジトリの README ファイルを [bat](https://github.com/sharkdp/bat) を使ってプレビュー表示する。

fzf で選択された値が `{}` に入る。
`find {} -maxdepth 1` で選択したリポジトリ直下のファイルを一覧し、readme + `.拡張子`の形式 (大文字小文字区別なし、拡張子部分は任意) のファイルを探す。

function の定義に戻る。

```bash
local repo=$(basename ${selected_dir})
BUFFER="tmux neww -S -n $repo -c $selected_dir"
```

fzf で最終的に選択したパスは、`tmux neww` で新しいウィンドウを開くのに使う。
`tmux neww -S` とすると、指定の window 名があればそれを選び、なければ新しく作る動作となるので、これを使う。
window 名 `-n` には `basename` コマンドの結果を渡し、開始ディレクトリ (`-c`) には選択されたパスを直接指定する。
これを `BUFFER` に設定して `zle accept-line` すると、window の選択または作成とディレクトリ移動が実現できる。

### window のリネーム

これだけだと window 内でディレクトリを移動しても window 名が固定されたままになってしまうので、 `chpwd` を使って window をリネームする。

```bash
autoload -Uz add-zsh-hook
add-zsh-hook chpwd chpwd_rename

chpwd_rename() {
  if git rev-parse --git-dir > /dev/null 2>&1; then
    tmux renamew $(basename `git rev-parse --show-toplevel`)
  else
    tmux set -w automatic-rename
  fi
}
```

カレントディレクトリが git リポジトリであれば、 `git rev-parse --show-toplevel` でパスを取得し、`basename` でリポジトリ名を抽出する。
そうでない場合は `automatic-rename` で自動的にリネームさせる。

## tmux での方法

<img src="/img/2021-08-create-or-select-tmux-window-with-ghq_2.webp" />

結論としては以下を `~/.tmux.conf` に定義する。

```bash
bind C-g popup -E -w 80% -h 80% 'ghq list -p | fzf --reverse --preview '\''bat --color=always --style=plain `find {} -maxdepth 1 | grep -i -e "readme\\(.\\.*\\)\\?"`'\'' | xargs -I {} sh -c '\''tmux neww -S -n `basename {}` -c {}'\'
```

prefix、Ctrl + g で起動するが、キーバインドは自由に定義すれば良い。

zsh 版と大部分が同じだが、分解して順番に見ていく。

zsh での `fzf-tmux` の代わりに `tmux popup` で tmux 上にポップアップウィンドウを表示する。(`tmux.conf` においては単に `popup`)
`fzf-tmux` の `-p 80%` の代わりに `-w 80% -h 80%` でウィンドウの幅と高さの割合を指定する。
`-E` は、指定のコマンドを実行したあとにポップアップを閉じる。今回の場合は window を移動したらポップアップは自動的に閉じてくれた方が良いのでこのオプションを使う。
その後の 'ghq ...' の部分はポップアップウィンドウ内で実行するコマンド。

`ghq list -p` から `fzf` の部分は zsh 版とほぼ同じ。
全体がシングルクォーテーションで括られた文字列なので、その中のシングルクォーテーションや grep で readme を検索する部分の正規表現におけるバックスラッシュがエスケープされている点に注意が必要。

fzf で選択された結果のパスは、window 名を指定する (`-n`) のと開始ディレクトリ (`-c`) を指定するのに 2 回参照する必要があるため、`xargs` を使って値を参照できるようにする。

window 名を `basename` コマンドで取得しているが、これは即時に実行するのではなく `tmux neww` の実行時に実行してほしいため `sh -c` に渡して評価を遅延させている。

以上が分解したコマンドの説明。

window のリネームについては、tmux ではなく zsh で紹介した `chpwd` によるリネームを組み合わせて使う。
tmux のみでも以下のように似たようなことはできるが、その後別のディレクトリに移動しても同じ名前のままだったり他の手段でリポジトリのディレクトリに移動してもリネームされなかったりすることになるので、`chpwd` を使ったほうが無難である。

```bash
tmux popup -E 'ghq list -p | fzf --reverse | xargs -I {} sh -c '\''tmux neww -S -n `basename {}` -c {} && tmux renamew `basename {}`'\'
# or
tmux popup -E 'ghq list -p | fzf --reverse | xargs -I {} sh -c '\''tmux neww -S -n `basename {}` -c {} \\; renamew `basename {}`'\'
```

## 同じ名前のリポジトリに移動できない問題

冒頭に挙げた機能上の差分でどちらが好みかによって zsh 版か tmux 版かを選ぶと良いと思うが、どちらの場合も window の名前をベースに window を移動している。
このため、すでに同じ名前の window が存在しているとその window に移動してしまい、どうしても同名のリポジトリのディレクトリが開けないということが起こってしまう。例えば fork したリポジトリと fork 元のリポジトリの両方が ghq でチェックアウトされていると、 basename が同じリポジトリが複数存在することになる。

あるいは、新しい window を開いたりせずその場で移動したい場合もあると思う。

こうしたパターンまで無理に統合しようとするよりは、現在の window 上で ghq + fzf を使って移動する操作を定義して使うほうが良さそうである。(実際には単に方法が見つけられていないのだが...それ以上検討するメリットがないと感じた :stuck_out_tongue:)

## バージョン情報

今回利用したプログラムのバージョンは以下の通り。

```
❯ zsh --version
zsh 5.8 (x86_64-apple-darwin20.1.0)

❯ tmux -V
tmux 3.2

❯ ghq --version
ghq version 1.1.7 (rev:7f31419)

❯ fzf --version
0.27.0 (brew)
```
