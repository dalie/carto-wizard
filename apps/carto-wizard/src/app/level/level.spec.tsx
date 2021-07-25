import { render } from '@testing-library/react';

import Level from './level';

describe('Level', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Level />);
    expect(baseElement).toBeTruthy();
  });
});
