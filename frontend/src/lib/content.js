// Single source of truth: the repo-root content/ directory, imported directly.
// The same JSON is served by the FastAPI backend, so the SPA and API never drift.
import sections from '@content/sections.json';
import projects from '@content/projects.json';
import aiLab from '@content/ai-lab.json';
import photography from '@content/photography.json';
import skating from '@content/skating.json';
import languages from '@content/languages.json';
import music from '@content/music.json';
import places from '@content/places.json';
import about from '@content/about.json';
import cv from '@content/cv.json';
import contact from '@content/contact.json';

const EDITABLE_MARK = '__EDITABLE__';

/** Detect placeholder content that the owner is meant to replace. */
export function isEditable(value) {
  return typeof value === 'string' && value.startsWith(EDITABLE_MARK);
}

/** Strip the editable marker and return clean display text. */
export function cleanText(value) {
  if (typeof value !== 'string') return value;
  return value.startsWith(EDITABLE_MARK)
    ? value.slice(EDITABLE_MARK.length).trim()
    : value;
}

export const content = {
  sections,
  projects,
  aiLab,
  photography,
  skating,
  languages,
  music,
  places,
  about,
  cv,
  contact,
};

export function getSections() {
  return sections;
}

export function getSectionBySlug(slug) {
  return sections.find((s) => s.slug === slug) || null;
}

export function getProjects() {
  return projects;
}

export function getProjectBySlug(slug) {
  return projects.find((p) => p.slug === slug) || null;
}

export function getFeaturedProjects() {
  return projects.filter((p) => p.featured);
}

/** Resolve content for a section slug (used by generic section pages). */
export function getSectionData(slug) {
  switch (slug) {
    case 'projects':
      return { projects };
    case 'ai-lab':
      return aiLab;
    case 'photography':
      return photography;
    case 'skating':
      return skating;
    case 'languages':
      return languages;
    case 'music':
      return music;
    case 'places':
      return places;
    case 'about':
      return about;
    case 'cv':
      return cv;
    case 'contact':
      return contact;
    default:
      return null;
  }
}
