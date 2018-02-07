import React from 'react';
import {Link, hashHistory} from 'react-router-dom';

import UserContentFormContainer from '../containers/UserContentFormContainer';
import UserContentDeleteContainer from '../containers/UserContentDeleteContainer';
import ArchiveUtils from '../../../lib/utils';

export default class UserContent extends React.Component {

    userContentForm() {
        return <UserContentFormContainer
            id={this.props.data.id}
            title={this.props.data.title}
            description={this.props.data.description}
            properties={{}}
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
            return this.props.data.workflow_state
        }
    }

    edit() {
        let titleKey = "edit" + this.props.data.type.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});
        return <div
            className='flyout-sub-tabs-content-ico-link'
            title={ArchiveUtils.translate(this.props, 'edit')}
            onClick={() => this.props.openArchivePopup({
                title: ArchiveUtils.translate(this.props, titleKey ),
                content: this.userContentForm()
            })}
        >
            <i className="fa fa-pencil"></i>
        </div>
    }

    delete() {
        return <div
            className='flyout-sub-tabs-content-ico-link'
            title={ArchiveUtils.translate(this.props, 'delete')}
            onClick={() => this.props.openArchivePopup({
                title: ArchiveUtils.translate(this.props, 'delete_user_content'),
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
                    to={'/' + this.props.locale + '/interviews/' + this.props.data.media_id}>
                    {ArchiveUtils.translate(this.props, callKey)}
                </Link>
            </p>
        } else if (this.props.data.type === 'UserAnnotation') {
            return <p className={'flyout-sub-tabs-content-link'}>
                <i className={'fa fa-angle-right flyout-content-ico'}> </i>
                <Link
                    onClick={() => this.props.handleSegmentClick(this.props.data.properties.tape_nbr, this.props.data.properties.time)}
                    to={'/' + this.props.locale + '/interviews/' + this.props.data.properties.interview_archive_id}
                >
                    {ArchiveUtils.translate(this.props, callKey)}
                </Link>
            </p>
        } else if (this.props.data.type === 'Search') {
            return <p className={'flyout-sub-tabs-content-link'}>
                <i className={'fa fa-angle-right flyout-content-ico'}> </i>
                <Link
                    onClick={() => this.props.searchInArchive(this.props.data.properties)}
                    to={'/' + this.props.locale + '/searches/archive'}
                >
                    {ArchiveUtils.translate(this.props, callKey)}
                </Link>
            </p>
        } else {
            return null
        }
    }

    paramsInfo(){
        if  (this.props.data.type === 'Search') {
            return  <p>
                <span className='flyout-content-label'>{ArchiveUtils.translate(this.props, 'query')}:</span>
                <span className='flyout-content-data'>{ArchiveUtils.queryToText(this.props.data.properties, this.props)}</span>
            </p>
        } else {
            return null
        }
    }


    render() {
        return (
            <div>
                <h3><span className='flyout-content-data'>{this.props.data.title}</span></h3>
                <p>
                    <span className='flyout-content-label'>{ArchiveUtils.translate(this.props, 'description')}:</span>
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
}

