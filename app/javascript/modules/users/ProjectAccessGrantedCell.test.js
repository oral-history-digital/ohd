import { renderToStaticMarkup } from 'react-dom/server';

import ProjectAccessGrantedCell from './ProjectAccessGrantedCell';

describe('<ProjectAccessGrantedCell />', () => {
    it('counts granted projects excluding only the configured umbrella', () => {
        const row = {
            original: {
                user_projects: {
                    1: {
                        shortname: 'shared',
                        is_umbrella: true,
                        workflow_state: 'project_access_granted',
                    },
                    2: {
                        shortname: 'ohd',
                        is_umbrella: false,
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
        ).toBe('<p>2</p>');
    });
});
