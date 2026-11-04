/* eslint-disable react/prop-types */
import { fireEvent, render, screen } from '@testing-library/react';
import { useSearchParams } from 'modules/query-string';
import { useProject } from 'modules/routes';
import { useSelector } from 'react-redux';

import ArchiveSearchSorting from './ArchiveSearchSorting';

jest.mock('modules/archive', () => ({ getEditView: jest.fn() }));
jest.mock('react-redux', () => ({ useSelector: jest.fn() }));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ t: (key) => key.split('.').pop() }),
}));
jest.mock('modules/query-string', () => ({ useSearchParams: jest.fn() }));
jest.mock('modules/routes', () => ({ useProject: jest.fn() }));
jest.mock('modules/spinners', () => ({ Spinner: () => <p>Loading</p> }));
jest.mock('modules/ui', () => ({
    InlineNotification: ({ description }) => <p role="alert">{description}</p>,
}));

const project = {
    default_search_order: 'archive_id',
    metadata_fields: Object.freeze([
        { name: 'archive_id', facet_order: 2, use_in_results_list: true },
        { name: 'media_type', facet_order: 3 },
        { name: 'duration', facet_order: 1, use_in_results_table: true },
        { name: 'description', facet_order: 4, use_in_results_list: true },
    ]),
};
let params;

beforeEach(() => {
    jest.clearAllMocks();
    useSelector.mockReturnValue(false);
    useProject.mockReturnValue({ project });
    params = {
        sortBy: 'title',
        sortOrder: 'asc',
        fulltextIsSet: false,
        setSortOrder: jest.fn(),
        setSort: jest.fn(),
        setDefaultSortOptions: jest.fn(),
    };
    useSearchParams.mockImplementation(() => params);
});

test('waits for project settings before applying defaults and reports failed requests', () => {
    params.sortBy = undefined;
    useProject.mockReturnValue({ isLoading: true });
    const { rerender } = render(<ArchiveSearchSorting />);
    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(params.setDefaultSortOptions).not.toHaveBeenCalled();
    expect(useProject).toHaveBeenCalledWith({ include: ['metadata_fields'] });

    useProject.mockReturnValue({ error: { message: 'Access denied' } });
    rerender(<ArchiveSearchSorting />);
    expect(screen.getByRole('alert')).toHaveTextContent('Access denied');
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    expect(params.setDefaultSortOptions).not.toHaveBeenCalled();

    useProject.mockReturnValue({ project });
    rerender(<ArchiveSearchSorting />);
    expect(params.setDefaultSortOptions).toHaveBeenCalledWith(
        'archive_id',
        'asc'
    );
});

test('preserves configured option order, edit-mode options, and fulltext relevance', () => {
    const { rerender } = render(<ArchiveSearchSorting />);
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' });
    expect(
        screen.getAllByRole('option').map((option) => option.textContent)
    ).toEqual(['title', 'duration', 'archive_id', 'random']);
    expect(params.setDefaultSortOptions).not.toHaveBeenCalled();

    params.fulltextIsSet = true;
    useSelector.mockReturnValue(true);
    rerender(<ArchiveSearchSorting />);
    expect(
        screen.getAllByRole('option').map((option) => option.textContent)
    ).toEqual([
        'score',
        'title',
        'duration',
        'archive_id',
        'media_type',
        'random',
    ]);
    expect(project.metadata_fields.map((field) => field.name)).toEqual([
        'archive_id',
        'media_type',
        'duration',
        'description',
    ]);
});

test('keeps the sort direction rules when selecting an option', () => {
    params.fulltextIsSet = true;
    render(<ArchiveSearchSorting />);
    for (const [option, order] of [
        ['duration', 'asc'],
        ['score', 'desc'],
        ['random', undefined],
    ]) {
        fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' });
        fireEvent.click(screen.getByRole('option', { name: option }));
        expect(params.setSort).toHaveBeenLastCalledWith(option, order);
    }
});
