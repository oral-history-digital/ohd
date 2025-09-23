import renderer from 'react-test-renderer';

import { Spinner } from 'modules/spinners';

it('renders correctly', () => {
    const tree = renderer
        .create(
            <Spinner
                className="my-spinner"
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
