---
title: Comment on pull request by GitHub Actions when it is approved
tags: ["CI", "GitHub Actions"]
---
I'm exploring the possibility of using GitHub Actions to do a little automation in development around pull requests.
In repositories where there are many people coming and going, or where people only develop occasionally, I think it would be difficult to let people read and follow something like a development workflow, even if it is carefully documented.
I think it would be more effective to prepare something that indicates or forces next action according to the progress of development.

Based on that kind of thoughts, I tried to create an `action` to comment on a pull request when it is approved and become mergeable.
With this comment, developers are able to recognize what they should do before or after merging it.
The following is an image of a bot commenting on a pull request when it is approved.

![](/img/2021-03-comment-on-pr-when-approved_1.png)

<!--more-->

## How can we implement this?

What I really wanted to do was that a bot comments on a pull request when it become mergeable, but how can I do this?
There are following options.

1. Trigger comment by detecting pull request approval event
    - When pull requests requires one or more approvals, configure the action to detect pull requests approved.
2. Trigger comment by detecting pull request status becoming mergeable
    - When pull requests requires status check to be passed, configure the action to detect pull requests status become mergeable.

As it is described in [Defining the mergeability of pull requests](https://docs.github.com/en/github/administering-a-repository/defining-the-mergeability-of-pull-requests), both ways uses branch protection features as prerequisite.

On team development, if we'd like to apply stricter rules then we would enable status checks in addition to approvals, so I thought it's better to implement method 2.
However, no such things are explained in [Events that trigger workflows](https://docs.github.com/en/actions/reference/events-that-trigger-workflows).
For pull request approvals in method 1, I found a post on support community - [Feature Request |trigger action on “Pull Request Approved”](https://github.community/t/feature-request-trigger-action-on-pull-request-approved/18413), and it seemed [pull_request_review](https://docs.github.com/en/actions/reference/events-that-trigger-workflows#pull_request_review) was suitable for this purpose, so I tried.

By the way, [approved-event-action](https://github.com/taichi/approved-event-action) already exists, but I could not make it work with v1.2.1 due to the following error:

```
Error: Unable to process command '::set-env name=APPROVED,::true' successfully.
Error: The `set-env` command is disabled. Please upgrade to using Environment Files or opt into unsecure command execution by setting the `ACTIONS_ALLOW_UNSECURE_COMMANDS` environment variable to `true`. For more information see: https://github.blog/changelog/2020-10-01-github-actions-deprecating-set-env-and-add-path-commands/
```

## Preparation

For my experiments, I reused the method which I tried in [Set CODEOWNERS to the project root on GitHub](/post/2021/02/codeowners-for-root-dir/) to let someone(bot) create pull requests to approve by myself.
If you just want to use the result you don't have to do this, but this is very useful for trying something like this by yourself.

## Detecting approved state

This is the most important part of this feature. The `approved` state can be handled by using `pull_request_review` event with the type `submitted`.

```yml
on:
  pull_request_review:
    types: [submitted]

jobs:
  check-state:
    if: github.event.review.state == 'approved'
```

If these conditions are not met, like submitting review with just comment for example, the job will be skipped and nothing will be executed.

## Commenting just once

It is quite often that there are several reviewers to approve, and even if there is only one reviewer he/she can submit review as many times as he/she likes. Therefore the above conditions are not enough because the job is triggerred several times.
If you want to avoid this behavior, you can achieve this by finding existing comment then creating or updating comment.
To do this, we can use [peter-evans/find-comment](https://github.com/peter-evans/find-comment).
With this action, we can assume the bot have already commented before when there is a comment with specific conditions, and otherwise let the bot comment on the pull request.

```yml
- name: Find last comment
  id: find-last-comment
  uses: peter-evans/find-comment@v1
  with:
    issue-number: ${{github.event.pull_request.number}}
    comment-author: 'github-actions[bot]'
    body-includes: 'Change for master is approved!!'
```

It would be great if there is something like tags that can be used to distinguish this kind of comments, but unfortunately it seems we can only identify them by chekcing the comment body contains some text.

## Restricting the base branch

You may want to restrict this kind of checks to specific protected branches. But please note that we cannot use `pull_request_review.branches` for this purpose.
For example, when we want to implement an action for approvals of pull requests targeting to `master` branch, you might write like below, but it won't work.

```yml
on:
  pull_request_review:
    types: [submitted]
    branches: ['master']
```

Because we don't want to let this action work on `master` branch, but want to do it on pull requests that have `master` branch as base branch.
(This is obvious, but I think it's not intuitive and some of you might be confused.)
If you want to restrict it to the target base branch, you should use `github context` to get `pull_request` event to check base branch.

```yml
jobs:
  check-state:
    if: github.event.review.state == 'approved' && github.event.pull_request.base.ref == 'master'
```

If this conditions become complex, it might be better to separate them to a `step`.

## Commenting on pull request as review

With [peter-evans/create-or-update-comment](https://github.com/peter-evans/create-or-update-comment), we let the Github Action bot to comment on pull requests only when there is no existing comment.

```yml
- name: Comment
  if: steps.find-last-comment.outputs.comment-id == ''
  uses: peter-evans/create-or-update-comment@v1
  with:
    issue-number: ${{github.event.pull_request.number}}
    body: "Change for master is approved!! Merge it carefully."
```

## Complete!

Following is the final form of the workflow.

```yml
name: Respond to approved

on:
  pull_request_review:
    types: [submitted]

jobs:
  check-state:
    if: github.event.review.state == 'approved' && github.event.pull_request.base.ref == 'master'
    runs-on: ubuntu-latest
    steps:
      - name: Find last comment
        id: find-last-comment
        uses: peter-evans/find-comment@v1
        with:
          issue-number: ${{github.event.pull_request.number}}
          comment-author: 'github-actions[bot]'
          body-includes: 'Change for master is approved!!'

      - name: Comment
        if: steps.find-last-comment.outputs.comment-id == ''
        uses: peter-evans/create-or-update-comment@v1
        with:
          issue-number: ${{github.event.pull_request.number}}
          body: "Change for master is approved!! Merge it carefully."
```
