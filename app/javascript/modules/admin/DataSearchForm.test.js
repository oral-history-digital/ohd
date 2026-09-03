import { fireEvent, render, screen } from '@testing-library/react';
import { isMobile } from 'modules/user-agent';

import DataSearchForm from './DataSearchForm';

jest.mock('modules/i18n', () => ({
    useI18n: () => ({ t: (key) => key, locale: 'en' }),
}));
jest.mock('modules/routes', () => ({
    useProject: () => ({
        project: { id: 1, shortname: 'test' },
        projectId: 'test',
    }),
}));
jest.mock('modules/user-agent', () => ({
    isMobile: jest.fn(),
}));

const defaultProps = {
    scope: 'collection',
    query: { name: 'existing search' },
    searchableAttributes: [{ attributeName: 'name' }],
    fetchData: jest.fn(),
    hideSidebar: jest.fn(),
    resetQuery: jest.fn(),
    setQueryParams: jest.fn(),
};

function renderDataSearchForm(props = {}) {
    return render(<DataSearchForm {...defaultProps} {...props} />);
}

beforeEach(() => {
    jest.clearAllMocks();
    isMobile.mockReturnValue(false);
});

test('renders the current query value', () => {
    renderDataSearchForm();

    expect(screen.getByRole('textbox')).toHaveValue('existing search');
});

test('updates the scoped query and resets pagination when a field changes', () => {
    renderDataSearchForm();

    fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'new search' },
    });

    expect(defaultProps.setQueryParams).toHaveBeenCalledWith('collections', {
        name: 'new search',
        page: 1,
    });
});

test('fetches with the serialized query on submit', () => {
    renderDataSearchForm();

    fireEvent.submit(screen.getByRole('button', { name: 'search' }));

    expect(defaultProps.fetchData).toHaveBeenCalledWith(
        {
            projectId: 'test',
            locale: 'en',
            project: { id: 1, shortname: 'test' },
        },
        'collections',
        null,
        null,
        'name=existing search'
    );
    expect(defaultProps.hideSidebar).not.toHaveBeenCalled();
});

test('hides the sidebar before submitting on mobile', () => {
    isMobile.mockReturnValue(true);
    renderDataSearchForm();

    fireEvent.submit(screen.getByRole('button', { name: 'search' }));

    expect(defaultProps.hideSidebar).toHaveBeenCalledTimes(1);
});

test('resets the query and reloads unfiltered data on unmount', () => {
    const { unmount } = renderDataSearchForm();

    unmount();

    expect(defaultProps.resetQuery).toHaveBeenCalledWith('collections');
    expect(defaultProps.fetchData).toHaveBeenCalledWith(
        {
            projectId: 'test',
            locale: 'en',
            project: { id: 1, shortname: 'test' },
        },
        'collections',
        null,
        null,
        null
    );
});
