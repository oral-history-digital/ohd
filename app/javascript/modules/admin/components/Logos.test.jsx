import { render } from '@testing-library/react';
import { getCurrentProject, getProjectLocales } from 'modules/data';
import { useSelector } from 'react-redux';

import Logos from './Logos';

jest.mock('modules/data', () => ({
    getCurrentProject: jest.fn(),
    getProjectLocales: jest.fn(),
}));
jest.mock('react-redux', () => ({ useSelector: jest.fn() }));
jest.mock('../hooks', () => ({
    useAdminDataActions: () => ({
        fetchData: jest.fn(),
        deleteData: jest.fn(),
        submitData: jest.fn(),
    }),
}));
jest.mock(
    './DataList',
    () =>
        function DataListMock(props) {
            return (
                <output data-testid="logo-list">{JSON.stringify(props)}</output>
            );
        }
);

test('passes current project logos to the list', () => {
    const project = {
        id: 7,
        logos: { 12: { id: 12, src: '/logos/de.png' } },
    };
    useSelector.mockImplementation((selector) => {
        if (selector === getCurrentProject) return project;
        if (selector === getProjectLocales) return { de: 'Deutsch' };
        return null;
    });

    const { getByTestId } = render(<Logos />);
    const props = JSON.parse(getByTestId('logo-list').textContent);

    expect(props.data).toEqual(project.logos);
    expect(props.outerScope).toBe('project');
    expect(props.outerScopeId).toBe(project.id);
    expect(props.initialFormValues).toEqual({
        ref_id: project.id,
        ref_type: 'Project',
        type: 'Logo',
    });
});
