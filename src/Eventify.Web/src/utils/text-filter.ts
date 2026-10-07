const normalize = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

/** Case- and accent-insensitive "contains" match, e.g. "forro" matches "Forró". */
export const accentInsensitiveFilter = (label: string, query: string): boolean =>
  normalize(label).includes(normalize(query.trim()));
