import './style.css'
import MarkTree from './marktree'

const app = document.querySelector<HTMLDivElement>('#app')!
const mt = new MarkTree()

app.innerHTML = `
  <h1>Hello Vite!</h1>
  <p>${JSON.stringify(mt.config())}</p>
`
