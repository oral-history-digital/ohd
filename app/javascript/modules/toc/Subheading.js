import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FaPencilAlt } from 'react-icons/fa';

import { SCROLL_OFFSET } from 'modules/constants';
import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import { TapeAndTime } from 'modules/interview-helpers';
import { AuthorizedContent } from 'modules/auth';
import SegmentHeadingFormContainer from './SegmentHeadingFormContainer';
import { getCurrentInterview } from 'modules/data';

export default function Subheading({
    data,
    active,
    sendTimeChangeRequest,
}) {
    const { t } = useI18n();
    const divEl = useRef();
    const interview = useSelector(getCurrentInterview);

    useEffect(() => {
        if (active) {
            const topOfSegment = divEl.current.offsetTop;
            window.scrollTo(0, topOfSegment - SCROLL_OFFSET);
        }
    }, []);

    return (
        <div ref={divEl} className="Heading Heading--sub">
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
    );
}

Subheading.propTypes = {
    data: PropTypes.object.isRequired,
    active: PropTypes.bool.isRequired,
    sendTimeChangeRequest: PropTypes.func.isRequired,
};
