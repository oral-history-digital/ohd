import { renderToStaticMarkup } from 'react-dom/server';
import BurgerButton from './BurgerButton';

it('renders correctly in closed state', () => {
    const html = renderToStaticMarkup(<BurgerButton onClick={() => {}} />);
    expect(html).toMatchSnapshot();
});

it('renders correctly in open state', () => {
    const html = renderToStaticMarkup(<BurgerButton open onClick={() => {}} />);
    expect(html).toMatchSnapshot();
});
