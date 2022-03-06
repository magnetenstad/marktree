import fs from 'fs';

export { File, Directory }

class File {
  constructor(name, data) {
    this.name = name
    this.data = data
  }

  write(path='') {
    path += path === '' ? this.name : '//' + this.name
    console.log(`Write ${path}`)
    fs.writeFileSync(path, this.data)
  }

  static read(name) {
    const data = fs.readFileSync(name, 'utf8')
    return new File(name, data)
  }
}

class Directory {
  constructor(name) {
    this.name = name
    this.files = []
    this.directories = []
  }

  write(path='') {
    path += path === '' ? this.name : '//' + this.name
    console.log(path);
    fs.mkdir(path, () => {})
    console.log(this.files);
    console.log(this.directories);
    this.files.forEach((file) => {
      file.write(path)
    })
    this.directories.forEach((directory) => {
      directory.write(path)
    })
  }

  static read(dirname) {
    const directory = new Directory(dirname)
    const files = fs.readdirSync(dirname)
    files.forEach((filename) => {
      const path = dirname + '\\' + filename
      if (!filename.includes('.')) {
        const subDirectory = Directory.read(path)
        subDirectory.name = filename
        directory.directories.push(subDirectory)
      } else {
        const file = File.read(path)
        file.name = filename
        directory.files.push(file)
      }
    })
    return directory
  }
}
