import React from 'react';
import renderer from 'react-test-renderer';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import Label from './Label';

const store = createStore(f => f, {
    archive: {
        locale: 'de',
        translations: {
            de: {},
        },
    },
});

it('renders correctly', () => {
    const tree = renderer
        .create(
            <Provider store={store}>
                <Label
                    label="Name"
                    className="label"
                    htmlFor="input"
                />
            </Provider>
        )
        .toJSON();
    expect(tree).toMatchSnapshot();
});

it('renders with translation key', () => {
    const tree = renderer
        .create(
            <Provider store={store}>
                <Label
                    labelKey="label.default_name"
                />
            </Provider>
        )
        .toJSON();
    expect(tree).toMatchSnapshot();
});
