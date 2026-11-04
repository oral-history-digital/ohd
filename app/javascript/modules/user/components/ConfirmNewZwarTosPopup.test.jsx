/* eslint-disable react/prop-types */
import { act, render, screen } from '@testing-library/react';
import { submitData, useUmbrellaProject } from 'modules/data';
import { Form } from 'modules/forms';
import { usePathBase, useProject } from 'modules/routes';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import ConfirmNewZwarTosPopup from './ConfirmNewZwarTosPopup';

jest.mock('modules/constants', () => ({
    OHD_DOMAINS: { test: 'https://portal.example' },
}));
jest.mock('modules/data', () => ({
    getCurrentUser: jest.fn(),
    submitData: jest.fn(() => ({ type: 'SAVE_TERMS' })),
    useUmbrellaProject: jest.fn(),
    getProjectBrandName: (project) => project?.name,
}));
jest.mock('modules/routes', () => ({
    useProject: jest.fn(),
    usePathBase: jest.fn(),
}));
jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));
jest.mock('react-router-dom', () => ({ useLocation: jest.fn() }));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({
        locale: 'en',
        t: (key, params) => params?.tos_link || params?.priv_link || key,
    }),
}));
const mockClose = jest.fn();
const mockDispatch = jest.fn();
jest.mock('modules/ui', () => ({
    Modal: ({ children }) => children(mockClose),
}));
jest.mock('modules/forms', () => ({
    Form: jest.fn(({ elements }) => (
        <div>
            {elements.map((element) => (
                <section key={element.attribute}>{element.help}</section>
            ))}
        </div>
    )),
}));

const membership = {
    id: 21,
    project_id: 7,
    created_at: '2023-01-01T00:00:00Z',
    tos_agreement: false,
};

beforeEach(() => {
    jest.clearAllMocks();
    useProject.mockReturnValue({
        project: {
            id: 7,
            shortname: 'za',
            name: 'Projektname',
            archive_domain: null,
        },
    });
    useUmbrellaProject.mockReturnValue({ project: { name: 'Portal' } });
    useSelector.mockReturnValue({ user_projects: { 21: membership } });
    useDispatch.mockReturnValue(mockDispatch);
    usePathBase.mockReturnValue('/za/en');
    useLocation.mockReturnValue({ pathname: '/za/en/searches/archive' });
});

test.each([
    ['za', null, '/za/en', 'https://portal.example/za/en/conditions'],
    [
        'mog',
        'https://project.example',
        '/en',
        'https://project.example/en/conditions',
    ],
])(
    'terms confirmation uses %s display settings, canonical links, and the current save route',
    (shortname, archiveDomain, route, conditions) => {
        useProject.mockReturnValue({
            project: {
                id: 7,
                shortname,
                name: 'Projektname',
                archive_domain: archiveDomain,
            },
        });
        usePathBase.mockReturnValue(route);
        render(<ConfirmNewZwarTosPopup />);
        expect(useProject).toHaveBeenCalledWith({});
        expect(screen.getAllByRole('link').map((link) => link.href)).toEqual([
            'https://portal.example/en/conditions',
            conditions,
            'https://portal.example/en/privacy_protection',
        ]);
        expect(Form.mock.lastCall[0].data).toBe(membership);
        expect(Form.mock.lastCall[0].elements[1].label).toContain(
            shortname === 'za' ? 'ZWAR' : 'MOG'
        );
        const params = {
            user_project: {
                id: 21,
                tos_agreement: true,
                tos_agreement_ohd: true,
                priv_agreement: true,
            },
        };
        act(() => Form.mock.lastCall[0].onSubmit(params));
        expect(submitData).toHaveBeenCalledWith({ pathBase: route }, params);
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'SAVE_TERMS' });
        expect(mockClose).toHaveBeenCalledTimes(1);
    }
);

test.each([
    { isLoading: true },
    { project: { id: 7, shortname: 'za' }, error: { message: 'Denied' } },
    { project: { id: 7, shortname: 'other' } },
])(
    'missing, denied, or unrelated projects do not open the popup (%p)',
    (result) => {
        useProject.mockReturnValue(result);
        render(<ConfirmNewZwarTosPopup />);
        expect(Form).not.toHaveBeenCalled();
    }
);

test.each([
    { ...membership, created_at: '2023-12-12T00:00:00Z' },
    { ...membership, tos_agreement: true },
    { ...membership, project_id: 99 },
])('existing membership eligibility rules remain unchanged (%p)', (access) => {
    useSelector.mockReturnValue({ user_projects: { 21: access } });
    render(<ConfirmNewZwarTosPopup />);
    expect(Form).not.toHaveBeenCalled();
});

test('the conditions page stays accessible while consent is pending', () => {
    useLocation.mockReturnValue({ pathname: '/za/en/conditions' });
    render(<ConfirmNewZwarTosPopup />);
    expect(Form).not.toHaveBeenCalled();
});
