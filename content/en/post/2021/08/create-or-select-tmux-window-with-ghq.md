---
title: Create or select tmux window with ghq
tags: ["tmux", "zsh", "ghq"]
---
When I want to come and go several project windows frequently, if I use VSCode then using [vscode-ghq](https://marketplace.visualstudio.com/items?itemName=marchrock.vscode-ghq) and switching window is enough for me. But if I need to work on terminals, I'd rather want to use terminals like iTerm2 than terminal in VSVode.
I wanted to do like what I do in VSCode, but I used to do operations like below.

1. Find the target repository from the opened windows (relying on my memory).
2. If the target repository is opened in some window, then switch to it.
3. Otherwise, create a window with prefix + c on tmux and move to it by using ghq.

In this article, I will explain how to do following operations with just 1 command.

1. Show a list of repository with ghq from any windows.
2. Find the window which directory is the selected repository.
3. If the target repository is opened in existing window, then move to it.
4. Otherwise create a new window, move to it, and change the directory to that of selected repository.

<!--more-->

I tried the following 2 methods.

1. zsh
2. tmux (+ zsh)

These are the differences of the two methods, though I'm not sure that they are all of them.

| Function | zsh | tmux |
| --- | --- | --- |
| You can invoke it even when you are running programs like vim. | No | Yes |
| Operation of changing directory is recorded to your history. | Yes | No |

In conclusion, I think following solution is easy to use.

1. Configure the command with tmux (+ zsh) way.
2. If there is a window that has the same name as the target, or if you just want to change directory in the current window, then preparing another command to do so is reasonable solution.

## How to do with zsh

<img src="/img/2021-08-create-or-select-tmux-window-with-ghq_1.webp" />

First, you have to add a function definition to your `.zshrc`.

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

Of course you can choose the key binding as whatever you like, but I set it to ctrl + h this time.

Let's look into the detail of the above function one by one.

First, the following statement is the part that you choose the repository with ghq.

```bash
local selected_dir=$(ghq list -p | fzf-tmux -p 80% --reverse --query "$LBUFFER" --preview 'bat --color=always --style=plain $(find {} -maxdepth 1 | grep -i -e "readme\(.\.*\)\?")')
```

`ghq list -p` will show the list of repositories inside the ghq managed directory.
You can use the fuzzy search feature by passing the result to `fzf-tmux`, which will show a popup window of tmux.
`fzf-tmux --reverse` will show a search window with the prompt at the top and candidates are listed from top to bottom.

`-p 80%` specifies the width and height of the window.

Although this is not necessary for what we want to do in this time, I will use `--preview` option to show a preview of the README file of the current selected repository by using [bat](https://github.com/sharkdp/bat).

The selected value from fzf will be set to `{}`.
`find {} -maxdepth 1` will list the files from the root directory of the selected repository, and it will find a file that has readme + `.ext` format (case insensitive, extension part is optional).

Let's go back to the definition of the function.

```bash
local repo=$(basename ${selected_dir})
BUFFER="tmux neww -S -n $repo -c $selected_dir"
```

The selected repository path in fzf will be used to create a new window with `tmux neww`.
`tmux neww -S` works just what we want for our purpose - if the window with the specified name already exists then switch to it, otherwise a new window is created.
For the window name option (`-n`) we will pass the result of `basename` command, and we specify the selected path to `-c` option directly as the starting directory.
Then you set it to `BUFFER` and run `zle accept-line`, and finally you can achieve selecting or creating a window.

### Renaming window

This is not enough because when we change directory inside the window the name of it still not changed.
To fix this, we use `chpwd` to rename the window.

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

If the current directory is a git repository, then we get the path of it by running `git rev-parse --show-toplevel` and extract the name of the repository by `basename`.
Otherwise let tmux rename it automatically by `automatic-rename`.

## How to do with tmux

<img src="/img/2021-08-create-or-select-tmux-window-with-ghq_2.webp" />

In conclution, you can do it by defining the following line in your `~/.tmux.conf`.

```bash
bind C-g popup -E -w 80% -h 80% 'ghq list -p | fzf --reverse --preview '\''bat --color=always --style=plain `find {} -maxdepth 1 | grep -i -e "readme\\(.\\.*\\)\\?"`'\'' | xargs -I {} sh -c '\''tmux neww -S -n `basename {}` -c {}'\'
```

This will invoke a popup by prefix and Ctrl + g, but you can define the key bind as you like.

Most of it is the same as the zsh version, but let's look into it step by step.

First, show a popup on a tmux window with `tmux popup` instead of `fzf-tmux`. (It is just `popup` in the `tmux.conf`.)
And you can specify the percentage of width and height of the window with `-w 80% -h 80%` instead of using `-p 80%` of `fzf-tmux`.
The `-E` option closes the popup after executing the specified command. In our use case, it's better that the window closes automatically rather than manually, so we use this option.
The subsequent 'ghq ...' part is the command to be run in the popup window.

The next part, from `ghq list -p` to `fzf` is almost the same as the zsh version.
Please note that the entire string is surrounded by single quotations, so single quoatations in the string and backslashs in the regular expression to search readme files must be escaped.

The path which is selected on fzf should be able to be referred twice, to specify the window name with `-n` option and to specify the start directory with `-c` option, so we use `xargs` to resolve this.

We use `basename` command to get the window name, but it should be executed when running `tmux neww` rather than immediately, so we let the initialization run later by passing it to `sh -c`.

That's it for the explanation of the command.

Regarding renaming of the windows, it's better to use `chpwd` of zsh in combination that I explained above.
Maybe you can also achieve it with a tmux command like below, but it has some problems - the window name is not changed even when you move to the other directory or move with other method. Therefore `chpwd` method is a better choice.

```bash
tmux popup -E 'ghq list -p | fzf --reverse | xargs -I {} sh -c '\''tmux neww -S -n `basename {}` -c {} && tmux renamew `basename {}`'\'
# or
tmux popup -E 'ghq list -p | fzf --reverse | xargs -I {} sh -c '\''tmux neww -S -n `basename {}` -c {} \\; renamew `basename {}`'\'
```

## Can't move to the repository which has the same name as other windows

You can choose zsh version or tmux version depending on which of the functional differences listed at the beginning of this article you prefer, but either way we move between windows using their names.
Thus, if there is a window which has the same name as the target repository, you would be moved into that window and you can't never move to the target repository. For example, if both of the forked repository and source repository are checked out by ghq, they have the same basename.

Or you may want to move to the directory in the current window rather than creating a new one.

I think it's reasonable to define another command to move directory in the current window by using ghq and fzf instead of struggling to integrate them. (Actually it's just that I couldn't find the way to resolve it...but anyway I don't think it's worth to investigate :stuck_out_tongue:)

## Versions

I used following programs in this article.

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
