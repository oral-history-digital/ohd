import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { CollectionsSearchFormContainer, LanguagesSearchFormContainer,
    RegistryNameTypesSearchFormContainer, ContributionTypesSearchFormContainer,
    PeopleSearchFormContainer, RegistryReferenceTypesSearchFormContainer }
    from 'modules/admin';
import { pathBase } from 'modules/routes';
import { admin } from 'modules/auth';
import { t } from 'modules/i18n';
import InterviewDataContainer from './InterviewDataContainer';

class IndexingTabPanel extends Component {
    static propTypes = {
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
                    { t(this.props, 'edit.indexing') }
                </div>
                <div className='flyout-sub-tabs-container'>
                    {this.subTab('edit.interview.new', 'description', `${pathBase(this.props)}/interviews/new`, {type: 'Interview', action: 'create'})}
                    {this.subTab('edit.upload.upload', '', `${pathBase(this.props)}/uploads/new`, {type: 'Upload', action: 'create'})}
                    {this.subTab( 'edit.person.admin', <PeopleSearchFormContainer/>, `${pathBase(this.props)}/people`, {type: 'Person', action: 'update'})}
                    {this.subTab( 'edit.registry_reference_type.admin', <RegistryReferenceTypesSearchFormContainer/>, `${pathBase(this.props)}/registry_reference_types`, {type: 'RegistryReferenceType', action: 'update'})}
                    {this.subTab( 'edit.registry_name_type.admin', <RegistryNameTypesSearchFormContainer/>, `${pathBase(this.props)}/registry_name_types`, {type: 'RegistryNameType', action: 'update'})}
                    {this.subTab( 'edit.contribution_type.admin', <ContributionTypesSearchFormContainer/>, `${pathBase(this.props)}/contribution_types`, {type: 'ContributionType', action: 'update'})}
                    {this.subTab( 'edit.collection.admin', <CollectionsSearchFormContainer/>, `${pathBase(this.props)}/collections`, {type: 'Collection', action: 'update'})}
                    {this.subTab( 'edit.language.admin', <LanguagesSearchFormContainer/>, `${pathBase(this.props)}/languages`, {type: 'Language', action: 'update'})}
                </div>
            </Fragment>) :
            null;
    }
}

export default IndexingTabPanel;
