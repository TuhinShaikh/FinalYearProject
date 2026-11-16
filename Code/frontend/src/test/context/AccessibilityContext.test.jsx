import React from 'react';
import { describe, it, beforeEach, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AccessibilityProvider, useAccessibility } from '../../context/AccessibilityContext';

function Probe() {
  const {
    fontSize,
    highContrast,
    setFontSize,
    toggleHighContrast,
    resetAccessibility,
  } = useAccessibility();

  return (
    <div>
      <p data-testid="font-size">{fontSize}</p>
      <p data-testid="high-contrast">{String(highContrast)}</p>
      <button onClick={() => setFontSize((prev) => prev + 2)} type="button">Increase</button>
      <button onClick={toggleHighContrast} type="button">Contrast</button>
      <button onClick={resetAccessibility} type="button">Reset</button>
    </div>
  );
}

describe('AccessibilityContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.className = '';
    document.body.removeAttribute('data-step-free');
  });

  it('updates document state and supports reset', async () => {
    const user = userEvent.setup();

    render(
      <AccessibilityProvider>
        <Probe />
      </AccessibilityProvider>
    );

    expect(screen.getByTestId('font-size')).toHaveTextContent('16');
    await user.click(screen.getByRole('button', { name: 'Increase' }));
    expect(screen.getByTestId('font-size')).toHaveTextContent('18');

    await user.click(screen.getByRole('button', { name: 'Contrast' }));
    expect(screen.getByTestId('high-contrast')).toHaveTextContent('true');
    expect(document.body.classList.contains('a11y-high-contrast')).toBe(true);

    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByTestId('font-size')).toHaveTextContent('16');
    expect(screen.getByTestId('high-contrast')).toHaveTextContent('false');
  });
});
