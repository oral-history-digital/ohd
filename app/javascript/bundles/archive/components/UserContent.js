import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

import UserContentFormContainer from '../containers/UserContentFormContainer';
import UserContentDeleteContainer from '../containers/UserContentDeleteContainer';
import { t, queryToText, pathBase } from '../../../lib/utils';

export default class UserContent extends React.Component {

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
        return <div
            className='flyout-sub-tabs-content-ico-link'
            title={t(this.props, 'edit')}
            onClick={() => this.props.openArchivePopup({
                title: t(this.props, titleKey ),
                content: this.userContentForm()
            })}
        >
            <i className="fa fa-pencil"></i>
        </div>
    }

    delete() {
        return <div
            className='flyout-sub-tabs-content-ico-link'
            title={t(this.props, 'delete')}
            onClick={() => this.props.openArchivePopup({
                title: t(this.props, 'delete_user_content'),
                content: this.userContentDelete()
            })}
        >
            <i className="fa fa-trash-o"></i>
        </div>
    }

    goTo() {
        let callKey = "call" + this.props.data.type.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});

        if (this.props.data.type === 'InterviewReference') {
            return <p className={'flyout-sub-tabs-content-link'}>
                <i className={'fa fa-angle-right flyout-content-ico'}> </i>
                <Link
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
                    }}
                    to={pathBase(this.props) + '/interviews/' + this.props.data.properties.interview_archive_id}
                >
                    {t(this.props, callKey)}
                </Link>
            </p>
        } else if (this.props.data.type === 'Search') {
            let url = `${pathBase(this.props)}/searches/archive`;
            //let url = `${this.context.router.route.match.params.projectId}/${this.context.router.route.match.params.locale}/searches/archive`;
            return <p className={'flyout-sub-tabs-content-link'}>
                <i className={'fa fa-angle-right flyout-content-ico'}> </i>
                <Link
                    onClick={() => this.props.searchInArchive(url, this.props.data.properties)}
                    to={'/' + this.props.locale + '/searches/archive'}
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

