import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { SCROLL_OFFSET } from 'modules/constants';
import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import { TapeAndTime } from 'modules/interview-helpers';
import { AuthorizedContent } from 'modules/auth';
import SegmentHeadingFormContainer from './SegmentHeadingFormContainer';

export default function Subheading({
    data,
    active,
    sendTimeChangeRequest,
}) {
    const { t } = useI18n();
    const divEl = useRef();

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
                        <TapeAndTime tape={data.tape_nbr} time={data.time} />
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
    );
}

Subheading.propTypes = {
    data: PropTypes.object.isRequired,
    active: PropTypes.bool.isRequired,
    sendTimeChangeRequest: PropTypes.func.isRequired,
};
