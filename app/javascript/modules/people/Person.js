import React from 'react';
import PropTypes from 'prop-types';

import { AuthorizedContent } from 'modules/auth';
import { Modal } from 'modules/ui';
import { t } from 'modules/i18n';
import PersonFormContainer from './PersonFormContainer';
import fullname from './fullname';

export default class Person extends React.Component {
    edit() {
        return (
            <Modal
                title={t(this.props, 'edit.person.edit')}
                trigger={<i className="fa fa-pencil"/>}
                triggerClassName="flyout-sub-tabs-content-ico-link"
            >
                {close => (
                    <PersonFormContainer
                        person={this.props.data}
                        onSubmitCallback={close}
                    />
                )}
            </Modal>
        );
    }

    delete() {
        return (
            <Modal
                title={`${t(this.props, 'delete')} ${t(this.props, 'contributions.' + this.props.contribution.contribution_type)}`}
                trigger={<i className="fa fa-trash-o"/>}
                triggerClassName="flyout-sub-tabs-content-ico-link"
            >
                {close => (
                    <div>
                        <p>{fullname(this.props, this.props.data)}</p>

                        <button
                            type="button"
                            className="any-button"
                            onClick={() => {
                                this.props.deleteData(this.props, 'interviews', this.props.archiveId, 'contributions', this.props.contribution.id);
                                close();
                            }}
                        >
                            {t(this.props, 'delete')}
                        </button>
                    </div>
                )}
            </Modal>
        );
    }

    buttons() {
        return (
            <AuthorizedContent object={this.props.data} action='destroy'>
                <span className={'flyout-sub-tabs-content-ico'}>
                    {/*this.edit()*/}
                    {this.delete()}
                </span>
            </AuthorizedContent>
        );
    }

    render() {
        if (this.props.contribution) {
            return (
              <span className="flyout-content-data">
                {fullname(this.props, this.props.data)}
                {this.buttons()}
              </span>
            );
        } else {
            // search result with highlight:
            return (
                <div>
                    <p>
                        <span className='flyout-content-data' dangerouslySetInnerHTML={{__html: this.props.data.text[this.props.locale]}} />
                    </p>
                </div>
            )
        }
    }
}

Person.propTypes = {
    archiveId: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    data: PropTypes.object,
    contribution: PropTypes.object,
    editView: PropTypes.bool.isRequired,
    account: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    deleteData: PropTypes.func.isRequired,
};
