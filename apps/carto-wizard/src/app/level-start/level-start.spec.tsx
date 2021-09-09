import { render } from '@testing-library/react';

import LevelStart from './level-start';

describe('LevelStart', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LevelStart />);
    expect(baseElement).toBeTruthy();
  });
});
