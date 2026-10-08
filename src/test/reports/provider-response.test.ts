import { describe, expect, it } from 'vitest';
import { providerText } from '../../../api/hint';

describe('AI provider response boundary', () => {
  it('extracts and trims only the expected textual response', () => {
    expect(providerText({choices:[{message:{content:'  Useful hint  '}}]}, ['choices',0,'message','content'])).toBe('Useful hint');
    expect(providerText({candidates:[{content:{parts:[{text:' Hint '}]}}]}, ['candidates',0,'content','parts',0,'text'])).toBe('Hint');
  });
  it('rejects malformed provider content without crashing', () => {
    for (const value of [null, {}, {choices:[{message:{content:{text:'bad'}}}]}, {choices:[{message:{content:123}}]}]) {
      expect(providerText(value,['choices',0,'message','content'])).toBe('');
    }
  });
});
