import { describe, expect, it } from 'vitest';
import {
  normalizeAnswerValue,
  normalizeMeaningAnswer,
} from '@/shared/utils/meanings';

describe('normalizeAnswerValue', () => {
  it('trims and lowercases', () => {
    expect(normalizeAnswerValue('  Hello  ')).toBe('hello');
  });

  it('composes combining marks', () => {
    expect(normalizeAnswerValue('か\u3099')).toBe('が');
  });

  it('folds full-width Latin and half-width katakana', () => {
    expect(normalizeAnswerValue('  Ｈｅｌｌｏ  ')).toBe('hello');
    expect(normalizeAnswerValue('ＯＫ')).toBe(normalizeAnswerValue('OK'));
    expect(normalizeAnswerValue('ｱﾒﾘｶ')).toBe('アメリカ');
    expect(normalizeAnswerValue('ｶﾞｲｺｸ')).toBe('ガイコク');
  });

  it('removes invisible characters picked up by copy and paste', () => {
    expect(normalizeAnswerValue('\uFEFFame\u200Brica\u200D')).toBe('america');
    expect(normalizeAnswerValue('ア\u2060メリカ')).toBe('アメリカ');
  });

  it('treats non-breaking and ideographic spaces as ordinary spaces', () => {
    expect(normalizeAnswerValue('united\u00A0states')).toBe('united states');
    expect(normalizeAnswerValue('united\u3000 states')).toBe('united states');
  });
});

describe('normalizeMeaningAnswer', () => {
  it('folds the ellipsis character and runs of dots to "..."', () => {
    expect(normalizeMeaningAnswer('well then…')).toBe('well then...');
    expect(normalizeMeaningAnswer('well then...')).toBe('well then...');
    expect(normalizeMeaningAnswer('well then....')).toBe('well then...');
  });

  it('strips an optional leading article or infinitive', () => {
    expect(normalizeMeaningAnswer('a matter')).toBe('matter');
    expect(normalizeMeaningAnswer('to speak')).toBe('speak');
  });

  it('preserves compound prefixes that could change meaning', () => {
    expect(normalizeMeaningAnswer('to the point')).toBe('to the point');
  });
});
