import { fireEvent, render, screen } from '@testing-library/react';

import ProjectFaviconForm from './ProjectFaviconForm';

jest.mock('modules/i18n', () => ({
    useI18n: () => ({ t: (key) => key }),
}));
jest.mock('modules/data', () => ({ receiveData: jest.fn() }));
jest.mock('modules/routes', () => ({ usePathBase: () => '/ohd/de' }));
jest.mock('react-redux', () => ({
    connect: () => (Component) => Component,
    useDispatch: () => jest.fn(),
}));

test('uses the reusable file input for the favicon', () => {
    render(<ProjectFaviconForm project={{ id: 1 }} />);

    expect(
        screen.getByLabelText('activerecord.attributes.project.favicon')
    ).toHaveAttribute(
        'accept',
        '.ico,image/png,image/x-icon,image/vnd.microsoft.icon'
    );
    expect(
        screen.getByText('edit.project.favicon.description')
    ).toBeInTheDocument();
    expect(
        screen.queryByRole('button', { name: 'submit' })
    ).not.toBeInTheDocument();
});

test('only shows submit after a valid favicon is selected', () => {
    render(<ProjectFaviconForm project={{ id: 1 }} />);
    const file = new File(['favicon'], 'favicon.png', { type: 'image/png' });

    fireEvent.change(
        screen.getByLabelText('activerecord.attributes.project.favicon'),
        { target: { files: [file] } }
    );

    expect(screen.getByRole('button', { name: 'submit' })).toBeInTheDocument();
});

test('returns to the empty state after all selected files are discarded', () => {
    render(<ProjectFaviconForm project={{ id: 1 }} />);
    const file = new File(['favicon'], 'favicon.png', { type: 'image/png' });

    fireEvent.change(
        screen.getByLabelText('activerecord.attributes.project.favicon'),
        { target: { files: [file] } }
    );

    fireEvent.click(
        screen.getByRole('button', {
            name: 'file_input.discard: favicon.png',
        })
    );

    expect(screen.getByText('file_input.instruction')).toBeInTheDocument();
    expect(
        screen.queryByRole('button', { name: 'file_input.replace' })
    ).not.toBeInTheDocument();
    expect(
        screen.queryByRole('button', { name: 'submit' })
    ).not.toBeInTheDocument();
});

test('uses the shared dialog pattern to confirm favicon removal', () => {
    render(
        <ProjectFaviconForm project={{ id: 1, favicon_url: '/favicon.png' }} />
    );

    fireEvent.click(
        screen.getByRole('button', {
            name: 'edit.project.favicon.remove: favicon',
        })
    );

    expect(screen.getByRole('dialog')).toHaveTextContent(
        'edit.project.favicon.remove_warning'
    );

    fireEvent.click(screen.getByTestId('cancel-button'));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
