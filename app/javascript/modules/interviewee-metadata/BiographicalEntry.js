import { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@reach/disclosure';

import { t } from 'modules/i18n';
import { Modal } from 'modules/ui';
import { AuthorizedContent } from 'modules/auth';
import BiographicalEntryFormContainer from './BiographicalEntryFormContainer';
import styles from './BiographicalEntry.module.scss';

export default class BiographicalEntry extends Component {
    constructor(props) {
        super(props);

        this.state = { open: false };
    }

    buttons() {
        const { data, deleteData } = this.props;

        return (
            <AuthorizedContent object={data} action='update'>
                <Modal
                    title={t(this.props, 'edit.biographical_entry.edit')}
                    trigger={<i className="fa fa-pencil"/>}
                    triggerClassName="flyout-sub-tabs-content-ico-link"
                >
                    {close => (
                        <BiographicalEntryFormContainer
                            biographicalEntry={data}
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
                <span className="flyout-content-data">
                    {this.props.data.text[this.props.locale].substring(0,15)}
                </span>
            )
        } else {
            return "---";
        }
    }

    render() {
        const { open } = this.state;

        return (
            <p>
                <Disclosure open={open} onChange={() => this.setState({ open: !open })}>
                    <DisclosureButton
                        className={classNames(styles.toggle, 'flyout-sub-tabs-content-ico-link')}
                        title={t(this.props, this.state.open ? 'hide' : 'show')}
                    >
                        {this.preview()}
                        <i className={classNames('fa', open ? 'fa-angle-up' : 'fa-angle-down')}/>
                    </DisclosureButton>
                    <DisclosurePanel>
                        {this.entries()}
                    </DisclosurePanel>
                </Disclosure>
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
