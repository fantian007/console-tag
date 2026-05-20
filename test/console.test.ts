import { describe, it, expect } from 'vitest';
import { getConsole } from '../src/helpers/console';

describe('getConsole', () => {
  it('returns styled console args', () => {
    const result = getConsole('key', 'val');
    expect(result).toHaveLength(3);
    expect(result[0]).toBe('%c key %cval');
    expect(result[1]).toContain('background:#363636');
    expect(result[2]).toContain('background:#175e9c');
  });

  it('accepts custom colors', () => {
    const result = getConsole('k', 'v', { keyBgColor: '#fff', valBgColor: '#000' });
    expect(result[1]).toContain('background:#fff');
    expect(result[2]).toContain('background:#000');
  });

  it('handles empty values', () => {
    const result = getConsole('k', '');
    expect(result[0]).toBe('%c k %c');
  });
});
