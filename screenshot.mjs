import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'

const url = process.argv[2] || 'http://localhost:3000'
const dir = './temporary screenshots'
if (!fs.existsSync(dir)) fs.mkdirSync(dir)

const existing = fs.readdirSync(dir).filter(f => f.startsWith('screenshot-')).length

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 })
await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 })
await new Promise(r => setTimeout(r, 3500))

await page.evaluate(() => {
  const pre = document.getElementById('preloader')
  if (pre) pre.style.display = 'none'
  document.querySelectorAll('.reveal-up,.reveal-l,.reveal-r,.reveal-scale,.blur-text').forEach(el => {
    el.classList.add('visible')
    el.style.filter = 'none'
    el.style.opacity = '1'
    el.style.transform = 'none'
  })
  document.querySelectorAll('.split-line-inner,.char-inner,.hero-eyebrow,.hero-tagline,.hero-desc,.hero-actions,.hero-img-box').forEach(el => {
    el.style.opacity = '1'
    el.style.transform = 'none'
  })
})

const sections = ['#hero','#about','#services','#process','#contact','footer']
for (let i = 0; i < sections.length; i++) {
  const sel = sections[i]
  await page.evaluate((s) => { const el = document.querySelector(s); if (el) el.scrollIntoView() }, sel)
  await new Promise(r => setTimeout(r, 400))
  const el = await page.$(sel)
  if (el) {
    const outPath = path.join(dir, `screenshot-${existing + i + 1}.png`)
    await el.screenshot({ path: outPath })
    console.log('Saved:', outPath)
  }
}

await browser.close()
