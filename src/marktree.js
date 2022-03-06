import config from '../marktree.config.js'
import { File, Directory } from './files.js'

export default class MarkTree {

  constructor() {
    this.root = Directory.read(config.source);
    this.root.name = config.dest
    link(this.root)
  }

  build() {
    this.root.write()
  }

  config() {
    return config
  }
}

function link(directory, parentDirectory=null) {

  directory.files.forEach((file) => {
    let markdown = `[${directory.name}](./index.md)\n`
    file.data = markdown + file.data
  })

  if (!directory.files.some((file) => file.name === 'index.md')) {
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
    directory.files.push(new File('index.md', markdown))
  }
  
  directory.directories.forEach((dir) => {
    link(dir, directory)
  })
}