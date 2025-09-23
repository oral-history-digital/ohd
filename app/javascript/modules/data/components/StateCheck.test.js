import renderer from 'react-test-renderer';

import StateCheck from './StateCheck';

const mockedState = {
    isTrue: true,
    isFalse: false,
};

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
      .mockImplementation(callback => callback(mockedState))
  }));

it('renders the children if selector returns true', () => {
    const selector = state => state.isTrue;

    const tree = renderer
        .create(
            <StateCheck testSelector={selector}>
                <p>Hello!</p>
            </StateCheck>
        )
        .toJSON();
    expect(tree).toMatchSnapshot();
});

it('renders Spinner component if selector returns false', () => {
    const selector = state => state.isFalse;

    const tree = renderer
        .create(
            <StateCheck testSelector={selector}>
                <p>won't be shown</p>
            </StateCheck>
        )
        .toJSON();
    expect(tree).toMatchSnapshot();
});

it('renders custom fallback', () => {
    const selector = state => state.isFalse;

    const tree = renderer
        .create(
            <StateCheck
                testSelector={selector}
                fallback={<p>Loading...</p>}
            >
                <p>won't be shown</p>
            </StateCheck>
        )
        .toJSON();
    expect(tree).toMatchSnapshot();
});
