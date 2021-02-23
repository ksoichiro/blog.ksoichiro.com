#!/bin/bash

while read LINE
do
  arr=($LINE)
  file=${arr[0]}
  src=${arr[1]}
  src=`echo -n "$src" | sed -e "s,/s[0-9]*/,/s[0-9]*/,"`
  dst=${arr[2]}
  dst=${dst#static}
  sed -i '' -e "s,$src,$dst,g" $file
done < tools/extractimg/list.txt

