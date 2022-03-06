import config from '../marktree.config.js'
import { File, Directory } from './files.js'
import MarkdownIt from 'markdown-it'
const md = new MarkdownIt();

export default class MarkTree {

  constructor() {
    this.markdown = Directory.read(config.source);
    console.log('[Read] ' + this.markdown.toString());
    this.markdown.name = config.dest
    link(this.markdown)
  }

  writeMarkdown() {
    this.markdown.write()
  }

  writeHtml() {
    const htmlDirectory = makeHtmlDirectory(this.markdown)
    console.log('[Write] ' + htmlDirectory.toString());
    htmlDirectory.write();
  }

  config() {
    return config
  }
}


/**
 * 
 * @param {Directory} mdDirectory 
 * @param {*} htmlLayout 
 * @param {*} cssStyles 
 * @returns 
 */
function makeHtmlDirectory(mdDirectory, htmlLayout=null, cssStyles=null) {
  // Create a new directory
  const htmlDirectory = new Directory(mdDirectory.name)

  // Get htmlLayout and cssStyles
  const newLayout = mdDirectory.getFile(config.htmlLayout)
  if (newLayout) {
    htmlLayout = newLayout.data
  }
  const newStyles = mdDirectory.getFile(config.cssStyles)
  if (newStyles) {
    cssStyles = newStyles
  } 

  // Copy files to new directory
  mdDirectory.files.forEach((file) => {
    if (file.name.endsWith('.html')) return
    if (file.name.endsWith('.md')) {
      // Markdown files are converted to html
      const htmlRender = md.render(file.data.replaceAll('.md)', '.html)'))
      const htmlStyles = `<link rel="stylesheet" href="${cssStyles}">`
      const htmlData = htmlLayout
          .replaceAll(config.insertMarkdown, htmlRender)
          .replaceAll(config.insertStyles, htmlStyles)
      const htmlFile = new File(file.name.replaceAll('.md', '.html'), htmlData)
      htmlDirectory.files.push(htmlFile)
    } else {
      htmlDirectory.files.push(new File(file.name, file.data))
    }
  })

  // Recursively create html subdirectories
  mdDirectory.directories.forEach((mdSubDir) => {
    htmlDirectory.directories.push(
        makeHtmlDirectory(mdSubDir, htmlLayout, '../' + cssStyles))
  })

  return htmlDirectory
}


/**
 * 
 * @param {Directory} directory 
 * @param {Directory} parentDirectory 
 */
function link(directory, parentDirectory=null) {
  // Create link to directory index.md
  directory.files.forEach((file) => {
    if (file.name === 'index.md' || !file.name.endsWith('.md')) return
    file.data = `↩️ [${directory.name}](./index.md)\n` + file.data
  })

  // Get existing index.md
  const indexFile = directory.getFile('index.md')
  const indexData = indexFile ? indexFile.data : ''
  directory.removeFile(indexFile)
  let indexMd = ''

  // Create link to parent directory index.md
  if (parentDirectory) {
    indexMd += `↩️ [${parentDirectory.name}](../index.md)\n`
  }
  
  // Create header
  indexMd += `\n# ${directory.name}\n\n`

  // Create links to subdirectories
  if (directory.directories.length) {
    indexMd += `### Directories\n`
    directory.directories.forEach((directory) => {
      indexMd += `- [${directory.name}](./${directory.name}/index.md)\n`
    })
  }

  // Create links to files
  if (directory.files.length) {
    let count = 0
    directory.files.forEach((file) => {
      if (file.name == config.htmlLayout || file.name == config.cssStyles) return
      if (!count) {
        indexMd += `### Files\n`
        count++
      }
      indexMd += `- [${file.name}](${file.name})\n`
    })
  }

  // Add index.md to directory
  directory.files.push(new File('index.md', indexMd + indexData))
  
  // Recursively link subdirectories
  directory.directories.forEach((subDirectory) => {
    link(subDirectory, directory)
  })
}
