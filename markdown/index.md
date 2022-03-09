
# Welcome to marktree!
marktree is a static site generator, using markdown. It works great with GitHub pages. Thank you for giving it a try!

## Get started
1. Install marktree
```sh
npm i marktree
```
2. Create a `markdown/`-folder and fill it with markdown files
3. Add the build script in `package.json`
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

## Configure marktree
Configure marktree by adding a `marktree.config.json` config file. The following are default values.
```json
{
  "source": "markdown",
  "dest": "docs",
  "htmlLayout": "layout.html",
  "insertMarkdown": "<!-- insert:markdown -->",
  "insertStyles": "<!-- insert:styles -->",
  "cssStyles": "styles.css"
}
```

## Styling
Add a `styles.css` file to the directory you want to be styled. Styles are applied to both files in this directory and all subdirectories.

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
