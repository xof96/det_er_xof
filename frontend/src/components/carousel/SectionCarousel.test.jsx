import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SectionCarousel } from './SectionCarousel';
import { getSections } from '../../lib/content';

const sections = getSections();

function setup(activeIndex = 0) {
  const onActiveChange = vi.fn();
  const onEnter = vi.fn();
  render(
    <SectionCarousel
      sections={sections}
      activeIndex={activeIndex}
      onActiveChange={onActiveChange}
      onEnter={onEnter}
    />
  );
  return { onActiveChange, onEnter };
}

describe('SectionCarousel', () => {
  it('renders a listbox with every section as an option', () => {
    setup(0);
    const listbox = screen.getByRole('listbox');
    expect(listbox).toBeInTheDocument();
    // All sections are in the DOM (including the off-screen ones hidden from AT).
    expect(screen.getAllByRole('option', { hidden: true })).toHaveLength(sections.length);
    // The active section is exposed as the selected option.
    const selected = screen.getByRole('option', { selected: true });
    expect(selected).toHaveAttribute('id', `slot-${sections[0].id}`);
  });

  it('advances with the right arrow key', () => {
    const { onActiveChange } = setup(0);
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'ArrowRight' });
    expect(onActiveChange).toHaveBeenCalledWith(1);
  });

  it('goes back with the left arrow key', () => {
    const { onActiveChange } = setup(3);
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'ArrowLeft' });
    expect(onActiveChange).toHaveBeenCalledWith(2);
  });

  it('does not move before the first or past the last section', () => {
    const { onActiveChange } = setup(0);
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'ArrowLeft' });
    expect(onActiveChange).not.toHaveBeenCalled();
  });

  it('opens the active section on Enter', () => {
    const { onEnter } = setup(2);
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Enter' });
    expect(onEnter).toHaveBeenCalled();
    expect(onEnter.mock.calls[0][0].slug).toBe(sections[2].slug);
  });

  it('jumps to a section via the counter dots', () => {
    const { onActiveChange } = setup(0);
    const dots = screen.getAllByRole('tab');
    fireEvent.click(dots[4]);
    expect(onActiveChange).toHaveBeenCalledWith(4);
  });

  it('disables the previous button on the first section', () => {
    setup(0);
    expect(screen.getByLabelText('Previous section')).toBeDisabled();
    expect(screen.getByLabelText('Next section')).toBeEnabled();
  });
});
