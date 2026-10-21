/* eslint-disable react/prop-types */
import { render, screen } from '@testing-library/react';
import { submitData } from 'modules/data';
import { useProject } from 'modules/routes';
import { useDispatch, useSelector } from 'react-redux';

import { DataList, EditData } from '../../components';
import AffiliateShow from '../../components/AffiliateShow';
import DataDetails from '../../components/DataDetails';
import Logos from '../../components/Logos';
import CooperationPartners from './CooperationPartners';
import EditProjectConfigPage from './EditProjectConfigPage';
import EditProjectDisplayPage from './EditProjectDisplayPage';
import EditProjectInfoPage from './EditProjectInfoPage';
import ExternalLinks from './ExternalLinks';
import Funders from './Funders';
import InstitutionProjects from './InstitutionProjects';
import Leaders from './Leaders';
import Managers from './Managers';
import MediaStreams from './MediaStreams';
import SponsorLogos from './SponsorLogos';

jest.mock(
    '../../components/DataList',
    () => jest.requireMock('../../components').DataList
);
jest.mock('modules/ui', () => ({
    InlineNotification: ({ title, description }) => (
        <p role="alert">
            {title}: {description}
        </p>
    ),
}));
jest.mock('modules/routes', () => ({ useProject: jest.fn() }));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ locale: 'de', t: (key) => key }),
}));
jest.mock('modules/data', () => ({
    useHumanReadable: () => ({ humanReadable: () => '' }),
    submitData: jest.fn(),
    getCurrentUser: jest.fn(),
    getIsLoading: jest.fn(),
    getInstitutions: jest.fn(),
    getStatuses: jest.fn(),
}));
jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));
jest.mock('../../hooks', () => ({
    useAdminDataActions: () => ({
        fetchData: jest.fn(),
        deleteData: jest.fn(),
        submitData: jest.fn(),
    }),
}));
jest.mock('../../components', () => ({
    EditViewOrRedirect: ({ children }) => children,
    EditData: jest.fn(() => <p>Settings</p>),
    DataList: jest.fn(() => <p>Records</p>),
    Logos: () => null,
    AffiliateForm: () => null,
    AffiliateShow: () => null,
}));
jest.mock(
    'modules/auth/AuthShowContainer',
    () =>
        ({ hasProjectAccess, children }) =>
            hasProjectAccess ? children : null
);
jest.mock('./ProjectFaviconForm', () => () => null);
jest.mock('modules/spinners', () => ({
    Spinner: () => <p role="status">Loading</p>,
}));

const project = {
    id: 7,
    available_locales: ['de', 'en'],
    view_modes: ['grid', 'list'],
    upload_types: ['photos'],
    hidden_registry_entry_ids: [3, 9],
    cooperation_partners: [],
    leaders: [],
    managers: [],
    funders: [],
    external_links: [],
    institution_projects: [],
    logos: [],
    sponsor_logos: [],
    media_streams: [],
    translations: [{ id: 30, locale: 'de', name: 'Name' }],
};

beforeEach(() => {
    jest.clearAllMocks();
    useProject.mockReturnValue({ project, isLoading: false });
    useSelector.mockReturnValue({});
    useDispatch.mockReturnValue(jest.fn());
});

test.each([
    [EditProjectInfoPage, { profile: 'edit', include: ['translations'] }],
    [EditProjectConfigPage, { profile: 'edit' }],
    [EditProjectDisplayPage, { profile: 'edit' }],
])(
    'project settings wait for authorized details and save without an optimistic refetch',
    (Page, options) => {
        useProject.mockReturnValue({ isLoading: true });
        const { rerender } = render(<Page />);
        expect(screen.getByRole('status')).toBeInTheDocument();
        expect(EditData).not.toHaveBeenCalled();
        useProject.mockReturnValue({ project, isLoading: false });
        rerender(<Page />);
        expect(useProject).toHaveBeenCalledWith(options);
        const form = EditData.mock.lastCall[0];
        form.submitData(
            { pathBase: '/pilot/de' },
            { project: { id: 7 } },
            { updateStateBeforeSubmit: true },
            jest.fn()
        );
        expect(submitData.mock.lastCall[2].updateStateBeforeSubmit).toBe(false);
    }
);

test.each([
    [CooperationPartners, 'affiliates', 'cooperation_partners'],
    [Leaders, 'affiliates', 'leaders'],
    [Managers, 'affiliates', 'managers'],
    [Funders, 'affiliates', 'funders'],
    [ExternalLinks, 'external_links', 'external_links'],
    [Logos, 'branding', 'logos'],
    [SponsorLogos, 'branding', 'sponsor_logos'],
    [MediaStreams, 'playback', 'media_streams'],
])(
    'nested editor reads its requested include and hides controls after a denied request',
    (Editor, include, field) => {
        const records = [
            {
                id: 12,
                url: '/image.png',
                translations: [{ id: 31, locale: 'de', name: '' }],
            },
        ];
        useProject.mockReturnValue({
            project: { ...project, [field]: records },
        });
        const { rerender } = render(<Editor />);
        expect(useProject).toHaveBeenCalledWith({
            profile: 'edit',
            include: [include],
        });
        expect(DataList.mock.lastCall[0]).toMatchObject({
            data: records,
            outerScopeId: 7,
        });
        useProject.mockReturnValue({ error: { message: 'Access denied.' } });
        rerender(<Editor />);
        expect(screen.getByRole('alert')).toHaveTextContent('Access denied.');
        expect(screen.queryByText('Records')).not.toBeInTheDocument();
    }
);

test('institution assignments display names from the separately loaded institutions', () => {
    useProject.mockReturnValue({
        project: {
            ...project,
            institution_projects: [
                { id: 8, institution_id: 4, primary: false },
            ],
        },
    });
    useSelector.mockReturnValue({
        4: { name: { de: 'Institution' }, shortname: 'inst' },
    });
    render(<InstitutionProjects />);
    expect(DataList.mock.lastCall[0].data).toEqual([
        {
            id: 8,
            institution_id: 4,
            primary: false,
            name: { de: 'Institution' },
            shortname: 'inst',
        },
    ]);
});

test.each([
    [
        { name_type: 'Personal', first_name: 'Ada', last_name: 'Lovelace' },
        'Ada Lovelace',
    ],
    [
        { name_type: 'Organizational', name: { de: 'Institution' } },
        'Institution',
    ],
])(
    'affiliate names support localized strings and legacy locale maps',
    (data, name) => {
        render(<AffiliateShow data={data} />);
        expect(screen.getByText(name)).toBeInTheDocument();
    }
);

test('configuration adapts array setters locally without requesting sensitive fields again', () => {
    render(<EditProjectConfigPage />);
    const form = EditData.mock.lastCall[0];
    expect(form.data).toMatchObject({
        pseudo_available_locales: 'de, en',
        pseudo_hidden_registry_entry_ids: '3, 9',
    });
    expect(form.sensitiveAttributes).toBeUndefined();
    expect(project).not.toHaveProperty('pseudo_available_locales');
});

test.each([{ url: '/api-logo.png' }, { src: '/legacy-logo.png' }])(
    'image details display current and legacy asset URLs',
    (data) => {
        render(
            <DataDetails data={data} scope="logo" detailsAttributes={['src']} />
        );
        expect(screen.getByRole('presentation')).toHaveAttribute(
            'src',
            data.url || data.src
        );
    }
);
