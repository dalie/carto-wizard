import { render } from '@testing-library/react';

import CurrentChoices from './current-choices';

describe('CurrentChoices', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CurrentChoices />);
    expect(baseElement).toBeTruthy();
  });
});
