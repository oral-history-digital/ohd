import { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FaPlus, FaMinus } from 'react-icons/fa';

import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import { AuthorizedContent } from 'modules/auth';
import SubheadingContainer from './SubheadingContainer';
import SegmentHeadingFormContainer from './SegmentHeadingFormContainer';
import formatTimecode from './formatTimecode';

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
            <div className="Heading Heading--main">
                {
                    data.subheadings.length === 0 ?
                        null :
                        (
                            <button
                                type="button"
                                className="Heading-toggle"
                                onClick={() => setExpanded(!expanded)}
                                aria-label={expanded ? t('modules.toc.collapse') : t('modules.toc.expand')}
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
                    className={classNames('Heading-main', { 'is-active': active })}
                    onClick={() => sendTimeChangeRequest(data.tape_nbr, data.time)}
                >
                    <span className="Heading-chapter">
                        {data.chapter}
                    </span>

                    <div>
                        <div className="Heading-heading">
                            {data.heading}
                        </div>

                        <div className="Heading-timecode">
                            {t('tape')} {data.tape_nbr} | {formatTimecode(data.time)}
                        </div>
                    </div>
                </button>

                <AuthorizedContent object={data.segment} action='update'>
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
                    <div className={classNames('Heading-subheadings', {
                        'is-expanded': expanded,
                    })}>
                        {data.subheadings.map((subheading, index) => (
                            <SubheadingContainer
                                key={subheading.segment.id}
                                data={subheading}
                                nextSubHeading={data.subheadings[index + 1] || nextHeading}
                            />
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
