import { render } from '@testing-library/react';

import LevelSelect from './level-select';

describe('LevelSelect', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LevelSelect />);
    expect(baseElement).toBeTruthy();
  });
});
