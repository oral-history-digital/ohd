import React from 'react';

import App from 'bundles/archive/startup/App';
import { shallow } from 'enzyme';

describe('First React component test with Enzyme', () => {
    it('renders without crashing', () => {
        shallow(<App />);
    });
});
