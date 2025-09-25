import { renderToStaticMarkup } from 'react-dom/server';

import { Spinner } from 'modules/spinners';

it('renders correctly', () => {
    const html = renderToStaticMarkup(
        <Spinner className="my-spinner" style={{ margin: '1rem' }} />
    );
    expect(html).toMatchSnapshot();
});

it('renders padding CSS class', () => {
    const html = renderToStaticMarkup(<Spinner withPadding />);
    expect(html).toMatchSnapshot();
});
