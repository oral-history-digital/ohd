import { Component } from 'react';
import PropTypes from 'prop-types';

import { LinkOrA } from 'modules/routes';
import { queryToText } from 'modules/search';
import parametrizedQuery from 'modules/admin/parametrizedQuery';
import { t } from 'modules/i18n';
import { Modal } from 'modules/ui';
import { isMobile } from 'modules/user-agent';
import UserContentFormContainer from './UserContentFormContainer';
import UserContentDeleteContainer from './UserContentDeleteContainer';

export default class UserContent extends Component {
    constructor(props) {
        super(props);

        this.hideFlyoutTabsIfMobile = this.hideFlyoutTabsIfMobile.bind(this);
        this.onSearchClick = this.onSearchClick.bind(this);
        this.onAnnotationClick = this.onAnnotationClick.bind(this);
        this.onInterviewReferenceClick = this.onInterviewReferenceClick.bind(this);
    }

    hideFlyoutTabsIfMobile() {
        if (isMobile()) {
            this.props.hideFlyoutTabs();
        }
    }

    workflowState() {
        if (this.props.data.type === 'UserAnnotation') {
            return t(this.props, this.props.data.workflow_state);
        }
    }

    edit() {
        let titleKey = "edit" + this.props.data.type.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});
        let css = this.props.editView ? "fa fa-pencil" : "fa fa-pencil archive-view"
        return (
            <Modal
                title={t(this.props, 'edit')}
                trigger={<i className={css}/>}
            >
                {closeModal => (
                    <UserContentFormContainer
                        id={this.props.data.id}
                        title={this.props.data.title}
                        description={this.props.data.description}
                        properties={this.props.data.properties}
                        segmentIndex={this.props.data.properties.segmentIndex}
                        reference_id={this.props.data.reference_id}
                        reference_type={this.props.data.reference_type}
                        media_id={this.props.data.media_id}
                        type={this.props.data.type}
                        workflow_state={this.props.data.workflow_state}
                        onSubmit={closeModal}
                    />
                )}
            </Modal>
        );
    }

    delete() {
        let css = this.props.editView ? "fa fa-trash-o" : "fa fa-trash-o archive-view"

        return (
            <Modal
                title={t(this.props, 'delete_user_content')}
                trigger={<i className={css}/>}
            >
                {closeModal => (
                    <UserContentDeleteContainer
                        id={this.props.data.id}
                        title={this.props.data.title}
                        description={this.props.data.description}
                        onSubmit={closeModal}
                    />
                )}
            </Modal>
        );
    }

    onInterviewReferenceClick() {
        this.props.setArchiveId(this.props.data.media_id);
        this.hideFlyoutTabsIfMobile();
    }

    onAnnotationClick() {
        this.props.setArchiveId(this.props.data.properties.interview_archive_id);
        this.props.sendTimeChangeRequest(this.props.data.properties.tape_nbr, this.props.data.properties.time);
        this.hideFlyoutTabsIfMobile();
    }

    onSearchClick(pathBase) {
        this.props.searchInArchive(`${pathBase}/searches/archive`, this.props.data.properties);
        this.hideFlyoutTabsIfMobile();
    }

    goTo() {
        let callKey = "call" + this.props.data.type.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});
        const project = this.props.projects[this.props.data.project_id];

        if (this.props.data.type === 'InterviewReference') {
            return <p className={'flyout-sub-tabs-content-link'}>
                <i className={'fa fa-angle-right flyout-content-ico'}> </i>
                    <LinkOrA project={project} to={`interviews/${this.props.data.media_id}`} onLinkClick={this.onInterviewReferenceClick} >
                    {t(this.props, callKey)}
                </LinkOrA>
            </p>
        } else if (this.props.data.type === 'UserAnnotation') {
            return <p className={'flyout-sub-tabs-content-link'}>
                <i className={'fa fa-angle-right flyout-content-ico'}> </i>
                <LinkOrA project={project} to={`interviews/${this.props.data.properties.interview_archive_id}`} onLinkClick={this.onAnnotationClick} >
                    {t(this.props, callKey)}
                </LinkOrA>
            </p>
        } else if (this.props.data.type === 'Search') {
            return <p className={'flyout-sub-tabs-content-link'}>
                <i className={'fa fa-angle-right flyout-content-ico'}> </i>
                <LinkOrA project={project} to='searches/archive' params={`${new URLSearchParams(this.props.data.properties)}`} onLinkClick={this.onSearchClick} >
                    {t(this.props, callKey)}
                </LinkOrA>
            </p>
        } else {
            return null
        }
    }

    paramsInfo(){
        if  (this.props.data.type === 'Search') {
            return  <p>
                <span className='flyout-content-label'>{t(this.props, 'query')}:</span>
                <span className='flyout-content-data'>{queryToText(this.props.data.properties, this.props)}</span>
            </p>
        } else {
            return null
        }
    }


    render() {
        return (
            <div className='flyout-content-item'>
                <h3><span className='flyout-content-data'>{this.props.data.title}</span></h3>
                <p>
                    <span className='flyout-content-label'>{t(this.props, 'description')}:</span>
                    <span className='flyout-content-data'>{this.props.data.description}</span>
                </p>
                {this.workflowState()}
                {this.paramsInfo()}
                {this.goTo()}
                <div className={'flyout-sub-tabs-content-ico'}>
                    {this.edit()}
                    {this.delete()}
                </div>
            </div>
        )
    }

    static contextTypes = {
        router: PropTypes.object
    }
}