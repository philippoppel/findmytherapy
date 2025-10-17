console.log('Worker starting...')

// Placeholder worker implementation
setInterval(() => {
  console.log('Worker is running...')
}, 30000) // Log every 30 seconds

process.on('SIGINT', () => {
  console.log('Worker shutting down...')
  process.exit(0)
})