import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ChatbotPage from '../../pages/ChatbotPage';

vi.mock('../../components/ChatWidget', () => ({
  default: () => <div data-testid="chat-widget">ChatWidget</div>,
}));

// Chat page tests validate visible guidance and quick-link navigation text.
describe('ChatbotPage', () => {
  it('renders helper panel, prompts, and quick links', () => {
    render(
      <MemoryRouter>
        <ChatbotPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Travel Helper' })).toBeInTheDocument();
    expect(screen.getByTestId('chat-widget')).toBeInTheDocument();
    expect(screen.getByText('Plan a journey')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Reserve parking' })).toHaveAttribute('href', '/booking');
  });
});
