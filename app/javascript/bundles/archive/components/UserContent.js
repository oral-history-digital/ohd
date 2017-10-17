import React from 'react';
import UserContentFormContainer from '../containers/UserContentFormContainer';
import '../../../css/segments';

export default class UserContent extends React.Component {

    userContentForm() {
        return  <UserContentFormContainer 
                    title={this.props.data.title}
                    description={this.props.data.description}
                    properties={{}}
                    reference_id={this.props.data.id}
                    reference_type='Segment'
                    media_id={this.props.data.media_id}
                    type={this.props.data.type}
                />
    }

    render () {
        return (
            <div>
                <div className='title'>{this.props.data.title}</div>
                <div className='description'>{this.props.data.description}</div>
                <div 
                    className='edit' 
                    onClick={() => this.props.openArchivePopup({
                        title: 'Edit', 
                        content: this.userContentForm()
                    })}
                >
                    edit
                </div>
            </div>
        )
    }
}

