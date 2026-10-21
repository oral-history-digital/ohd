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

test('institution logos retain their records and owner without requesting project edit data', () => {
    useProject.mockReturnValue({
        project: { id: 7, logos: [{ id: 99 }], available_locales: ['de'] },
    });
    const data = { 12: { id: 12, src: '/institution.png' } };
    const initialFormValues = {
        institution_id: 9,
        ref_id: 9,
        ref_type: 'Institution',
        type: 'Logo',
    };
    const { getByTestId } = render(
        <Logos data={data} initialFormValues={initialFormValues} />
    );
    const props = JSON.parse(getByTestId('logo-list').textContent);
    expect(useProject.mock.lastCall[0]).toEqual({});
    expect(props.data).toEqual(data);
    expect(props.outerScope).toBe('institution');
    expect(props.outerScopeId).toBe(9);
    expect(props.initialFormValues).toEqual(initialFormValues);
});
