import { renderToStaticMarkup } from 'react-dom/server';

import ProjectAccessGrantedCell from './ProjectAccessGrantedCell';

describe('<ProjectAccessGrantedCell />', () => {
    it('counts granted non-OHD user projects', () => {
        const row = {
            original: {
                user_projects: {
                    1: {
                        shortname: 'ohd',
                        workflow_state: 'project_access_granted',
                    },
                    2: {
                        shortname: 'test',
                        workflow_state: 'project_access_granted',
                    },
                    3: {
                        shortname: 'pending',
                        workflow_state: 'project_access_requested',
                    },
                    4: {
                        shortname: 'demo',
                        workflow_state: 'project_access_granted',
                    },
                },
            },
        };

        expect(
            renderToStaticMarkup(<ProjectAccessGrantedCell row={row} />)
        ).toContain('2');
    });
});
