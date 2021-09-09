import { render } from '@testing-library/react';

import CurrentFeature from './current-feature';

describe('CurrentFeature', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CurrentFeature />);
    expect(baseElement).toBeTruthy();
  });
});
