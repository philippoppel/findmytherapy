#!/usr/bin/env tsx

import { chromium } from 'playwright'

async function main() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  await page.goto('https://www.psyonline.at/psychotherapeutinnen-schnellsuche', { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)

  const analysis = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('input[type="submit"], button[type="submit"], button'))
    return {
      buttons: buttons.map(btn => ({
        tag: btn.tagName,
        type: (btn as any).type,
        name: (btn as any).name,
        value: (btn as any).value,
        text: btn.textContent?.trim(),
        id: btn.id,
        form: btn.closest('form')?.id
      })),
      forms: Array.from(document.querySelectorAll('form')).map(form => ({
        id: form.id,
        action: form.action,
        method: form.method,
        inputCount: form.querySelectorAll('input').length
      }))
    }
  })

  console.log('=== FORMS ===')
  analysis.forms.forEach((f, i) => {
    console.log(`${i+1}. Form id="${f.id}" action="${f.action}" method="${f.method}" inputs=${f.inputCount}`)
  })

  console.log('\n=== BUTTONS/SUBMITS ===')
  analysis.buttons.forEach((b, i) => {
    console.log(`${i+1}. <${b.tag}> type="${b.type}" name="${b.name}" value="${b.value}" text="${b.text}"`)
  })

  await browser.close()
}

main().catch(console.error)
