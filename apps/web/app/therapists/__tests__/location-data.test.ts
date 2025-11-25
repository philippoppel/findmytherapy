import {
  buildLocationTokens,
  resolveCoordinatesFromSearch,
  getCityCoordinates,
} from '../location-data';

describe('location-data helpers', () => {
  it('resolves known cities to coordinates', () => {
    const coords = getCityCoordinates('Wien');
    expect(coords).toEqual({ lat: 48.2082, lng: 16.3738 });
  });

  it('derives coordinates from Austrian postal codes', () => {
    const coords = resolveCoordinatesFromSearch('1100');
    expect(coords).toEqual({ lat: 48.2082, lng: 16.3738 });
  });

  it('includes postal hints in location tokens', () => {
    const tokens = buildLocationTokens('Wien', 'Wien · Online');
    expect(tokens).toEqual(expect.arrayContaining(['wien', 'online', '1100']));
  });

  it('returns null when nothing matches', () => {
    expect(resolveCoordinatesFromSearch('9999')).toBeNull();
  });
});
