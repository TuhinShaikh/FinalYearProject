import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import TravelPlanner from '../../pages/TravelPlanner';

vi.mock('axios');

// This suite checks the planner's user flow without requiring live backend calls.
describe('TravelPlanner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads and displays recommended routes', async () => {
    const user = userEvent.setup();
    axios.post.mockResolvedValue({
      data: [
        {
          mode: 'Tube',
          provider: 'TfL',
          estimatedTime: 18,
          cost: 3.2,
          recommended: true,
        },
      ],
    });

    render(<TravelPlanner />);

    await user.click(screen.getByRole('button', { name: 'Get Recommendations' }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Tube' })).toBeInTheDocument();
    });
    expect(screen.getByText(/Provider:/)).toBeInTheDocument();
    expect(screen.getByText('★ Recommended Route')).toBeInTheDocument();
  });
});
