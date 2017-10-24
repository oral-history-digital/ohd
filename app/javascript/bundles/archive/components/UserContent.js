import React from 'react';
import {Link, hashHistory} from 'react-router-dom';

import UserContentFormContainer from '../containers/UserContentFormContainer';
import UserContentDeleteContainer from '../containers/UserContentDeleteContainer';
import '../../../css/segments';

export default class UserContent extends React.Component {

    userContentForm() {
        return  <UserContentFormContainer 
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
        return  <UserContentDeleteContainer 
                    id={this.props.data.id}
                />
    }

    workflowState() {
        if(this.props.data.type === 'UserAnnotation') {
            return this.props.data.workflow_state 
        }
    }

    edit() {
        return <div 
                    className='edit' 
                    onClick={() => this.props.openArchivePopup({
                        title: 'Edit', 
                        content: this.userContentForm()
                    })}
                >
                    edit
                </div>
    }

    delete() {
        return <div 
                    className='delete' 
                    onClick={() => this.props.openArchivePopup({
                        title: 'Delete', 
                        content: this.userContentDelete()
                    })}
                >
                    {'delete'}
                </div>
    }
    
    goTo() {
        if(this.props.data.type === 'InterviewReference') {
            return <Link
                      to={'/' + this.props.locale + '/interviews/' + this.props.data.media_id}
                  >
                      {`go to interview: ${this.props.data.properties.title[this.props.locale]}`}
                  </Link>
        } else if(this.props.data.type === 'UserAnnotation') {
              return <Link
                      onClick={() => this.props.handleSegmentClick(this.props.data.properties.time)} 
                      to={'/' + this.props.locale + '/interviews/' + this.props.data.properties.interview_archive_id}
                  >
                      {'go to segment'}
                  </Link>
        } else if(this.props.data.type === 'Search') {
              return <Link
                        onClick={() => this.props.searchInArchive(this.props.data.properties)}
                        to={'/' + this.props.locale + '/suchen'}
                  >
                      {'search'}
                  </Link>
        } else {
            return null
        }
    }

    render () {
        return (
            <div>
                <div className='title'>{this.props.data.title}</div>
                <div className='description'>{this.props.data.description}</div>
                {this.workflowState()}
                {this.edit()}
                {this.delete()}
                {this.goTo()}
            </div>
        )
    }
}

