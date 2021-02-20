---
title: Trigger CircleCI 2.1 pipeline by both push and pull request
tags: ["CircleCI"]
---

## Pipelines cannot be triggered by both push and pull request

CircleCI's pipelines can be triggered by push by default.
There are some cases that push trigger suits, but you might sometimes want to trigger pipelines by creating or updating pull requests.
If you want to trigger pipelines only by pull requests, then you can do it by enabling `Only build pull requests` option.
It is notable that with this option, only pull requests to default branch, push to default branch and tags are the targets. It might be insufficient for your workflow.

In this case, you can create pipelines using CircleCI API from GitHub Actions that is triggered by pull requests.
<!--more-->
## Conditional execution of pipelines with parameters

As of January 2021, version 2.1 is the latest version of CircleCI config.
In this version, it is explained that jobs cannot be triggered from API.
https://circleci.com/docs/2.0/api-job-trigger/

However, it just means that `job` cannot be triggered and `pipeline` can be triggered.
https://support.circleci.com/hc/en-us/articles/360041503393-A-workaround-to-trigger-a-single-job-with-2-1-config

`pipeline` indicates the entire configuration and we can't specify the part of it from the API, but we can configure to give `parameters` to the pipelines and select jobs using parameters.

### Configurations for CircleCI

First, you have to prepare a `boolean` type parameter named `pull_request` in `.circleci/config.yml`.
Then, configure conditions to execute each jobs with `when` or `unless` keywords using this `pull_request` parameter.
`when` and `unless` are described in the following document.
https://circleci.com/docs/2.0/configuration-reference/#using-when-in-workflows

For example, you can write like following to execute `push` job (push trigger can't have `parameters`), and execute `pull_request` job from pull request by sending `pull_request: true` in `parameters` field.

```yaml
version: 2.1

parameters:
  pull_request:
    type: boolean
    default: false

orbs:
  welcome: circleci/welcome-orb@0.4.1
  hello: circleci/hello-build@0.0.5

workflows:
  push:
    unless: << pipeline.parameters.pull_request >>
    jobs:
      - welcome/run

  pull_request:
    when: << pipeline.parameters.pull_request >>
    jobs:
      - hello/hello-build
```

### Configurations for GitHub Actions

Configurations for GitHub Actions are just as same as the following answer.
https://stackoverflow.com/questions/44672893/is-there-a-way-to-trigger-a-circleci-build-on-a-pull-request?rq=1

```yaml
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger CircleCI
        env:
          CIRCLE_BRANCH: ${{ github.head_ref }}
        run: |
          curl -X POST \
          -H 'Circle-Token: ${{secrets.CIRCLE_TOKEN}}' \
          -H 'Content-Type: application/json' \
          -H 'Accept: application/json' \
          -d "{\"branch\":\"${CIRCLE_BRANCH}\",\"parameters\":{\"pull_request\":true}}" \
          https://circleci.com/api/v2/project/gh/ORG_NAME/REPO_NAME/pipeline
```

`ORG_NAME` and `REPO_NAME` should be replaced to your repository's owner and name.

### How to create and manage Circle-Token

The value of `Circle-Token` header (written as `CIRCLE_TOKEN` in the paragraph above) must be a Personal Access Token which can be published from your user configuration page on CircleCI, and must be registered as a Secret in the GitHub repository configuration.
CircleCI also provides project level tokens, but those tokens cannot be used for triggering pipelines as of now, and we should use Personal Access Tokens for this case.

## When do I need this solution?

This is a small list of situations that this solutions are effective.
If you can achieve your requirements only by GitHub Actions then you don't have to do this.
If you would like restrict builds to pull requests rather than use both types of build, then you should do so.

### Trigger by push

- You can trigger builds without composing a pull request and make builds finished faster.
- You can easily do your tasks with CI/CD without attracting attention from other developers by sending pull requests.

### Trigger by pull request

- You can do some checks using diffs between your branch and the base branch.
- You can receive feedback (comments) from CI on the pull request.
