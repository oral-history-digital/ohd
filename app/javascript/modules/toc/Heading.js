import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FaPlus, FaMinus } from 'react-icons/fa';

import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import { AuthorizedContent } from 'modules/auth';
import SubHeadingContainer from './SubHeadingContainer';
import SegmentHeadingFormContainer from './SegmentHeadingFormContainer';
import formatTimecode from './formatTimecode';
import styles from './Heading.module.scss';

export default function Heading({
    data,
    nextHeading,
    active,
    sendTimeChangeRequest,
}) {
    const [expanded, setExpanded] = useState(false);
    const { t } = useI18n();

    return (
        <>
            <div className={styles.container}>
                {
                    data.subheadings.length === 0 ?
                        null :
                        (
                            <button
                                type="button"
                                className={styles.toggle}
                                onClick={() => setExpanded(!expanded)}
                                aria-label={expanded ? 'Collapse' : 'Expand'}
                            >
                                {
                                    expanded ?
                                        <FaMinus /> :
                                        <FaPlus />
                                }
                            </button>
                        )
                }

                <button
                    type="button"
                    className={classNames(styles.main, {
                        [styles.active]: active,
                    })}
                    onClick={() => sendTimeChangeRequest(data.tape_nbr, data.time)}
                >
                    <span className={styles.chapter}>
                        {data.chapter}
                    </span>

                    <div>
                        <div className={styles.heading}>
                            {data.heading}
                        </div>

                        <div className={styles.timecode}>
                            {t('tape')} {data.tape_nbr} | {formatTimecode(data.time)}
                        </div>
                    </div>
                </button>

                <AuthorizedContent object={data.segment}>
                    <Modal
                        title=""
                        trigger={<i className="fa fa-pencil" />}
                    >
                        {closeModal => (
                            <SegmentHeadingFormContainer
                                segment={data.segment}
                                onSubmit={closeModal}
                            />
                        )}
                    </Modal>
                </AuthorizedContent>
            </div>

            {
                data.main && (
                    <div className={classNames(styles.subHeadings, {
                        [styles.subHeadingsCollapsed]: !expanded,
                    })}>
                        {data.subheadings.map((heading, index) => (
                            <div key={heading.segment.id}>
                                <SubHeadingContainer
                                    data={heading}
                                    nextSubHeading={data.subheadings[index + 1] || nextHeading}
                                />
                            </div>
                        ))}
                    </div>
                )
            }
        </>
    );
}

Heading.propTypes = {
    data: PropTypes.object.isRequired,
    active: PropTypes.bool.isRequired,
    nextHeading: PropTypes.object,
    sendTimeChangeRequest: PropTypes.func.isRequired,
};
