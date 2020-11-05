import React from 'react';
import AuthShowContainer from '../containers/AuthShowContainer';
import InterviewFormContainer from '../containers/InterviewFormContainer';
import { t } from '../../../lib/utils';

export default class EditInterview extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showForm: true
        };
        this.returnToForm = this.returnToForm.bind(this);
        this.hideForm = this.hideForm.bind(this);
    }

    returnToForm() {
        this.setState({showForm: true});
    }

    hideForm() {
        this.setState({showForm: false});
    }

    content() {
        if (
            !this.state.showForm
        ) {
            //<Link to={'/' + this.props.locale + '/interviews/' + this.props.processed}>
                //{this.props.processed}
            //</Link>
            return (
                <div>
                    <p>
                        {t(this.props, 'edit.interview.processed')}
                    </p>
                    <button
                        className='return-to-upload'
                        onClick={() => this.returnToForm()}
                    >
                        {t(this.props, 'edit.interview.return')}
                    </button>
                </div>
            )
        } else {
            return (
                <InterviewFormContainer submitText='edit.interview.new' withContributions={true} onSubmitCallback={this.hideForm} />
            )
        }
    }

    render() {
        return (
            <div className='wrapper-content register'>
                <AuthShowContainer ifLoggedIn={true}>
            <h1 className='registry-entries-title'>{t(this.props, `edit.interview.new`)}</h1>
            {this.content()}
            </AuthShowContainer>
            <AuthShowContainer ifLoggedOut={true} ifNoProject={true}>
                {t(this.props, 'devise.failure.unauthenticated')}
            </AuthShowContainer>
        </div>
        );
    }
}
