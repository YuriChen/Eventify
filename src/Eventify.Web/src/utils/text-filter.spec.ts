import { accentInsensitiveFilter } from './text-filter';

describe('accentInsensitiveFilter', () => {
  it('should match a label with accents when the query has none', () => {
    expect(accentInsensitiveFilter('Eletrônica', 'eletronica')).toBe(true);
    expect(accentInsensitiveFilter('Forró', 'FORRO')).toBe(true);
  });

  it('should match a label without accents when the query has them', () => {
    expect(accentInsensitiveFilter('Sao Paulo', 'são')).toBe(true);
  });

  it('should match a partial query anywhere in the label', () => {
    expect(accentInsensitiveFilter('Música Brasileira', 'brasil')).toBe(true);
  });

  it('should ignore surrounding whitespace in the query', () => {
    expect(accentInsensitiveFilter('House', '  hou ')).toBe(true);
  });

  it('should not match when the query is not in the label', () => {
    expect(accentInsensitiveFilter('House', 'techno')).toBe(false);
  });
});
