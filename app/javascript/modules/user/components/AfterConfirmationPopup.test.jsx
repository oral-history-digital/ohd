import { render, screen } from '@testing-library/react';
import { getCurrentProject, getCurrentUser } from 'modules/data';
import { useSelector } from 'react-redux';

import AfterConfirmationPopup from './AfterConfirmationPopup';

jest.mock('modules/data', () => ({
    getCurrentProject: jest.fn(),
    getCurrentUser: jest.fn(),
}));

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
}));

jest.mock('modules/ui', () => ({
    Modal: ({ children }) => children(jest.fn()),
}));

jest.mock(
    './RequestProjectAccessFormContainer',
    () =>
        function MockRequestProjectAccessForm() {
            return <div>Request project access</div>;
        }
);

describe('AfterConfirmationPopup', () => {
    let user;
    let project;

    beforeEach(() => {
        window.history.replaceState({}, '', '/es');
        project = {
            id: 42,
            is_umbrella: false,
            grant_project_access_instantly: false,
            grant_access_without_login: false,
        };
        user = {
            admin: false,
            pre_register_location: `${location.origin}/es`,
            user_projects: {},
        };
        useSelector.mockImplementation((selector) => {
            if (selector === getCurrentUser) return user;
            if (selector === getCurrentProject) return project;
        });
    });

    afterEach(() => {
        window.history.replaceState({}, '', '/');
        jest.clearAllMocks();
    });

    it('shows the request form for a user without project access', () => {
        render(<AfterConfirmationPopup />);

        expect(screen.getByText('Request project access')).toBeInTheDocument();
    });

    it('does not show the request form for an admin', () => {
        user.admin = true;
        render(<AfterConfirmationPopup />);

        expect(
            screen.queryByText('Request project access')
        ).not.toBeInTheDocument();
    });

    it('does not show the request form for granted access with unaccepted terms', () => {
        user.user_projects = {
            1: {
                project_id: project.id,
                workflow_state: 'project_access_granted',
                tos_agreement: false,
            },
        };
        render(<AfterConfirmationPopup />);

        expect(
            screen.queryByText('Request project access')
        ).not.toBeInTheDocument();
    });

    it('does not treat access to another project as access to the current project', () => {
        user.user_projects = {
            1: {
                project_id: 99,
                workflow_state: 'project_access_granted',
                tos_agreement: false,
            },
        };
        render(<AfterConfirmationPopup />);

        expect(screen.getByText('Request project access')).toBeInTheDocument();
    });

    it('does not show the request form on a different locale URL', () => {
        window.history.replaceState({}, '', '/de');
        render(<AfterConfirmationPopup />);

        expect(
            screen.queryByText('Request project access')
        ).not.toBeInTheDocument();
    });
});
