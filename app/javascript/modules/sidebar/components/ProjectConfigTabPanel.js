import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { PermissionSearchFormContainer,
    RoleSearchFormContainer, TaskTypeSearchFormContainer,
} from 'modules/admin';
import { pathBase } from 'modules/routes';
import { admin } from 'modules/auth';
import { t } from 'modules/i18n';
import SubTab from './SubTab';

class ProjectConfigTabPanel extends Component {
    static propTypes = {
        countryKeys: PropTypes.object.isRequired,
        locale: PropTypes.string.isRequired,
        translations: PropTypes.object.isRequired,
        projectId: PropTypes.string.isRequired,
        account: PropTypes.object.isRequired,
        editView: PropTypes.bool.isRequired,
    }

    render() {
        return admin(this.props, {type: 'General'}, 'edit') ?
            (<Fragment>
                <h3 className='SidebarTabs-title'>
                    { t(this.props, 'edit.project.admin') }
                </h3>
                <div className='flyout-sub-tabs-container'>
                    <SubTab
                        title='edit.project.info'
                        url={`${pathBase(this.props)}/project/edit-info`}
                        obj={{type: 'Project'}}
                        action='update'
                    />
                    <SubTab
                        title='edit.project.config'
                        url={`${pathBase(this.props)}/project/edit-config`}
                        obj={{type: 'Project'}}
                        action='update'
                    />
                    <SubTab
                        title='edit.project.display'
                        url={`${pathBase(this.props)}/project/edit-display`}
                        obj={{type: 'Project'}}
                        action='update'
                    />
                    <SubTab
                        title='edit.metadata_field.admin'
                        url={`${pathBase(this.props)}/metadata_fields`}
                        obj={{type: 'Project'}}
                        action='update'
                    />
                    <SubTab
                        title='edit.role.admin'
                        url={`${pathBase(this.props)}/roles`}
                        obj={{type: 'Role'}}
                        action='update'
                    >
                        <RoleSearchFormContainer/>
                    </SubTab>
                    <SubTab
                        title='edit.permission.admin'
                        url={`${pathBase(this.props)}/permissions`}
                        obj={{type: 'Permission'}}
                        action='update'
                    >
                        <PermissionSearchFormContainer/>
                    </SubTab>
                    <SubTab
                        title='edit.task_type.admin'
                        url={`${pathBase(this.props)}/task_types`}
                        obj={{type: 'TaskType'}}
                        action='update'
                    >
                        <TaskTypeSearchFormContainer/>
                    </SubTab>
                </div>
            </Fragment>) :
            null;
    }
}

export default ProjectConfigTabPanel;
