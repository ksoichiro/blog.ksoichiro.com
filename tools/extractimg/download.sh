#!/bin/bash

while read LINE
do
  cmd=`echo -n "$LINE" | cut -f 4`
  echo $cmd
  $cmd
  sleep 1
done < tools/extractimg/list.txt

