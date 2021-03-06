
export const defaultConfig = {
  "source": "markdown",
  "dest": "docs",
  "htmlLayout": "layout.html",
  "include": [],
  "exclude": [],
  "autoLink": true,
  "cssStyles": "styles.css",
  "icon": "favicon.ico",
  "insertMarkdown": "<!-- insert:markdown -->",
  "insertStyles": "<!-- insert:styles -->",
  "insertTitle": "<!-- insert:title -->",
  "insertIcon": "<!-- insert:icon -->"
}

export const defaultHtmlLayout = 
`<!DOCTYPE html>
<html>

<head>
  <!-- Katex -->
  <link rel="stylesheet" href=
      "https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css">

  <!-- GitHub Markdown Styles -->
  <link rel="stylesheet" href=
      "https://cdn.jsdelivr.net/github-markdown-css/2.2.1/github-markdown.css"/>

  <title><!-- insert:title --></title>
  <link rel="icon" type="image/x-icon" href="<!-- insert:icon -->">

  <!-- Custom Styles -->
  <!-- insert:styles -->
</head>

<body>
<article class="markdown-body">

<!-- insert:markdown -->

</article>
</body>

</html>
`

export const defaultCssStyles =
`.markdown-body {
  box-sizing: border-box;
  min-width: 200px;
  max-width: 980px;
  margin: 0 auto;
  padding: 45px;
}

@media (max-width: 767px) {
  .markdown-body {
    padding: 15px;
  }
}

pre code.hljs{display:block;overflow-x:auto;padding:1em}code.hljs{padding:3px 5px}/*!
  Theme: GitHub
  Description: Light theme as seen on github.com
  Author: github.com
  Maintainer: @Hirse
  Updated: 2021-05-15

  Outdated base version: https://github.com/primer/github-syntax-light
  Current colors taken from GitHub's CSS
*/.hljs{color:#24292e;background:#fff}.hljs-doctag,.hljs-keyword,.hljs-meta .hljs-keyword,.hljs-template-tag,.hljs-template-variable,.hljs-type,.hljs-variable.language_{color:#d73a49}.hljs-title,.hljs-title.class_,.hljs-title.class_.inherited__,.hljs-title.function_{color:#6f42c1}.hljs-attr,.hljs-attribute,.hljs-literal,.hljs-meta,.hljs-number,.hljs-operator,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-id,.hljs-variable{color:#005cc5}.hljs-meta .hljs-string,.hljs-regexp,.hljs-string{color:#032f62}.hljs-built_in,.hljs-symbol{color:#e36209}.hljs-code,.hljs-comment,.hljs-formula{color:#6a737d}.hljs-name,.hljs-quote,.hljs-selector-pseudo,.hljs-selector-tag{color:#22863a}.hljs-subst{color:#24292e}.hljs-section{color:#005cc5;font-weight:700}.hljs-bullet{color:#735c0f}.hljs-emphasis{color:#24292e;font-style:italic}.hljs-strong{color:#24292e;font-weight:700}.hljs-addition{color:#22863a;background-color:#f0fff4}.hljs-deletion{color:#b31d28;background-color:#ffeef0}
`
