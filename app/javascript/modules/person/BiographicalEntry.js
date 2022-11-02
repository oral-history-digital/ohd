import { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@reach/disclosure';
import { FaPencilAlt, FaTrash, FaAngleUp, FaAngleDown } from 'react-icons/fa';

import { t } from 'modules/i18n';
import { Modal } from 'modules/ui';
import { AuthorizedContent } from 'modules/auth';
import { DeleteItemForm } from 'modules/forms';
import BiographicalEntryFormContainer from './BiographicalEntryFormContainer';

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
                    trigger={<FaPencilAlt className="Icon Icon--editorial Icon--small"/>}
                >
                    {close => (
                        <BiographicalEntryFormContainer
                            biographicalEntry={data}
                            onSubmit={close}
                            onCancel={close}
                        />
                    )}
                </Modal>

                <Modal
                    title={t(this.props, 'delete')}
                    trigger={<FaTrash className="Icon Icon--editorial Icon--small" />}
                >
                    {close => (
                        <DeleteItemForm
                            onSubmit={() => {
                                deleteData(this.props, 'people', data.person_id, 'biographical_entries', data.id, true);
                                close();
                            }}
                            onCancel={close}
                        >
                            {this.entries()}
                        </DeleteItemForm>
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
                        className={classNames('Button', 'Button--transparent', 'Button--icon')}
                        title={t(this.props, open ? 'hide' : 'show')}
                    >
                        {this.preview()}
                        {
                            open ?
                                <FaAngleUp className="Icon Icon--text" /> :
                                <FaAngleDown className="Icon Icon--text" />
                        }
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
