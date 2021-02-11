---
title: "Vagrant + MariaDB"
created: 2015-03-28T14:17:00.001+09:00
tags: ["MariaDB","Vagrant"]
---
今更書くほどの内容でもないが、、Vagrantで開発用のMariaDBサーバを作るためのメモ。

結論からするとMySQLと同じなのだが・・

<!--more-->

### ファイル

以下のような`Vagrantfile`と`bootstrap.sh`を置けば、
`vagrant up`でUbuntu(Trusty)サーバでDBがセットアップされ、アクセスできるようになる。

JDBCなら`jdbc:mysql://192.168.33.11:3306/test`のようなURL。
MySQLクライアントなら`mysql -h 192.168.33.11 -usa -p test`でログインできる。

Vagrantfile

```ruby
Vagrant.configure("2") do |config|
    config.vm.box = 'ubuntu/trusty64'
    config.vm.provision :shell, path: "bootstrap.sh"
    config.vm.network "private_network", ip: "192.168.33.11"
end
```

bootstrap.sh

```sh
#!/usr/bin/env bash

echo "Updating apt-get..."
apt-get update > /dev/null 2>&1

# MariaDB
which mysql > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "Installing MariaDB..."
  DEBIAN_FRONTEND=noninteractive apt-get install -q -y mariadb-server > /dev/null 2>&1

  cat > /etc/mysql/my.cnf << EOF
[client]
port                    = 3306
socket                  = /var/run/mysqld/mysqld.sock
default-character-set   = utf8

[mysqld_safe]
socket                  = /var/run/mysqld/mysqld.sock
nice                    = 0

[mysqld]
user                    = mysql
pid-file                = /var/run/mysqld/mysqld.pid
socket                  = /var/run/mysqld/mysqld.sock
port                    = 3306
basedir                 = /usr
datadir                 = /var/lib/mysql
tmpdir                  = /tmp
lc-messages-dir         = /usr/share/mysql
skip-external-locking
bind-address            = 0.0.0.0
key_buffer              = 16M
max_allowed_packet      = 16M
thread_stack            = 192K
thread_cache_size       = 8
myisam-recover          = BACKUP
query_cache_limit       = 1M
query_cache_size        = 16M
log_error               = /var/log/mysql/error.log
expire_logs_days        = 10
max_binlog_size         = 100M
character-set-server    = utf8

[mysqldump]
quick
quote-names
max_allowed_packet      = 16M

[mysql]
default-character-set   = utf8

[isamchk]
key_buffer              = 16M
!includedir /etc/mysql/conf.d/
EOF

  mysql -uroot -e "CREATE DATABASE IF NOT EXISTS test CHARACTER SET utf8;
GRANT ALL ON test.* to sa;
FLUSH PRIVILEGES;
SET PASSWORD FOR sa=PASSWORD('password');"
  service mysql restart
fi
```

以下、いくつかポイントなど。

### ネットワーク

最初はPort forwardingで3306を別ポートに転送、などを試していたがうまくいかなかった。
Private networkなら問題ない。

なお、上記は固定のIPアドレスを書いているので、当然、既にこのIPアドレスが存在しているならVagrantfile内のIPアドレスを変更する必要がある。

### my.cnf

`/etc/mysql/my.cnf`を出力させているが、これはデフォルトから変更する必要がなかったら省略可能。

### ログイン

ここではユーザ`sa`を追加しているが、追加した後でDBを再起動する必要があった。

なお、全てのホストからアクセスできるようにしているが、最初から入ってる`root`ユーザでいいから省略しよう、としてしまうとアクセスできないので注意。(VMから見たホストOS側のIPは許可されていない)
