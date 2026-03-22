import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccessibilityPage from '../../pages/AccessibilityPage';

// We mock the hook so these tests stay focused on page wiring, not context internals.
const mockSetFontSize = vi.fn();
const mockToggleHighContrast = vi.fn();
const mockToggleScreenReader = vi.fn();
const mockToggleReduceMotion = vi.fn();
const mockToggleStepFree = vi.fn();
const mockResetAccessibility = vi.fn();

vi.mock('../../context/AccessibilityContext', () => ({
  useAccessibility: () => ({
    fontSize: 16,
    highContrast: false,
    screenReader: false,
    reduceMotion: false,
    stepFree: false,
    setFontSize: mockSetFontSize,
    toggleHighContrast: mockToggleHighContrast,
    toggleScreenReader: mockToggleScreenReader,
    toggleReduceMotion: mockToggleReduceMotion,
    toggleStepFree: mockToggleStepFree,
    resetAccessibility: mockResetAccessibility,
  }),
}));

describe('AccessibilityPage', () => {
  beforeEach(() => {
    mockSetFontSize.mockReset();
    mockToggleHighContrast.mockReset();
    mockToggleScreenReader.mockReset();
    mockToggleReduceMotion.mockReset();
    mockToggleStepFree.mockReset();
    mockResetAccessibility.mockReset();
  });

  it('renders accessibility controls', () => {
    render(<AccessibilityPage />);

    expect(screen.getByRole('heading', { name: 'Accessibility Settings' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Decrease font size' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Increase font size' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enable High Contrast' })).toBeInTheDocument();
  });

  it('invokes action handlers when controls are clicked', async () => {
    const user = userEvent.setup();
    render(<AccessibilityPage />);

    await user.click(screen.getByRole('button', { name: 'Decrease font size' }));
    await user.click(screen.getByRole('button', { name: 'Increase font size' }));
    await user.click(screen.getByRole('button', { name: 'Enable High Contrast' }));
    await user.click(screen.getByRole('button', { name: 'Enable Assistive Reading' }));
    await user.click(screen.getByRole('button', { name: 'Enable Reduced Motion' }));
    await user.click(screen.getByRole('button', { name: 'Enable Step-Free Filter' }));
    await user.click(screen.getByRole('button', { name: 'Reset to Defaults' }));

    expect(mockSetFontSize).toHaveBeenCalledTimes(2);
    expect(mockToggleHighContrast).toHaveBeenCalledTimes(1);
    expect(mockToggleScreenReader).toHaveBeenCalledTimes(1);
    expect(mockToggleReduceMotion).toHaveBeenCalledTimes(1);
    expect(mockToggleStepFree).toHaveBeenCalledTimes(1);
    expect(mockResetAccessibility).toHaveBeenCalledTimes(1);
  });
});
