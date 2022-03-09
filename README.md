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
Add a `styles.css` file to the directory you want to be styled. Styles are also applied all subdirectories.
