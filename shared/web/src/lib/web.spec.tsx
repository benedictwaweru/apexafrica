import { render } from '@testing-library/react';

import Web from './web';

describe('Web', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Web />);
    expect(baseElement).toBeTruthy();
  });
});
