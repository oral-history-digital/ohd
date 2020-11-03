import React, { Fragment } from 'react';
import AuthShowContainer from '../containers/AuthShowContainer';
import PersonFormContainer from '../containers/PersonFormContainer';
import { t } from '../../../lib/utils';

export default class EditPerson extends React.Component {

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
            return (
                <div>
                    <p>
                        {t(this.props, 'edit.person.processed')}
                    </p>
                    <button
                        className='return-to-upload'
                        onClick={() => this.returnToForm()}
                    >
                        {t(this.props, 'edit.person.return')}
                    </button>
                </div>
            )
        } else {
            return (
                <PersonFormContainer onSubmitCallback={this.hideForm} />
            )
        }
    }

    render() {
        return (
            <Fragment>
                <AuthShowContainer ifLoggedIn={true}>
                    <h1 className='registry-entries-title'>{t(this.props, `edit.person.new`)}</h1>
                    {this.content()}
                </AuthShowContainer>
                <AuthShowContainer ifLoggedOut={true} ifNoProject={true}>
                    {t(this.props, 'devise.failure.unauthenticated')}
                </AuthShowContainer>
            </Fragment>
        );
    }
}
