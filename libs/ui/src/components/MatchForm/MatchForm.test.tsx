import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MatchForm from './MatchForm';

describe('<MatchForm />', () => {
  test('it should mount', () => {
    render(<MatchForm callback={(advA, advB, result) => {
      console.log(advA, advB, result);
      return Promise.resolve(new Response());
    }} />);

    const matchForm = screen.getByTestId('MatchForm');

    expect(matchForm).toBeInTheDocument();
  });
});