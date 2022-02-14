import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { CollectionsSearchFormContainer, LanguagesSearchFormContainer,
    RegistryNameTypesSearchFormContainer, ContributionTypesSearchFormContainer,
    PeopleSearchFormContainer, RegistryReferenceTypesSearchFormContainer }
    from 'modules/admin';
import { pathBase } from 'modules/routes';
import { admin } from 'modules/auth';
import { t } from 'modules/i18n';
import SubTab from './SubTab';

class IndexingTabPanel extends Component {
    static propTypes = {
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
                    { t(this.props, 'edit.indexing') }
                </h3>
                <div className='flyout-sub-tabs-container'>
                    <SubTab
                        title='edit.interview.new'
                        url={`${pathBase(this.props)}/interviews/new`}
                        obj={{type: 'Interview'}}
                        action='create'
                    />
                    <SubTab
                        title='edit.upload.upload'
                        url={`${pathBase(this.props)}/uploads/new`}
                        obj={{type: 'Upload'}}
                        action='create'
                    />
                    <SubTab
                        title= 'edit.person.admin'
                        url={`${pathBase(this.props)}/people`}
                        obj={{type: 'Person'}}
                        action='update'
                    >
                        <PeopleSearchFormContainer />
                    </SubTab>
                    <SubTab
                        title= 'edit.registry_reference_type.admin'
                        url={`${pathBase(this.props)}/registry_reference_types`}
                        obj={{type: 'RegistryReferenceType'}}
                        action='update'
                    >
                        <RegistryReferenceTypesSearchFormContainer />
                    </SubTab>
                    <SubTab
                        title= 'edit.registry_name_type.admin'
                        url={`${pathBase(this.props)}/registry_name_types`}
                        obj={{type: 'RegistryNameType'}}
                        action='update'
                    >
                        <RegistryNameTypesSearchFormContainer />
                    </SubTab>
                    <SubTab
                        title= 'edit.contribution_type.admin'
                        url={`${pathBase(this.props)}/contribution_types`}
                        obj={{type: 'ContributionType'}}
                        action='update'
                    >
                        <ContributionTypesSearchFormContainer />
                    </SubTab>
                    <SubTab
                        title= 'edit.collection.admin'
                        url={`${pathBase(this.props)}/collections`}
                        obj={{type: 'Collection'}}
                        action='update'
                    >
                        <CollectionsSearchFormContainer />
                    </SubTab>
                    <SubTab
                        title= 'edit.language.admin'
                        url={`${pathBase(this.props)}/languages`}
                        obj={{type: 'Language'}}
                        action='update'
                    >
                        <LanguagesSearchFormContainer/>
                    </SubTab>
                </div>
            </Fragment>) :
            null;
    }
}

export default IndexingTabPanel;
