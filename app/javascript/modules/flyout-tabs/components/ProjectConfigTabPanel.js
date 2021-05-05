import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import { PermissionSearchFormContainer,
    RoleSearchFormContainer, TaskTypeSearchFormContainer,
} from 'modules/admin';
import { pathBase } from 'modules/routes';
import { admin } from 'modules/auth';
import { t } from 'modules/i18n';
import InterviewDataContainer from './InterviewDataContainer';

class ProjectConfigTabPanel extends Component {
    static propTypes = {
        countryKeys: PropTypes.object.isRequired,
        locale: PropTypes.string.isRequired,
        translations: PropTypes.object.isRequired,
        projectId: PropTypes.string.isRequired,
        account: PropTypes.object.isRequired,
        editView: PropTypes.bool.isRequired,
    }

    subTab(title, content, url, obj, condition = true) {
        return (admin(this.props, obj, 'update') && condition) ?
            (<div className='flyout-sub-tabs-container flyout-video'>
                <InterviewDataContainer
                    title={t(this.props, title)}
                    content={content}
                    url={url}
                    open={false}
                />
            </div>) :
            null;
    }

    render() {
        return admin(this.props, {type: 'General'}, 'edit') ?
            (<Fragment>
                <div className='flyout-tab-title'>
                    { t(this.props, 'edit.project.admin') }
                </div>
                <div className='flyout-sub-tabs-container'>
                    {this.subTab(
                        'edit.project.info',
                        'description',
                        `${pathBase(this.props)}/project/edit-info`,
                        {type: 'Project', action: 'update'}
                    )}
                    {this.subTab(
                        'edit.project.config',
                        'description',
                        `${pathBase(this.props)}/project/edit-config`,
                        {type: 'Project', action: 'update'}
                    )}
                    {this.subTab(
                        'edit.project.display',
                        'description',
                        `${pathBase(this.props)}/project/edit-display`,
                        {type: 'Project', action: 'update'}
                    )}
                    {this.subTab(
                        'edit.metadata_field.admin',
                        'description',
                        `${pathBase(this.props)}/metadata_fields`,
                        {type: 'Project', action: 'update'}
                    )}
                    {this.subTab(
                        'edit.role.admin',
                        <RoleSearchFormContainer/>,
                        `${pathBase(this.props)}/roles`,
                        {type: 'Role', action: 'update'}
                    )}
                    {this.subTab(
                        'edit.permission.admin',
                        <PermissionSearchFormContainer/>,
                        `${pathBase(this.props)}/permissions`,
                        {type: 'Permission', action: 'update'}
                    )}
                    {this.subTab(
                        'edit.task_type.admin',
                        <TaskTypeSearchFormContainer/>,
                        `${pathBase(this.props)}/task_types`,
                        {type: 'TaskType', action: 'update'}
                    )}
                </div>
            </Fragment>) :
            null;
    }
}

export default ProjectConfigTabPanel;
