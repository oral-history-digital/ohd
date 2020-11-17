import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import PeopleSearchFormContainer from '../../containers/PeopleSearchFormContainer';
import RegistryReferenceTypesSearchFormContainer from '../../containers/RegistryReferenceTypesSearchFormContainer';
import CollectionsSearchFormContainer from '../../containers/CollectionsSearchFormContainer';
import LanguagesSearchFormContainer from '../../containers/LanguagesSearchFormContainer';
import InterviewDataContainer from '../../containers/InterviewDataContainer';
import { admin, pathBase, t } from '../../../../lib/utils';

class IndexingTabPanel extends Component {
    static propTypes = {
        locale: PropTypes.string.isRequired,
        translations: PropTypes.object.isRequired,
        projectId: PropTypes.string.isRequired,
        account: PropTypes.object.isRequired,
        editView: PropTypes.bool.isRequired,
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
                    { t(this.props, 'edit.indexing') }
                </div>
                <div className='flyout-sub-tabs-container'>
                    {this.subTab('edit.interview.new', 'description', `${pathBase(this.props)}/interviews/new`, {type: 'Interview', action: 'create'})}
                    {this.subTab('edit.upload.upload', '', `${pathBase(this.props)}/uploads/new`, {type: 'Upload', action: 'create'})}
                    {this.subTab( 'edit.person.admin', <PeopleSearchFormContainer/>, `${pathBase(this.props)}/people`, {type: 'Person', action: 'update'})}
                    {this.subTab( 'edit.registry_reference_type.admin', <RegistryReferenceTypesSearchFormContainer/>, `${pathBase(this.props)}/registry_reference_types`, {type: 'RegistryReferenceType', action: 'update'})}
                    {this.subTab( 'edit.collection.admin', <CollectionsSearchFormContainer/>, `${pathBase(this.props)}/collections`, {type: 'Collection', action: 'update'})}
                    {this.subTab( 'edit.language.admin', <LanguagesSearchFormContainer/>, `${pathBase(this.props)}/languages`, {type: 'Language', action: 'update'})}
                </div>
            </Fragment>) :
            null;
    }
}

export default IndexingTabPanel;
