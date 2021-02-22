import React from 'react';
import PropTypes from 'prop-types';

import { t } from 'modules/i18n';
import { Modal } from 'modules/ui';
import { AuthorizedContent } from 'modules/auth';
import BiographicalEntryFormContainer from './BiographicalEntryFormContainer';

export default class BiographicalEntry extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            collapsed: true
        }
    }

    buttons() {
        const { data, deleteData } = this.props;

        return (
            <AuthorizedContent object={this.props.data}>
                    <span className={'flyout-sub-tabs-content-ico'}>
                        <button
                        type="button"
                        className="flyout-sub-tabs-content-ico-link"
                        title={t(this.props, this.state.collapsed ? 'show' : 'hide')}
                        onClick={() => this.setState({ collapsed: !this.state.collapsed })}
                    >
                        <i className={`fa fa-angle-${this.state.collapsed ? 'down' : 'up'}`}></i>
                    </button>

                    <Modal
                        title={t(this.props, 'edit.biographical_entry.edit')}
                        trigger={<i className="fa fa-pencil"/>}
                        triggerClassName="flyout-sub-tabs-content-ico-link"
                    >
                        {close => (
                            <BiographicalEntryFormContainer
                                biographicalEntry={this.props.data}
                                onSubmit={close}
                            />
                        )}
                    </Modal>

                    <Modal
                        title={t(this.props, 'delete')}
                        trigger={<i className="fa fa-trash-o"/>}
                        triggerClassName="flyout-sub-tabs-content-ico-link"
                    >
                        {close => (
                            <div>
                                {this.entries()}

                                <button
                                    type="button"
                                    className="any-button"
                                    onClick={() => {
                                        deleteData(this.props, 'people', data.person_id, 'biographical_entries', data.id);
                                        close();
                                    }}
                                >
                                    {t(this.props, 'delete')}
                                </button>
                        </div>
                        )}
                    </Modal>
                </span>
            </AuthorizedContent>
        );
    }

    entry(name) {
        return (
            <p key={name}>
                <span className='flyout-content-label'>{t(this.props, `activerecord.attributes.biographical_entry.${name}`)}:</span>
                <span className='flyout-content-data' dangerouslySetInnerHTML={{__html: this.props.data[name][this.props.locale]}} />
            </p>
        )
    }

    entries() {
        return ['text', 'start_date', 'end_date'].map((entry) => {
            if (this.props.data[entry][this.props.locale])
                return this.entry(entry);
        })
    }

    preview() {
        if (this.props.data.text[this.props.locale]) {
            return (
                <span className={'flyout-content-data'}>
                    {this.props.data.text[this.props.locale].substring(0,15)}
                </span>
            )
        } else {
            return "---";
        }
    }

    render() {
        return (
            <p>
                {
                    this.state.collapsed ?
                        this.preview() :
                        this.entries()
                }
                {this.buttons()}
            </p>
        );
    }
}

BiographicalEntry.propTypes = {
    data: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    translations: PropTypes.object.isRequired,
    deleteData: PropTypes.func.isRequired,
};
