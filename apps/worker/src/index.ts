console.log('Worker starting...')
console.log('[worker] Notifications hook initialised (placeholder)')
console.log('[worker] TODO: connect BullMQ queue for email dispatch')

// Placeholder worker implementation
setInterval(() => {
  console.log('Worker is running...')
}, 30000) // Log every 30 seconds

process.on('SIGINT', () => {
  console.log('Worker shutting down...')
  process.exit(0)
})
