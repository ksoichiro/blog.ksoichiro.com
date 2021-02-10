---
title: Set CODEOWNERS to the project root on GitHub
description: There are important files in the project root dirctory that affect to the whole project such as configuration files which names start with `.`.
date: 2021-02-07 00:00
tags: ["GitHub", "GitHub Actions"]
---
There are important files in the project root dirctory that affect to the whole project such as configuration files which names start with `.`.
I thought it might be meaningful to apply `CODEOWNERS` file to those project root files.

## Test with machine user

To test this, I need multiple users but I can't create another user that can be manually operatable on GitHub.
GitHub allows us to create a machine user that can be used for CI, so I tested the expected files are required to be approved by code owner if the machine user create a pull request automatically.

This time I set GitHub Action configuration to create a pull request by opening a new issue.

I tried to configure a workflow using some actions, and I could successfully created a pull request by opening a issue.
However, even if pull requests are created automatically with the following configuration, the author was not the machine user but myself.

```yaml
name: Create Pull Request

on:
  issues:
    types: opened

jobs:
  create-pull-request:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Create changes
        run: |
          date +%s > report.txt

      - name: Create Pull Request
        id: cpr
        uses: peter-evans/create-pull-request@v3
        with:
          token: ${{secrets.BOT_REPO_TOKEN}}
          commit-message: Update report
          committer: GitHub <noreply@github.com>
          author: ${{ github.actor }} <${{ github.actor }}@users.noreply.github.com>
          signoff: false
          branch: example-patches
          delete-branch: true
          title: '[Example] Update report'
          draft: false
```

To make machine user the author of the commits, you have to configure `author` for create-pull-request action.

```yaml
      - name: Create Pull Request
        id: cpr
        uses: peter-evans/create-pull-request@v3
        with:
          ...
          committer: GitHub <noreply@github.com>
          author: ksoichiro-bot <ksoichiro-bot@users.noreply.github.com>
```

Now I can confirm how the `CODEOWNERS` works: when I open a new issue, then the machine user will create changes to the specified file and create a new pull request.

## Behavior of the CODEOWNERS

Here's the thing.

### Make all files to require approval

As described in [the explanation of CODEOWNERS](https://docs.github.com/github/creating-cloning-and-archiving-repositories/about-code-owners#example-of-a-codeowners-file), I tried to define `.github/CODEOWNERS` like below.

```
* @ksoichiro
```

This means that all files in the project requires approval from `@ksoichiro` unless it's overridden by other conditions.
In this post, it is assumed that I (or members) think that this is too strict rule.

### Make files under the project root to require approval

Next, I tried to change `.github/CODEOWNERS` to target files in the project root.

```
/* @ksoichiro
```

With this change, when I add new file `a/report.txt` to the existing directory `a`, reviewers are not set.
However, this is not perfect unfortunately.

If a new directory (and files in that directory) is created, the addition of the directory itself seems a change for the root directory, and you might expect that an approval is required, but it doesn't.
It means that this rule does not prevent that someone creates a new directory without code owners' approval.

## Conclusions

In `CODEOWNERS` file, lower lines are prior than upper lines, but it does not mean that it can negate the upper rules.
It just means that approvers can be redefined.
Thus, these could be the possible solutions if you want to set approvers for files of the project root as of now.

- Set `*`, and require approval of code owner to all files' additions/changes.
- Set `/*`, and require approval of code owners to the files of the project root additions/changes, and accept addition of directories to the existing directory of the project root or changes to existing directory without any approvals.
- Set `/*`, and require approval of code owners to the files of the project root additions/changes, and build a workflow to require approval of code owners by detecting addition of directory to the project root somehow.
