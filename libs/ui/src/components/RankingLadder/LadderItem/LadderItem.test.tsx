import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LadderItem from './LadderItem';

describe('<LadderItem />', () => {
  test('it should mount', () => {
    render(<LadderItem player={{
      id: "Player1",
      rank: 1000
    }}/>);

    const ladderItem = screen.getByTestId('LadderItem');

    expect(ladderItem).toBeInTheDocument();
  });
});