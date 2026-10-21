import { render } from '@testing-library/react';
import { useProject } from 'modules/routes';

import Logos from './Logos';

jest.mock('modules/routes', () => ({ useProject: jest.fn() }));
jest.mock('modules/i18n', () => ({ useI18n: () => ({ t: (key) => key }) }));
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
        logos: [{ id: 12, url: '/logos/de.png' }],
        available_locales: ['de'],
    };
    useProject.mockReturnValue({ project });

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
