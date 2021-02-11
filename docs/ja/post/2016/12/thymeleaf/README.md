---
title: "Thymeleafの部品化"
created: 2016-12-31T19:10:00.001+09:00
tags: ["Thymeleaf"]
---
`th:fragment` によって部品を作るのは比較的簡単にできるが、
類似の部品が出てきた時に、その中の一部を変更したい場合にどうするか？

例えば以下のようなイメージ。
barタグとbazタグだけが差分であり、その他は同じ構成になっている。

```html
<foo id="foo1">
  <div></div>
  <bar></bar>
</foo>

<foo id="foo2">
  <div></div>
  <baz></baz>
</foo>
```

それぞれのfooタグを部品として定義するのも良いが、それでは重複コードが多すぎる。

<!--more-->
これを解決するには、layout dialectを使えば良さそう。
部品の中に別のHTMLフラグメントを入れることができる。

例えばBootstrapのHorizontal Formの入力項目1つを表現した部品。

_fragments/form.html

```html
<div layout:fragment="form-base (field, label)">
  <label class="control-label" th:for="${field}" th:text="${label}"></label>
  <div layout:fragment="form-content"></div>
  <span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true" th:if="${#fields.hasErrors('__${field}__')}"></span>
  <span th:id="|status-${field}|" class="sr-only">(error)</span>
  <div class="help-block" th:if="${#fields.hasErrors('__${field}__')}" th:errors="*{__${field}__}">Error</div>
</div>
```

これをベースにして個別の部品を作っていく。
layout:includeで上の部品を取り込み、その内側のlayout:fragmentで別のフラグメントを組み込む。

```html
<div th:fragment="input-text (field, label, autofocus)" class="form-group has-feedback" th:classappend="${#fields.hasErrors('__${field}__')}? 'has-error'">
  <div layout:include="_fragments/form :: form-base(field=${field}, label=${label})" th:remove="tag">
    <input layout:fragment="form-content" type="text" class="form-control" th:field="*{__${field}__}" th:attr="aria-describedby=|status-${field}|" th:autofocus="${autofocus}? 'autofocus'"/>
  </div>
</div>
```

こうすれば類似の部品をある程度共通化することができる。
注意点は、layout:fragmentの中に書くのは名前(上記では`form-content`)であってパス(`_fragments/form :: form-content`など)ではない点。
