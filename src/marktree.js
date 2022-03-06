import config from '../marktree.config.js'
import { File, Directory } from './files.js'
import MarkdownIt from 'markdown-it'
const md = new MarkdownIt();
const htmlBase = File.read(config.htmlBase).data

export default class MarkTree {

  constructor() {
    this.markdown = Directory.read(config.source);
    this.markdown.name = config.dest
    link(this.markdown)
  }

  writeMarkdown() {
    this.markdown.write()
  }

  writeHtml() {
    writeHtml(this.markdown)
  }

  config() {
    return config
  }
}

function writeHtml(directory) {
  const htmlDirectory = makeHtmlDirectory(directory)
  htmlDirectory.write();
}

function makeHtmlDirectory(mdDirectory) {
  const htmlDirectory = new Directory(mdDirectory.name)
  mdDirectory.files.forEach((mdFile) => {
    const htmlRender = md.render(mdFile.data.replaceAll('.md)', '.html)'))
    const htmlData = htmlBase.replaceAll(config.htmlReplace, htmlRender)
    const htmlFile = new File(mdFile.name.replaceAll('.md', '.html'), htmlData)
    htmlDirectory.files.push(htmlFile)
  })
  mdDirectory.directories.forEach((mdSubDir) => {
    htmlDirectory.directories.push(makeHtmlDirectory(mdSubDir))
  })
  return htmlDirectory
}

function link(directory, parentDirectory=null) {

  directory.files.forEach((file) => {
    if (file.name === 'index.md') return
    let markdown = `[${directory.name}](./index.md)\n`
    file.data = markdown + file.data
  })

  const indexFile = directory.getFile('index.md')
  const indexData = indexFile ? indexFile.data : ''
  directory.removeFile(indexFile)
  let markdown = ''

  if (parentDirectory) {
    markdown += `[${parentDirectory.name}](../index.md)\n`
  }
  markdown += `\n# ${directory.name}\n\n`

  if (directory.directories.length) {
    markdown += `## Directories\n`
    directory.directories.forEach((directory) => {
      markdown += `[${directory.name}](./${directory.name}/index.md)\n`
    })
  }

  if (directory.files.length) {
    markdown += `## Files\n`
    directory.files.forEach((file) => {
      markdown += `[${file.name}](${file.name})\n`
    })
  }

  directory.files.push(new File('index.md', markdown + indexData))
  
  directory.directories.forEach((dir) => {
    link(dir, directory)
  })
}