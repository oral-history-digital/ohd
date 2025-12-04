import { useEffect, useRef } from 'react';

import classNames from 'classnames';
import { AuthorizedContent } from 'modules/auth';
import { getCurrentInterview } from 'modules/data';
import { TapeAndTime } from 'modules/interview-helpers';
import { useScrollOffset } from 'modules/media-player';
import { Modal } from 'modules/ui';
import { scrollSmoothlyTo } from 'modules/user-agent';
import PropTypes from 'prop-types';
import { FaPencilAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import SegmentHeadingForm from './SegmentHeadingForm';

export default function Subheading({ data, active, sendTimeChangeRequest }) {
    const scrollOffset = useScrollOffset();

    const divEl = useRef();
    const interview = useSelector(getCurrentInterview);

    useEffect(() => {
        if (active && divEl.current) {
            const topOfSegment = divEl.current.offsetTop;
            scrollSmoothlyTo(0, topOfSegment - scrollOffset);
        }
    }, [active, scrollOffset]);

    return (
        <div ref={divEl} className="Heading Heading--sub">
            <button
                type="button"
                className={classNames('Heading-main', { 'is-active': active })}
                onClick={() =>
                    interview.transcript_coupled &&
                    sendTimeChangeRequest(data.tape_nbr, data.time)
                }
            >
                <span className="Heading-chapter">{data.chapter}</span>

                <div>
                    <div className="Heading-heading">{data.heading}</div>

                    <div className="Heading-timecode">
                        <TapeAndTime
                            tape={data.tape_nbr}
                            time={data.time}
                            transcriptCoupled={interview.transcript_coupled}
                        />
                    </div>
                </div>
            </button>

            <AuthorizedContent object={data.segment} action="update">
                <Modal
                    title=""
                    trigger={<FaPencilAlt className="Icon Icon--editorial" />}
                >
                    {(closeModal) => (
                        <SegmentHeadingForm
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
