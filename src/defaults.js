import { File } from 'virtual-file-system'

export const defaultConfig =
    JSON.parse(File.read('src/defaults/marktree.config.json').data)
export const defaultHtmlLayout = File.read('src/defaults/layout.html').data
export const defaultCssStyles = File.read('src/defaults/styles.css').data
