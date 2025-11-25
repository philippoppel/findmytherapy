export type MonitoringContext = {
  location: string;
  extra?: Record<string, unknown>;
};

export function captureError(error: unknown, context: MonitoringContext) {
  if (process.env.NODE_ENV !== 'production') {
    console.error('[monitoring]', context.location, context.extra ?? {}, error);
  }
}
