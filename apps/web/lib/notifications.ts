type NotificationPayload = Record<string, unknown>

export async function queueNotification(topic: string, payload: NotificationPayload) {
  if (process.env.NODE_ENV !== 'production') {
    console.info('[notifications:queue]', topic, payload)
  }

  // TODO(Worker): Replace with BullMQ job enqueue once worker is connected
  return Promise.resolve()
}
