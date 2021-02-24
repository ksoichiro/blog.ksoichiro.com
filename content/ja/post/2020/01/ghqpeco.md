---
title: "かなり今さらながらghqやpecoなどをきちんと使ってみる"
noEnglish: true
originalCreatedAt: 2020-01-12T01:05:00.002+09:00
tags: ["Git"]
---
今さらすぎるだろという話ではあるのだが、[ghq](https://github.com/motemen/ghq)、[peco](https://github.com/peco/peco)などのツールを、知っていたけどちゃんと普段使いしたことがなかった。以前は Java 中心の開発をしていたせいか CLI はそれほど身近でないというか、あまり高頻度に使わなくても問題のない世界だった。今の職場では、こうしたツールなしでは難があるなと感じてようやく導入した。今さら書くのも恥ずかしい気はするのだが…いくつか気づきや工夫があったので書いておきたい。
<!--more-->

導入する前にやっていたこと、思っていたことは以下の通り。

1. ~/workspace などのディレクトリを作り、基本的にそこにすべて clone していた。
2. Go のリポジトリの場合、go get すると $GOPATH/src に配置されてしまうし、GOPATH から外れようとすると色々問題が起こるため結局諦めるものの、Go だけ別管理になって嫌だな…という違和感を抱いていた。
4. ghq を使うとリポジトリが1つのディレクトリにフラットに並ばないので、Git の GUI ツールで様々なリポジトリを扱うのが面倒になるのではないかと思っていた。

実際に試してみて、上記はすべて解決して今のところ快適に扱えている。

まず ~/workspace, ~/go/src を ghq の root に設定する。デフォルトのrootから変更したり複数のroot を設定したりしたいには ~/.gitconfig に記述すればよい。こうしておけば、Go の場合は go get で ~/go/src に配置、その他は ghq get で ~/workspace に配置されるが、ghq list でどちらでも検索することができる。

Go のバージョンをすぐ切り替えられるように [goenv](https://github.com/syndbg/goenv) を使うと、デフォルトでは ~/go/1.13.4 のように GOPATH にバージョン番号が含まれてしまう。この仕様だと、バージョンを追加したり切り替えるたびに clone し直したり ghq root の変更が必要になると考えていたが、goenv が GOPATH を変更するのは無効化することができた: `export GOENV_DISABLE_GOPATH=1` とすれば良い。

そしてGUIのGitクライアントについて。最近は [Fork](https://git-fork.com/) を使っている。そもそも GUI 必要なの？という点については、もちろんコマンドやIDE付属のもので基本的な操作はできるのだが、複数のブランチを比較したり、merge や rebase をしたりするときにはブランチを視覚的に見れたほうが安心感があるため、GUIも併用している (この時点で負けてる感じもする…)。これについては、VSCode での code コマンドのような感じで fork コマンドというのがインストールできるようになっていたため、ターミナル上でプロジェクトのディレクトリに移動して `fork .` とすれば簡単に Fork で開くことができた。他のプロジェクトに簡単に移動するのに使うのは ghq と peco を組み合わせればできる。つまり、多数のプロジェクトを同じディレクトリにフラットに並べなくておかなくても簡単に開ける。

というわけで、ghqやpecoの設定。

まず ~/.gitconfig での ghq の root 設定。これは先ほど説明した通り。

```ini
[ghq]
	root = ~/Workspace
	root = ~/go/src
```

peco については、オーソドックスに zshrc にて 履歴の検索、移動先リポジトリの検索、移動履歴の検索を設定して使ってみている。peco の prompt は `QUERY>` だが、設定したキーが身体に染み付いていないせいか、今何の検索画面が出ているんだっけ？となってしまうことが何度かあったため、prompt には icon font を設定して区別ができるようにしている。

```sh
# peco + history
function peco-history-selection() {
  BUFFER=`history -n 1 | tail -r | awk '!a[$0]++' | peco --prompt "❯"`
  CURSOR=$#BUFFER
  zle reset-prompt
}
zle -N peco-history-selection
bindkey '^R' peco-history-selection

# peco + ghq
function peco-src () {
  local selected_dir=$(ghq list -p | peco --prompt "❯" --query "$LBUFFER")
  if [ -n "$selected_dir" ]; then
    BUFFER="cd ${selected_dir}"
    zle accept-line
  fi
  #zle clear-screen
}
zle -N peco-src
bindkey '^g' peco-src

# peco + cdr
if [[ -n $(echo ${^fpath}/chpwd_recent_dirs(N)) && -n $(echo ${^fpath}/cdr(N)) ]]; then
  autoload -Uz chpwd_recent_dirs cdr add-zsh-hook
  add-zsh-hook chpwd chpwd_recent_dirs
  zstyle ':completion:*' recent-dirs-insert both
  zstyle ':chpwd:*' recent-dirs-default true
  zstyle ':chpwd:*' recent-dirs-max 1000
  zstyle ':chpwd:*' recent-dirs-file "$HOME/.cache/chpwd-recent-dirs"
fi
function peco-cdr () {
  local selected_dir="$(cdr -l | sed 's/^[0-9]* *//' | peco --prompt "❯" --query "$LBUFFER")"
  if [ -n "$selected_dir" ]; then
    BUFFER="cd ${selected_dir}"
    zle accept-line
  fi
}
zle -N peco-cdr
bindkey '^J' peco-cdr
```
