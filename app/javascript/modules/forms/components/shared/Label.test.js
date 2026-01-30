import { renderToStaticMarkup } from 'react-dom/server';

import Label from './Label';

jest.mock('modules/i18n');

it('renders correctly', () => {
    const html = renderToStaticMarkup(
        <Label label="Name" className="label" htmlFor="input" />
    );
    expect(html).toMatchSnapshot();
});

it('renders with translation key', () => {
    const html = renderToStaticMarkup(<Label labelKey="label.default_name" />);
    expect(html).toMatchSnapshot();
});
