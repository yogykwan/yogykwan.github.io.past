---
layout: post
title: 在GitHub上搭建Jekyll博客和创建主题
category: 工具
tags: [Jekyll,Git]
keywords: Jekyll,Github Pages
description: 
---

## 简单介绍

### GitHub
GitHub不用多说，应该大家都知道，托管库的，上[GitHub官网](www.github.com)一看就知道。

### Jekyll
Jekyll是一个简单的用来生成静态页面的工具，不光能生成博客。[项目位置](https://github.com/mojombo/jekyll)，[项目Wiki](https://github.com/mojombo/jekyll/wiki)。

### 组合原因
GitHub托管项目是不提供服务端语言和数据库的，但是它支持静态页面的访问的，所以需要用Jekyll来将博客弄成静态的。

### 步骤概述

- 写[Markdown](http://wowubuntu.com/markdown/)或html页面
- 按照一定的目录整理
- 用`git push`提交到GitHub上，生成博客。

整个过程几乎没有多余的步骤，对于经常用键盘的人来说，再好不过了

__说明：本篇用到的代码中，为了防止解析冲突，一律多了`\`这个来防止被误解析__

## 创建一个库
在Github上新开一个库，名字叫做`username.github.io`，然后当别人在地址栏输入相应url的时候就可以访问进来了。

在这个库中完全可以只上传一个`index.html`，来讲自己要写的东西写进去，但是这样会丧失很多灵活性，所以需要Jekyll的帮助来创建自己的博客。

## 设定目录结构
把自己的库clone到本地来，建立如下目录结构：

```
├── CNAME
├── README.md
├── _config.yml
├── _includes
│   ├── disqus.html
│   ├── footer.html
│   ├── googleanalytics.html
│   ├── header.html
│   └── navside.html
├── _layouts
│   ├── base.html
│   ├── book.html
│   ├── page.html
│   └── post.html
├── _posts
│   ├── Book
│   ├── Life
│   ├── Resource
│   ├── Technology
│   └── Tool
├── index.html
├── pages
│   ├── about.html
│   ├── archive.html
│   └── atom.xml
├── public
│   ├── css
│   ├── fonts
│   ├── img
│   ├── js
│   └── upload
└── sitemap.txt

```

这个目录结构是我自己设定的，也可以有不同的目录结构，看[官网][2]。

接下来我主要解释这里面每一个目录的功能。

### 配置文件
`_config.yml`里写有整个站点的主要配置项，我的如下：

```
permalink: /:year/:month/:day/:title.html   #博文的固定链接
paginate: 10                                #分页时每页博文数量
author:                                     #自定义常亮
  name: Yogy
  email: jingg.cxy@gmail.com
  link: http://yogy.cc
title: "NULL"                            #自定义常量
locals:                                     #自定义常量
  tags: 标签
  about: 关于
active: 技术                                 #自定义常量
subscribe_rss: /pages/atom.xml              #订阅地址
markdown: redcarpet                         #markdown解释器
```

这里的自定义常量可以在模板中使用，以后有修改的时候就不需要跑去改代码了。尤其是对一些私人的选项，可以在这里定义。现在我的博客中出了disqus和googleanalytics外都直接在这里设定就好了。

### 域名配置
`CNAME`这个文件写明了这个站点的域名，如果不喜欢`username.github.io`的话，可以像我一样改掉

```
yogy.cc
```

改法只要在这个文件中写入域名就可以了。不过你需要去域名服务商那里设定域名解析规则。

只要把`主机记录`为`@`,`www`的记录值写成`username.github.io`就好了。

### 博客存放
`_posts`下的所有目录中的所有博客，都会被Jekyll处理成为静态的html文件，然后放在`_site`下。我这里没有`_site`目录，是因为我在`.gitignore`文件中把这个目录屏蔽掉了，它不会上传到Github上。

```
_site/
_drafts/
.DS_Store
```

以上是我的`.gitignore`文件内容。

在`_posts`下的符合`YYYY-MM-DD-xxxxxx.md`的文件，都会被Jekyll认定为博客内容。我在`_posts`下又新建了一些文件夹，主要是方便自己本地管理博客。

在上述这些文件中，必须先定义一些配置项，例如这篇博客的md文件中，开头是这样的：

```

layout: post                                   #这个博客的布局文件
title: 在Github上搭建Jekyll博客和创建主题             #博客标题
category: 工具                                          #博客分类
tags: [Jekyll，Git]                            #博客标签
keywords: Jekyll,Github                        #自定义常量
description:                                   #自定义常量

```

除了自定义常量外的必须包含进去，自定义变量在这个布局中可以访问。

### 模版文件
剩余的目录，基本都属于模板文件了，我解释一下各自的作用：

- `_includes` 可以在模板中随时包含的文件
- `_layouts` 布局文件，在博客头配置中可以选择
- `pages` 站内固定的页面
- `public` 公共资源，包括`js`,`css`,`img`等，还有我博客中调用的图片，我都放这里
- `index.html` 站点的首页，整个站的入口文件
- `sitemap.txt` 给搜索引擎看的，如何爬取这个站

## 创建主题
上面讲了如何布局好站内文件结构，接下来主要就是如何创建一个自己的主题了。

布局文件是整个主题最重要的文件，这些文件告诉Jekyll如何去形成一个html页面。

首先我说一下我最基础的`page.html`文件，因为它决定了入口文件`index.html`的布局。

```html

layout: base

<div class="row">
  <div class="col-md-12 aside3-title">
    <br>
    <h2 id="#identifier">{\{ page.title }}</h2>
  </div>
  <div class="col-md-12 aside3-content">
    <div id="page-content">
      {\{ content }}
    </div>
    <hr>
    {% include disqus.html %}
  </div>
</div>
```

从这里可以看到这个文件写起来一点都不复杂，但是为什么开头还有个`layout`呢？因为它也不是最基本的布局文件，最基本的是`base.html`，我们看一下它的内容。

```html
<!doctype html>
<html>
<head>
  {\% include header.html %}
</head>
<body>
  <div class="container">
    <div class="row">
      {\% include navside.html %}
      <div class="col-md-8 col-lg-8 col-sm-12 col-xs-12 aside3">
        <div id="container">
          <div id="pjax">
            {\{ content }}
          </div>
        </div>
      </div>
    </div>
  </div>
  {\% include footer.html %}
  {\% include googleanalytics.html %}
</body>
</html>
```

这个文件就更像一个HTML文件了，用PHP或者Python写过web应用的人看到`{\% %}`这样的标签应该不陌生，这不就是模板标签嘛。其实Jekyll也是借用了一下模板系统的，官网说明在[这里][3]，看到开头第一句讲的它用了[Liquid][4]了吧。如果Jekyll的文档不能满足你的话，可以去Liquid那里查查。

我解释一下`base.html`中几个标签的功能。

- `{\% include header.html %}` 从`_includes`中把`header.html`包含进来放在这里
- `{\% include navside.html %}` 同上
- `{\{ content }}` 这句的作用是将继承这个Layout的文件中的代码，放在这里

所以再看`page.html`文件就很容易了，它就是把配置项下面的内容，填补到`base.html`中的`{\{ content }}`处形成了一个文件。那么`page.html`中的`{\{ content }}`做什么用呢？因为别人也可以以`page.html`来作为自己的布局文件。

入口文件`index.html`就是这么干的：

```html
layout: page
title: 首页
...
```

这里看到选择了page作为布局文件，那么title干嘛用的呢？其实它是在被包含的`header.html`中被用到了。来看看`header.html`怎么写的：

```html
<meta charset="utf-8">
<title>{\{ page.title }} | {\{ site.title }}</title>
<meta name="author" content="{{ site.author.name }}">
{\% if page.keywords %}
  <meta name="keywords" content="{{ page.keywords }}">
{\% endif %}
{\% if page.description  %}
  <meta name="description " content="{{ page.description  }}">
{\% endif %}

...

```

这里又使用了一些新标签——`{\{ }\}`，这个标签就是用来书写变量的，通过在配置处配置变量，或者使用系统的自定义变量，可以轻松改变页面内的一些元素或者内容。

系统变量查询可以去[这里][5]

其实整个主题书写就是这么简单，如果有不清楚的可以再看看官网的文档。动一动手就非常明白了。

## 插入图片
很多人感觉用Jekyll最不方便的就是插入图片了，其实我也是这么觉得的。所以只能自己去想些办法。

### 图片统一存放
图片我都放在了`/public/upload`下，所以我在插入图片的时候只要用`![xxx](/public/upload/xxx)`就可以了。

## 本地预览及提交
本地预览自己的修改很容易，只要进入`username.github.io`目录，执行

```
jekyll serve
```

然后访问`http://localhost:4000`就OK了，安装Jekyll的方式自行谷歌吧...

自己预览过没有问题以后，就提交到服务端吧，Git三步走

```
git add xxx
git commit -m "xxx"
git push
```

## 其他
我觉得自己的这个主题设定的算是比较好修改和移植的了，如果大家有什么问题，可以尽管问。

另外一些特别的功能，比如三栏、评论、谷歌分析，这些都不难，相信你稍微打开Github读一下这个主题的代码就很快明白了。

代码地址戳[这里][6]。

[2]: http://jekyllrb.com/docs/structure/
[3]: http://jekyllrb.com/docs/templates/
[4]: http://docs.shopify.com/themes/liquid-basics
[5]: http://jekyllrb.com/docs/variables/
[6]: https://github.com/yogykwan/yogykwan.github.io
