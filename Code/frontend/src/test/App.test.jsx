import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Route-level tests use lightweight page mocks so failures point to router wiring, not page internals.

vi.mock('../pages/BookingAndPaymentPage', () => ({
  default: () => <div>BookingAndPaymentPage</div>,
}));
vi.mock('../pages/transport/Transport', () => ({
  default: () => <div>TransportPage</div>,
}));
vi.mock('../pages/RideOptionsPage', () => ({
  default: () => <div>RideOptionsPage</div>,
}));
vi.mock('../pages/AccessibilityPage', () => ({
  default: () => <div>AccessibilityPage</div>,
}));
vi.mock('../pages/TravelPlanner', () => ({
  default: () => <div>TravelPlanner</div>,
}));
vi.mock('../pages/StatusPage', () => ({
  default: () => <div>StatusPage</div>,
}));
vi.mock('../pages/LoginPage', () => ({
  default: () => <div>LoginPage</div>,
}));
vi.mock('../pages/RegisterUser', () => ({
  default: () => <div>RegisterUser</div>,
}));
vi.mock('../pages/ChatbotPage', () => ({
  default: () => <div>ChatbotPage</div>,
}));

describe('App routes', () => {
  it('shows landing page on root route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Welcome' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue as Guest' })).toBeInTheDocument();
  });

  it('renders each main route component', () => {
    // Table-driven assertions keep route coverage broad without repeating render boilerplate.
    const routeExpectations = [
      ['/booking', 'BookingAndPaymentPage'],
      ['/transport', 'TransportPage'],
      ['/rides', 'RideOptionsPage'],
      ['/accessibility', 'AccessibilityPage'],
      ['/login', 'LoginPage'],
      ['/register', 'RegisterUser'],
      ['/travel', 'TravelPlanner'],
      ['/status', 'StatusPage'],
      ['/help', 'ChatbotPage'],
    ];

    routeExpectations.forEach(([route, expectedText]) => {
      const { unmount } = render(
        <MemoryRouter initialEntries={[route]}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByText(expectedText)).toBeInTheDocument();
      unmount();
    });
  });
});
