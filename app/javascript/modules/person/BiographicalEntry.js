import { useState } from 'react';

import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from '@reach/disclosure';
import classNames from 'classnames';
import { AuthorizedContent } from 'modules/auth';
import { DeleteItemForm } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Modal } from 'modules/ui';
import PropTypes from 'prop-types';
import { FaAngleDown, FaAngleUp, FaPencilAlt, FaTrash } from 'react-icons/fa';

import BiographicalEntryFormContainer from './BiographicalEntryFormContainer';

export default function BiographicalEntry({ data, deleteData }) {
    const { t, locale } = useI18n();
    const { project } = useProject();
    const [open, setOpen] = useState(false);
    const [deleted, setDeleted] = useState(false);

    if (deleted) {
        return null;
    }

    const buttons = () => {
        return (
            <AuthorizedContent object={data} action="update">
                <Modal
                    title={t('edit.biographical_entry.edit')}
                    trigger={
                        <FaPencilAlt className="Icon Icon--editorial Icon--small" />
                    }
                >
                    {(close) => (
                        <BiographicalEntryFormContainer
                            biographicalEntry={data}
                            onSubmit={close}
                            onCancel={close}
                        />
                    )}
                </Modal>

                <Modal
                    title={t('delete')}
                    trigger={
                        <FaTrash className="Icon Icon--editorial Icon--small" />
                    }
                >
                    {(close) => (
                        <DeleteItemForm
                            onSubmit={() => {
                                deleteData(
                                    { project, locale },
                                    'people',
                                    data.person_id,
                                    'biographical_entries',
                                    data.id,
                                    true
                                );
                                close();
                                setDeleted(true);
                            }}
                            onCancel={close}
                        >
                            {entries()}
                        </DeleteItemForm>
                    )}
                </Modal>
            </AuthorizedContent>
        );
    };

    const entry = (name) => {
        return (
            <p key={name}>
                <span className="flyout-content-label">
                    {t(`activerecord.attributes.biographical_entry.${name}`)}:
                </span>
                <span
                    className="flyout-content-data"
                    dangerouslySetInnerHTML={{ __html: data[name][locale] }}
                />
            </p>
        );
    };

    const entries = () => {
        return ['text', 'start_date', 'end_date'].map((e) => {
            if (data[e][locale]) return entry(e);
        });
    };

    const preview = () => {
        if (data.text[locale]) {
            return (
                <span className="flyout-content-data">
                    {data.text[locale].substring(0, 15)}
                </span>
            );
        } else {
            return '---';
        }
    };

    return (
        <p>
            <Disclosure open={open} onChange={() => setOpen(!open)}>
                <DisclosureButton
                    className={classNames(
                        'Button',
                        'Button--transparent',
                        'Button--icon'
                    )}
                    title={t(open ? 'hide' : 'show')}
                >
                    {preview()}
                    {open ? (
                        <FaAngleUp className="Icon Icon--text" />
                    ) : (
                        <FaAngleDown className="Icon Icon--text" />
                    )}
                </DisclosureButton>
                <DisclosurePanel>{entries()}</DisclosurePanel>
            </Disclosure>
            {buttons()}
        </p>
    );
}

BiographicalEntry.propTypes = {
    data: PropTypes.object.isRequired,
    deleteData: PropTypes.func.isRequired,
};
