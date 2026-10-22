/* eslint-disable react/prop-types */
import { render, screen } from '@testing-library/react';
import { useSelector } from 'react-redux';

import { useProjectDetail } from '../hooks/useProjectDetail';
import InstitutionTile from './InstitutionTile';

jest.mock('../hooks/useProjectDetail', () => ({ useProjectDetail: jest.fn() }));
jest.mock('react-redux', () => ({ useSelector: jest.fn() }));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ locale: 'de', t: (key) => key }),
}));
jest.mock('modules/routes', () => ({
    LinkOrA: ({ project, children }) => (
        <a href={`/${project.shortname}/de`}>{children}</a>
    ),
}));

const institution = {
    name: { de: 'Institution' },
    collection_ids: [3],
    logos: {},
    institution_projects: [{ id: 2, project_id: 7 }],
};

beforeEach(() => {
    jest.clearAllMocks();
    useSelector.mockReturnValue({
        3: { id: 3, project_id: 7, name: { de: 'Sammlung' } },
    });
});

test('institution relationships link through loaded project details with scalar names', () => {
    useProjectDetail.mockReturnValue({
        project: { id: 7, shortname: 'pilot', name: 'Projekt' },
    });
    render(<InstitutionTile data={institution} />);
    expect(useProjectDetail).toHaveBeenCalledWith(7);
    expect(screen.getByRole('link', { name: 'Projekt' })).toHaveAttribute(
        'href',
        '/pilot/de'
    );
    expect(screen.getByRole('link', { name: 'Sammlung' })).toHaveAttribute(
        'href',
        '/pilot/de'
    );
});

test('unavailable project details cannot produce links from legacy cached data', () => {
    useProjectDetail.mockReturnValue({ isLoading: true });
    const { rerender } = render(<InstitutionTile data={institution} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    useProjectDetail.mockReturnValue({
        project: { shortname: 'pilot', name: 'Projekt' },
        error: { message: 'Denied' },
    });
    rerender(<InstitutionTile data={institution} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
});
