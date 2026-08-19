import { describe, it, expect } from 'vitest';
import {
  isEditable,
  cleanText,
  getSections,
  getSectionBySlug,
  getProjectBySlug,
  getSectionData,
} from './content';

describe('content helpers', () => {
  it('detects editable placeholders', () => {
    expect(isEditable('__EDITABLE__ replace me')).toBe(true);
    expect(isEditable('real content')).toBe(false);
    expect(isEditable(null)).toBe(false);
    expect(isEditable(42)).toBe(false);
  });

  it('strips the editable marker', () => {
    expect(cleanText('__EDITABLE__ hello')).toBe('hello');
    expect(cleanText('plain')).toBe('plain');
    expect(cleanText(123)).toBe(123);
  });

  it('exposes exactly ten ordered sections', () => {
    const sections = getSections();
    expect(sections).toHaveLength(10);
    expect(sections[0].slug).toBe('projects');
    expect(sections.map((s) => s.index)).toEqual([
      '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
    ]);
    // Every section has a full atmosphere for the reactive background.
    for (const s of sections) {
      expect(s.atmosphere).toMatchObject({
        accent: expect.any(String),
        from: expect.any(String),
        to: expect.any(String),
      });
    }
  });

  it('finds sections and projects by slug', () => {
    expect(getSectionBySlug('photography').title).toBe('Photography');
    expect(getSectionBySlug('nope')).toBeNull();
    expect(getProjectBySlug('redactame').title).toBe('Redactame');
    expect(getProjectBySlug('missing')).toBeNull();
  });

  it('returns section data by slug', () => {
    expect(getSectionData('languages')).toHaveProperty('languages');
    expect(getSectionData('projects')).toHaveProperty('projects');
    expect(getSectionData('unknown')).toBeNull();
  });
});
