/* Keep legal pages in the same locally selected light/dark theme as the portfolio. */
(() => {
  const key = 'anas-portfolio-theme'
  const root = document.documentElement
  const get = () => { try { return localStorage.getItem(key) === 'light' ? 'light' : 'dark' } catch { return 'dark' } }
  const apply = (theme) => { root.dataset.theme = theme; root.style.colorScheme = theme }
  apply(get())
  window.addEventListener('storage', event => { if (event.key === key) { apply(get()); updateButton() } })
  function updateButton() {
    const button = document.querySelector('.legal-theme-toggle')
    if (!button) return
    const light = root.dataset.theme === 'light'
    button.textContent = light ? '◐  Mode sombre' : '☼  Mode clair'
    button.setAttribute('aria-label', light ? 'Activer le mode sombre' : 'Activer le mode clair')
    button.setAttribute('aria-pressed', String(light))
  }
  window.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header')
    if (!header) return
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'legal-theme-toggle'
    header.append(button)
    button.addEventListener('click', () => {
      const next = root.dataset.theme === 'light' ? 'dark' : 'light'
      try { localStorage.setItem(key, next) } catch { /* optional */ }
      apply(next)
      updateButton()
    })
    updateButton()
  })
})()
