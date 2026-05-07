import http from 'http'
import fs from 'fs'
import path from 'path'

const PORT = 3000
const __dirname = process.cwd()

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url)
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404)
      res.end('Not found')
      return
    }
    
    const ext = path.extname(filePath)
    const mimeTypes = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'text/javascript',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml'
    }
    
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' })
    res.end(data)
  })
})

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
