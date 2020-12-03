import React from 'react';
import renderer from 'react-test-renderer';

import Spinner from './Spinner';

it('renders correctly', () => {
    const tree = renderer
        .create(
            <Spinner
                className="spinner"
                style={{ margin: '1rem' }}
            />
        )
        .toJSON();
    expect(tree).toMatchSnapshot();
});

it('renders padding CSS class', () => {
    const tree = renderer
        .create(
            <Spinner withPadding />
        )
        .toJSON();
    expect(tree).toMatchSnapshot();
});
