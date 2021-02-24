---
title: "Herokuへのpushに失敗する"
noEnglish: true
originalCreatedAt: 2011-08-06T02:16:00.000+09:00
tags: ["Heroku","Ruby on Rails"]
---
Ruby on Railsの話題です。

Gemfileに修正を加えたのですが、Herokuにpushできなくなってしまいました。
Gemfile.lockを削除してbundle installし直すなど試しましたが上手く行かず…
<!--more-->
環境は以下です。
(どこまで書けば役に立つでしょうか。。)

- Windows7
- Git-Bash(MINGW32)
- ruby 1.9.2p290 (2011-07-09) [i386-mingw32]
- Bundler version 1.0.15

上手く行ったのは以下でした。
[ruby on rails - Why won't Heroku accept my Gemfile.lock in Windows? - StackOverflow](http://stackoverflow.com/questions/5954236/why-wont-heroku-accept-my-gemfile-lock-in-windows)

以下の2行を削除したらpushできました。

```
PLATFORMS
  x86-mingw32
```

以下、エラーの発生している状態です。

```sh
$ git push heroku master
Enter passphrase for key '******/.ssh/id_rsa':
Counting objects: 15, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (9/9), done.
Writing objects: 100% (9/9), 1.04 KiB, done.
Total 9 (delta 6), reused 0 (delta 0)

-----> Heroku receiving push
-----> Rails app detected
-----> Detected Rails is not set to serve static_assets
       Installing rails3_serve_static_assets... done
-----> Configure Rails 3 to disable x-sendfile
       Installing rails3_disable_x_sendfile... done
-----> Configure Rails to log to stdout
       Installing rails_log_stdout... done
-----> Gemfile detected, running Bundler version 1.0.7
       Unresolved dependencies detected; Installing...
       Using --without development:test
       Windows Gemfile.lock detected, ignoring it.
       You have modified your Gemfile in development but did not check
       the resulting snapshot (Gemfile.lock) into version control

       You have added to the Gemfile:
       * source: rubygems repository http://rubygems.org/
       * rails (= 3.0.9)
       * mongo
       * mongoid (= 2.0.2)
       * bson_ext (~> 1.3)
       FAILED: http://devcenter.heroku.com/articles/bundler
 !     Heroku push rejected, failed to install gems via Bundler

To git@heroku.com:*******.git
 ! [remote rejected] master -> master (pre-receive hook declined)
error: failed to push some refs to 'git@heroku.com:*******.git'
```

修正後です。

```sh
$ git push heroku master
Enter passphrase for key '**********/.ssh/id_rsa':
Counting objects: 18, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (12/12), done.
Writing objects: 100% (12/12), 1.28 KiB, done.
Total 12 (delta 8), reused 0 (delta 0)

-----> Heroku receiving push
-----> Rails app detected
-----> Detected Rails is not set to serve static_assets
       Installing rails3_serve_static_assets... done
-----> Configure Rails 3 to disable x-sendfile
       Installing rails3_disable_x_sendfile... done
-----> Configure Rails to log to stdout
       Installing rails_log_stdout... done
-----> Gemfile detected, running Bundler version 1.0.7
       Unresolved dependencies detected; Installing...
       Using --without development:test
       Fetching source index for http://rubygems.org/
       Installing rake (0.9.2)
       Installing abstract (1.0.0)
:
       Your bundle is complete! It was installed into ./.bundle/gems/
-----> Compiled slug size is 4.3MB
-----> Launching... done, v18
       http://**********.heroku.com deployed to Heroku

To git@heroku.com:************.git
```
