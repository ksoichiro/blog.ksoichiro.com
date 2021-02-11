---
title: "[iOS][Xcode] Xcodeで簡易フォーマットチェック"
created: 2014-03-01T01:02:00.004+09:00
tags: ["iOS","静的解析","Xcode","フォーマッタ"]
---
前回の [OCLintでXcode5プロジェクトのObjective-Cソースコードを静的解析](http://ksoichiro.blogspot.jp/2014/02/iosxcode-oclintxcode5objective-c.html) で、コマンドの出力を整形すればソースコード上に警告表示できることを知ったので、簡単なフォーマットチェックができないか試してみました。

作業はXcode 5.0.2で行なっています。

まず、Targetを追加します。
iOS > Other > Aggregateで作成します。

このTargetに、メニューのEditor > Add Build Phase > Add Run Script Build PhaseでScriptを追加します。
Scriptには以下のようなものを記述します。
ここでは、elseと括弧の間にスペースを入れる、という簡単なチェックをしてみます。

```sh
export PATH=/usr/bin:/usr/local/bin:$PATH

cd ${SRCROOT}

# フォーマット違反パターン
pattern=("}else"  "else{")
# エラーメッセージ
desc=("}の後にスペースを入れてください" "elseの後にスペースを入れてください")
# 修正例
example=("} else" "else {")

has_error=0
# mで終わるファイルを対象にチェック
for i in $(find ${PROJECT_NAME} -regex ".*\.m*"); do
  n=0
  for p in ${pattern[@]}; do
    if output=$(grep -nH "$p" $i); then
      has_error=1
      echo $output | sed "s/^\([^:]*:[^:]*\).*$/\1:1: warning: フォーマット違反: ${desc[n]}: ${example[n]}/"
    fi
    let n++
  done
done

exit $has_error
```

画面イメージです。

[![](http://2.bp.blogspot.com/-Qzv1mRDoz9g/UxCxRnFPIiI/AAAAAAAAMfU/MQZ7gLC-UBI/s1600/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88+2014-03-01+0.40.54.png)](http://2.bp.blogspot.com/-Qzv1mRDoz9g/UxCxRnFPIiI/AAAAAAAAMfU/MQZ7gLC-UBI/s1600/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88+2014-03-01+0.40.54.png)

上記のチェック内容でビルドすると、
}else{
と書いた箇所に以下のように警告が表示されます。
警告が出たら「Build Failed」、出なければ「Build Succeeded」となります。

[![](http://3.bp.blogspot.com/--m8XATJMyRg/UxCxvbtdTPI/AAAAAAAAMfc/zX6PQHUA7lU/s1600/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88+2014-03-01+0.42.13.png)](http://3.bp.blogspot.com/--m8XATJMyRg/UxCxvbtdTPI/AAAAAAAAMfc/zX6PQHUA7lU/s1600/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88+2014-03-01+0.42.13.png)

チェックのパターンは、上記ではシェルスクリプト内に直接書いていますが、別のファイルにして読み込むようにすれば、スクリプト自体のメンテナンスもしやすくなりそうです。
