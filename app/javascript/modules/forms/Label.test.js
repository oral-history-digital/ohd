import renderer from 'react-test-renderer';

import Label from './Label';

jest.mock('modules/i18n');

it('renders correctly', () => {
    const tree = renderer
        .create(
            <Label
                label="Name"
                className="label"
                htmlFor="input"
            />
        )
        .toJSON();
    expect(tree).toMatchSnapshot();
});

it('renders with translation key', () => {
    const tree = renderer
        .create(
            <Label
                labelKey="label.default_name"
            />
        )
        .toJSON();
    expect(tree).toMatchSnapshot();
});
