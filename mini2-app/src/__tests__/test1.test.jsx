import { render, screen } from '@testing-library/react';
import Test1 from '../test1.jsx';
import '@testing-library/jest-dom';
import React from 'react';

describe('Test1', () => {
  it('renders the heading h1', () => {
    render(<Test1 />);
    const heading = screen.getByRole('heading', { name: /Teste/i });
    expect(heading).toBeInTheDocument();
  });
});
