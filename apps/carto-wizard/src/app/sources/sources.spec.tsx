import { render } from '@testing-library/react';

import Sources from './sources';

describe('Sources', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Sources />);
    expect(baseElement).toBeTruthy();
  });
});
