import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BookingAndPaymentPage from '../../pages/BookingAndPaymentPage';

describe('BookingAndPaymentPage', () => {
  it('renders parking dashboard core content', () => {
    render(<BookingAndPaymentPage />);

    expect(screen.getByRole('heading', { name: /Book a space, pay with confidence/i })).toBeInTheDocument();
    expect(screen.getByText(/AI monitors the lot/i)).toBeInTheDocument();
    expect(screen.getByText(/Show every space/i)).toBeInTheDocument();
    expect(screen.getByText(/Only open spaces/i)).toBeInTheDocument();
  }, 15000);
});
