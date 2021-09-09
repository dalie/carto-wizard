import { render } from '@testing-library/react';

import LevelEnd from './level-end';

describe('LevelEnd', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LevelEnd />);
    expect(baseElement).toBeTruthy();
  });
});
