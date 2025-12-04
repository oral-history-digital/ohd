import { renderToStaticMarkup } from 'react-dom/server';

import { StateCheck } from './StateCheck';

const mockedState = {
    isTrue: true,
    isFalse: false,
};

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest
        .fn()
        .mockImplementation((callback) => callback(mockedState)),
}));

it('renders the children if selector returns true', () => {
    const selector = (state) => state.isTrue;

    const html = renderToStaticMarkup(
        <StateCheck testSelector={selector}>
            <p>Hello!</p>
        </StateCheck>
    );
    expect(html).toMatchSnapshot();
});

it('renders Spinner component if selector returns false', () => {
    const selector = (state) => state.isFalse;

    const html = renderToStaticMarkup(
        <StateCheck testSelector={selector}>
            <p>won&#39;t be shown</p>
        </StateCheck>
    );
    expect(html).toMatchSnapshot();
});

it('renders custom fallback', () => {
    const selector = (state) => state.isFalse;

    const html = renderToStaticMarkup(
        <StateCheck testSelector={selector} fallback={<p>Loading...</p>}>
            <p>won&#39;t be shown</p>
        </StateCheck>
    );
    expect(html).toMatchSnapshot();
});
