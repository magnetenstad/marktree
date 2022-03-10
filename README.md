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

## Configuration

### Configure marktree
Configure marktree by adding a `marktree.config.json` config file. The following are default values.
```json
{
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

### Styling
Add a `styles.css` file to the directory you want to be styled. Styles are also applied all subdirectories.

### Icon
Add a `favicon.ico` file to the directory you want to include the icon. The icon is also applied to all subdirectories.

### YAML
Add file metadata with YAML. THe following attributes are supported
```yaml
---
title:
---
```
