---
title: Welcome to marktree!
---

# marktree 🔖🌳

marktree is a static site generator, using markdown. It works with GitHub pages out of the box.

## Get started
[create-marktree](https://github.com/magnetenstad/create-marktree) is the quickest way to start a marktree project.

### Doing it manually
1. Install marktree
```sh
npm i marktree
```
2. Create a `markdown/`-folder and fill it with markdown files
3. Add the build script to `package.json`
```diff
"scripts": {
+  "build": "marktree"
},
```
4. Build your site
```sh
npm run build
```
5. Host the contents of `docs/`

### Hot reload
1. Install nodemon
```
npm i nodemon -D
```
2. Add the dev script to `package.json`
```diff
"scripts": {
+  "dev": "nodemon marktree",
   "build": "marktree"
},
```
3. Add the `nodemon.json` config file
```json
{
  "watch": ["src/", "markdown/"],
  "ext": "md, js"
}
```
4. Run dev
```sh
npm run dev
```

## Configure marktree
Configure marktree by adding a `marktree.config.json` config file. The following are default values.
```json
{
  "title": "untitled",
  "source": "markdown",
  "dest": "docs",
  "htmlLayout": "layout.html",
  "cssStyles": "styles.css",
  "icon": "favicon.ico",
  "insertMarkdown": "<!-- insert:markdown -->",
  "insertStyles": "<!-- insert:styles -->",
  "insertTitle": "<!-- insert:title -->",
  "insertIcon": "<!-- insert:icon -->",
}
```

## Styling
Add a `styles.css` file to the directory you want to be styled. Styles are also applied all subdirectories.

## Icon
Add a `favicon.ico` file to the directory you want to include the icon. The icon is also applied to all subdirectories.

## Functionality

### Connections
The links to **Files** and **Directories** above are automatically generated! (if you are viewing this as html)

### Markdown - extended

#### Basic markdown
1. First list item
2. Second item
   - Subitem

*Italics*, **Bold text**

And | tables
--- | ---
of | course.

#### Code highlighting
Both `inline('highlighting')` and 
```js
// Code blocks!
let count = 0;
count++;
console.log(`Count: ${count}`);
```
Enabled by [highlight.js](https://www.npmjs.com/package/highlight.js?activeTab=readme)

#### Maths
Both $\text{inline} + 1 + 2 + 3 + \dots$
and
$$
(\text{equations})^2 - \int_0^1x \: dx
$$
Enabled by [@iktakahiro/markdown-it-katex](https://www.npmjs.com/package/@iktakahiro/markdown-it-katex)

### Images
Here's a gull
![](images/gull.jpg)
