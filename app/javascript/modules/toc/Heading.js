import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FaPlus, FaMinus, FaPencilAlt } from 'react-icons/fa';

import { SCROLL_OFFSET } from 'modules/constants';
import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import { TapeAndTime } from 'modules/interview-helpers';
import { AuthorizedContent } from 'modules/auth';
import SubheadingContainer from './SubheadingContainer';
import SegmentHeadingFormContainer from './SegmentHeadingFormContainer';
import { getCurrentInterview } from 'modules/data';

export default function Heading({
    data,
    nextHeading,
    active,
    sendTimeChangeRequest,
}) {
    const [expanded, setExpanded] = useState(active);
    const { t } = useI18n();
    const divEl = useRef();
    const interview = useSelector(getCurrentInterview);

    const hasSubheadings = data.subheadings.length > 0;

    useEffect(() => {
        if (active && !hasSubheadings) {
            const topOfSegment = divEl.current.offsetTop;
            window.scrollTo(0, topOfSegment - SCROLL_OFFSET);
        }
    }, []);

    return (
        <>
            <div ref={divEl} className="Heading Heading--main">
                {hasSubheadings && (
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
                )}

                <button
                    type="button"
                    className={classNames('Heading-main', { 'is-active': active })}
                    onClick={() => interview.transcript_coupled && sendTimeChangeRequest(data.tape_nbr, data.time)}
                >
                    <span className="Heading-chapter">
                        {data.chapter}
                    </span>

                    <div>
                        <div className="Heading-heading">
                            {data.heading}
                        </div>

                        <div className="Heading-timecode">
                            <TapeAndTime tape={data.tape_nbr} time={data.time} transcriptCoupled={interview.transcript_coupled} />
                        </div>
                    </div>
                </button>

                <AuthorizedContent object={data.segment} action='update'>
                    <Modal
                        title=""
                        trigger={<FaPencilAlt className="Icon Icon--editorial" />}
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
