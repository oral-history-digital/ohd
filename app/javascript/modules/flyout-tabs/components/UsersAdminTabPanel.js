import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import UserRegistrationSearchFormContainer from 'bundles/archive/containers/UserRegistrationSearchFormContainer';
import RoleSearchFormContainer from 'bundles/archive/containers/RoleSearchFormContainer';
import PermissionSearchFormContainer from 'bundles/archive/containers/PermissionSearchFormContainer';
import TaskTypeSearchFormContainer from 'bundles/archive/containers/TaskTypeSearchFormContainer';
import ProjectSearchFormContainer from 'bundles/archive/containers/ProjectSearchFormContainer';
import InterviewDataContainer from 'bundles/archive/containers/InterviewDataContainer';
import { admin, pathBase, t } from 'lib/utils';

class UsersAdminTabPanel extends Component {
    static propTypes = {
        countryKeys: PropTypes.object.isRequired,
        locale: PropTypes.string.isRequired,
        translations: PropTypes.object.isRequired,
        projectId: PropTypes.string.isRequired,
        account: PropTypes.object.isRequired,
        editView: PropTypes.bool.isRequired,
    }

    constructor(props) {
        super(props);

        this.state = { selectedCountries: [] };

        this.onCountrySelectorChange = this.onCountrySelectorChange.bind(this);
    }

    countryKeys() {
        const { locale, translations } = this.props;

        let countryKeys = [];
        this.props.countryKeys[locale].map((x, i) => {
            countryKeys[i] = {'label': translations[locale]["countries"][x], 'value': x}
        })
        return countryKeys;
    }

    userStatisticsPath() {
        let path = `${pathBase(this.props)}/admin/user_statistics.csv`;
        if (this.state.selectedCountries.length > 0) {
            path = path + "?countries[]="
            path = path + this.state.selectedCountries.join("&countries[]=")
        }
        return path;
    }

    onCountrySelectorChange(value) {
        let array = [];
        for(var o in value) {
            array.push(value[o]['value']);
        }
        this.setState({ selectedCountries: array });
    }

    subTab(title, content, url, obj, condition = true) {
        return (admin(this.props, obj) && condition) ?
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
        return admin(this.props, {type: 'General', action: 'edit'}) ?
            (<Fragment>
                <div className='flyout-tab-title'>
                    { t(this.props, 'edit.administration') }
                </div>
                <div className='flyout-sub-tabs-container'>
                    {this.subTab(
                        'edit.users.admin',
                        <div>
                            <div>
                                <UserRegistrationSearchFormContainer/>
                                <a href={this.userStatisticsPath()}>
                                    <i className="fa fa-download flyout-content-ico" title={t(this.props, 'download_user_statistics')}></i>
                                    <span>{` ${t(this.props, 'download_user_statistics')}`}</span>
                                </a>
                            </div>
                            <Select
                                options={this.countryKeys()}
                                className="basic-multi-select"
                                isMulti
                                onChange={this.onCountrySelectorChange}
                                styles={{
                                    placeholder: (provided) => Object.assign(Object.assign({}, provided), { cursor: 'text' }),
                                    menu: (provided) => Object.assign(Object.assign({}, provided), { position: 'relative' }),
                                }}
                                placeholder={"Statistik nach Ländern filtern (optional)"}
                            />
                        </div>,
                        `${pathBase(this.props)}/user_registrations`,
                        {type: 'UserRegistration', action: 'update'}
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
                    {this.subTab(
                        'edit.project.admin',
                        <ProjectSearchFormContainer/>,
                        `${pathBase(this.props)}/projects`,
                        {type: 'Project', action: 'update'}
                    )}
                </div>
            </Fragment>) :
            null;
    }
}

export default UsersAdminTabPanel;
