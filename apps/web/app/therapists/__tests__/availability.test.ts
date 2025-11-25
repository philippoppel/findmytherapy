import { getAvailabilityMeta } from '../availability';

describe('getAvailabilityMeta', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('flags urgent notes as immediate availability', () => {
    const meta = getAvailabilityMeta('Freie Slots innerhalb von 3 Tagen', true);
    expect(meta.rank).toBe(0);
    expect(meta.label).toContain('Freie Slots');
  });

  it('parses concrete upcoming dates', () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-05-01T12:00:00Z'));
    const meta = getAvailabilityMeta('Erstgespräche ab 20. Mai möglich', true);
    expect(meta.rank).toBe(2);
    expect(meta.nextAvailableDate?.toISOString()).toContain('2024-05-20');
  });

  it('falls back to waitlist when no capacity', () => {
    const meta = getAvailabilityMeta('Auf Warteliste · Kapazität auf Anfrage', false);
    expect(meta.rank).toBeGreaterThanOrEqual(4);
    expect(meta.label).toContain('Warteliste');
  });
});
