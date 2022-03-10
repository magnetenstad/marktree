import { File, Directory } from 'virtual-file-system'
import MarkdownIt from 'markdown-it'
import MarkdownKatex from '@iktakahiro/markdown-it-katex'
import MarkdownHighlight from 'markdown-it-highlightjs'
import { defaultConfig, defaultHtmlLayout, defaultCssStyles }
    from './default.js'
import metadataParser from 'markdown-yaml-metadata-parser'

export { buildMarktree }

const config = defaultConfig
const configFile = File.read('marktree.config.json')
if (configFile) {
  Object.assign(config, JSON.parse(configFile.data))
}
const md = new MarkdownIt();
md.use(MarkdownKatex, {"throwOnError" : false, "errorColor" : " #cc0000"});
md.use(MarkdownHighlight, { inline: true });

function buildMarktree() {
  console.log('Starting build...')
  const mdDirectory = Directory.read(config.source);
  console.log('[Read] ' + mdDirectory.toString());
  editMarkdown(mdDirectory)
  console.log('Edited markdown')
  const htmlDirectory = buildHtml(mdDirectory)
  htmlDirectory.name = config.dest
  console.log('Rendered html')
  htmlDirectory.write()
  console.log('[Write] ' + htmlDirectory.toString());
  console.log('Successfully finished building!');
}

function editMarkdown(directory) {
  if (!directory.getFile(config.htmlLayout)) {
    directory.files.push(new File(config.htmlLayout, defaultHtmlLayout))
  }
  if (!directory.getFile(config.cssStyles)) {
    directory.files.push(new File(config.cssStyles, defaultCssStyles))
  }
  readMetadata(directory)
  linkMarkdown(directory)
}

/**
 * 
 * @param {Directory} mdDirectory 
 * @param {*} htmlLayout 
 * @param {*} cssStyles 
 * @returns 
 */
function buildHtml(mdDirectory, htmlLayout=null, cssStyles=[], icon=null) {
  // Create a new directory
  const htmlDirectory = new Directory(mdDirectory.name)

  // Get htmlLayout and cssStyles
  const newLayout = mdDirectory.getFile(config.htmlLayout)
  if (newLayout) {
    htmlLayout = newLayout.data
  }
  const newStyles = mdDirectory.getFile(config.cssStyles)
  if (newStyles) {
    cssStyles = [...cssStyles, newStyles]
  }
  const newIcon = mdDirectory.getFile(config.icon)
  if (newIcon) {
    icon = newIcon.name
  }

  // Copy files to new directory
  mdDirectory.files.forEach((file) => {
    if (file.name.endsWith('.html')) return
    // Markdown files are converted to html
    if (file.name.endsWith('.md')) {
      const data = file.data.replaceAll('.md)', '.html)')
      const htmlRender = md.render(data)
      let htmlStyles = ''
      cssStyles.forEach((style) => {
        htmlStyles += `<link rel="stylesheet" href="${style}">\n`
      })
      console.log(file.metadata)
      // Inserts
      const htmlData = htmlLayout
          .replaceAll(config.insertMarkdown, htmlRender)
          .replaceAll(config.insertStyles, htmlStyles)
          .replaceAll(config.insertTitle, 
              file.metadata.title ? file.metadata.title : config.title)
          .replaceAll(config.insertIcon, icon)
      const htmlFile = new File(file.name.replaceAll('.md', '.html'), htmlData)
      htmlFile.metadata = file.metadata
      htmlDirectory.files.push(htmlFile)
    } else {
      htmlDirectory.files.push(new File(file.name, file.data))
    }
  })

  // Recursively create html subdirectories
  const subDirectoryStyles = []
  cssStyles.forEach((style) => {
    subDirectoryStyles.push('../' + style)
  })
  icon = '../' + icon
  mdDirectory.directories.forEach((mdSubDir) => {
    htmlDirectory.directories.push(
        buildHtml(mdSubDir, htmlLayout, subDirectoryStyles, icon))
  })

  return htmlDirectory
}


/**
 * 
 * @param {Directory} directory 
 * @param {Directory} parentDirectory 
 */
function linkMarkdown(directory, parentDirectory=null) {
  // Create link to directory index.md
  directory.files.forEach((file) => {
    if (file.name === 'index.md' || !file.name.endsWith('.md')) return
    file.data = `↩️ [${directory.name}](./index.md)\n` + file.data
  })

  // Get existing index.md
  let indexFile = directory.getFile('index.md')
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

  // Add index.md (back) to directory
  if (indexFile) {
    indexFile.data = indexMd + indexData
  } else {
    indexFile = new File('index.md', indexMd + indexData)
  }
  directory.files.push(indexFile)
  
  // Recursively link subdirectories
  directory.directories.forEach((subDirectory) => {
    linkMarkdown(subDirectory, directory)
  })
}

function readMetadata(directory) {
  // Read metadata
  directory.files.forEach((file) => {
    if (file.name.endsWith('.md')) {
      const result = metadataParser(file.data)
      file.data = result.content
      file.metadata = result.metadata
    }
  })
  
  // Recursively read metadata in subdirectories
  directory.directories.forEach((subDirectory) => {
    readMetadata(subDirectory)
  })
}
