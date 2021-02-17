import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

import { queryToText } from 'modules/search';
import { pathBase } from 'modules/routes';
import { t } from 'modules/i18n';
import { isMobile } from 'modules/user-agent';
import UserContentFormContainer from './UserContentFormContainer';
import UserContentDeleteContainer from './UserContentDeleteContainer';

export default class UserContent extends React.Component {
    constructor(props) {
        super(props);

        this.hideFlyoutTabsIfMobile = this.hideFlyoutTabsIfMobile.bind(this);
    }

    hideFlyoutTabsIfMobile() {
        if (isMobile()) {
            this.props.hideFlyoutTabs();
        }
    }

    userContentForm() {
        return <UserContentFormContainer
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
        />
    }

    userContentDelete() {
        return <UserContentDeleteContainer
            id={this.props.data.id}
            title={this.props.data.title}
            description={this.props.data.description}
        />
    }

    workflowState() {
        if (this.props.data.type === 'UserAnnotation') {
            return t(this.props, this.props.data.workflow_state);
        }
    }

    edit() {
        let titleKey = "edit" + this.props.data.type.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});
        let css = this.props.editView ? "fa fa-pencil" : "fa fa-pencil archive-view"
        return <div
            className='flyout-sub-tabs-content-ico-link'
            title={t(this.props, 'edit')}
            onClick={() => this.props.openArchivePopup({
                title: t(this.props, titleKey ),
                content: this.userContentForm()
            })}
        >
            <i className={css}></i>
        </div>
    }

    delete() {
        let css = this.props.editView ? "fa fa-trash-o" : "fa fa-trash-o archive-view"
        return <div
            className='flyout-sub-tabs-content-ico-link'
            title={t(this.props, 'delete')}
            onClick={() => this.props.openArchivePopup({
                title: t(this.props, 'delete_user_content'),
                content: this.userContentDelete()
            })}
        >
            <i className={css}></i>
        </div>
    }

    goTo() {
        let callKey = "call" + this.props.data.type.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});

        if (this.props.data.type === 'InterviewReference') {
            return <p className={'flyout-sub-tabs-content-link'}>
                <i className={'fa fa-angle-right flyout-content-ico'}> </i>
                <Link
                    onClick={() => this.hideFlyoutTabsIfMobile()}
                    to={pathBase(this.props) + '/interviews/' + this.props.data.media_id}>
                    {t(this.props, callKey)}
                </Link>
            </p>
        } else if (this.props.data.type === 'UserAnnotation') {
            return <p className={'flyout-sub-tabs-content-link'}>
                <i className={'fa fa-angle-right flyout-content-ico'}> </i>
                <Link
                    onClick={() => {
                        this.props.setArchiveId(this.props.data.properties.interview_archive_id);
                        this.props.setTapeAndTime(this.props.data.properties.tape_nbr, this.props.data.properties.time)
                        this.hideFlyoutTabsIfMobile();
                    }}
                    to={pathBase(this.props) + '/interviews/' + this.props.data.properties.interview_archive_id}
                >
                    {t(this.props, callKey)}
                </Link>
            </p>
        } else if (this.props.data.type === 'Search') {
            let url = `${pathBase(this.props)}/searches/archive`;
            return <p className={'flyout-sub-tabs-content-link'}>
                <i className={'fa fa-angle-right flyout-content-ico'}> </i>
                <Link
                    onClick={() => {
                        this.props.searchInArchive(url, this.props.data.properties);
                        this.hideFlyoutTabsIfMobile();
                    }}
                    to={pathBase(this.props) + '/searches/archive'}
                >
                    {t(this.props, callKey)}
                </Link>
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
