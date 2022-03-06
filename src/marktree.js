import config from '../marktree.config.js'
import { Directory } from './files.js'

export default class MarkTree {

  constructor() {
    this.root = Directory.read(config.source);
    this.root.name = config.dest
  }

  build() {
    this.root.write()
  }

  config() {
    return config
  }
}
