---
title: "Play FrameworkのCustom Field Constructorを作る"
created: 2015-03-28T16:16:00.001+09:00
tags: ["Play Framework"]
---
Play Framework (2.3.8)では、Scalaでテンプレートを書くようになっているが、以下のようなフォームを作りたい場合に`@helper.form`でフォームを作ると`<dd>`タグなどでレイアウトされてしまい思うようにならない。

![formのイメージ](https://lh3.googleusercontent.com/-ZBWgN1qx2E8/VRZTC2RtH6I/AAAAAAAAOvI/Q29M8POJw04/s600/Screenshot+2015-03-28+16.03.14.png "Screenshot 2015-03-28 16.03.14.png")

そこでCustom Field Constructorを定義する。

<!--more-->

### Viewの定義

 上記のform部分は以下のような定義。(`todo.scala.html`)
CSSのクラスなどはBootstrap 3のためのもの。

```html
    <div class="form-group">
        @helper.form(routes.Todo.create(), 'id -> "newTodo", 'class -> "form-inline") {
            @helper.CSRF.formField
            @helper.inputText(form("title"), '_label -> "Title:", 'class -> "form-control", 'placeholder -> "Title")
            @helper.inputText(form("note"), '_label -> "Note:", 'class -> "form-control", 'placeholder -> "Note")
            @helper.select(form("todoStateId"), helper.options(TodoState.options), '_label -> "Status:", 'class -> "form-control")
            <input type="submit" class="btn btn-primary" value="Save" />
            @if(form.hasErrors) {
            <div class="alert alert-warning">
                @for(entry <- form.errors.entrySet){
                    @for(error <- entry.getValue){
                        @error.key: @Messages(error.message, error.arguments)
                    }
                }
            </div>
            }
        }
    </div>
```

### Custom Field Constructorの作成

`views/field/todoFieldConstructorTemplate.scala.html`を作成する。

```html
@(elements: helper.FieldElements)

<label class="sr-only" for="@elements.id">@elements.label(elements.lang)</label>
@elements.input
```

### 適用

View(`todo.scala.html`)に以下のように`@implicitField`の行を追加する。

```scala
@(form: Form[views.formdata.TodoForm], allTodos: List[models.Todo])

@implicitField = @{ helper.FieldConstructor(views.html.field.todoFieldConstructorTemplate.f) }
```

表示してみると、空行がやたらに沢山出力されているのが気になったものの、冒頭のような表示にできた。
簡単だし、複数のフォームがあった場合は各formに個別に`FieldConstructor`を指定することもできるようだし、なかなか良い感じ。
