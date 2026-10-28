import { render, screen } from '@testing-library/react';
import { ThemeContext } from 'modules/layout/ThemeProvider';
import { Spinner } from 'modules/spinners';
import { renderToStaticMarkup } from 'react-dom/server';

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

it.each([
    ['small', 32],
    ['medium', 96],
    ['large', 128],
    [48, 48],
])('preserves the %s size and accessible loading state', (size, pixels) => {
    render(<Spinner size={size} />);

    const spinner = screen.getByRole('progressbar', {
        name: 'color-ring-loading',
    });
    expect(spinner).toHaveAttribute('aria-busy', 'true');
    expect(spinner.firstElementChild).toHaveStyle({
        width: `${pixels}px`,
        height: `${pixels}px`,
    });
});

it('uses the project primary CSS color with a primary theme fallback and allows overrides', () => {
    const { rerender } = render(
        <ThemeContext.Provider
            value={{ primaryColor: '#123456', secondaryColor: '#654321' }}
        >
            <Spinner />
        </ThemeContext.Provider>
    );
    expect(screen.getByRole('progressbar').firstElementChild).toHaveStyle({
        borderTopColor: 'var(--primary-color, #123456)',
    });

    rerender(<Spinner color="#abcdef" />);
    expect(screen.getByRole('progressbar').firstElementChild).toHaveStyle({
        borderTopColor: '#abcdef',
    });
});

it('preserves wrapper classes, styles and padding', () => {
    render(
        <Spinner
            className="custom-loader"
            style={{ margin: '1rem' }}
            withPadding
        />
    );

    const spinner = screen.getByRole('progressbar');
    expect(spinner).toHaveClass(
        'Spinner',
        'Spinner--withPadding',
        'custom-loader'
    );
    expect(spinner).toHaveStyle({ margin: '1rem' });
});
