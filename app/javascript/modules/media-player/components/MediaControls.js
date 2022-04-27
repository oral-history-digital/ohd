import { Component } from 'react';
import PropTypes from 'prop-types';
import { FaPencilAlt, FaStar } from 'react-icons/fa';
import classNames from 'classnames';
import moment from 'moment';

import { UserContentFormContainer } from 'modules/workbook';
import { sortedSegmentsWithActiveIndex } from 'modules/transcript';
import { t } from 'modules/i18n';
import { Modal } from 'modules/ui';

export default class MediaControls extends Component {
    constructor(props) {
        super(props);

        this.handleTapeChange = this.handleTapeChange.bind(this);
    }

    handleTapeChange(e) {
        const { setTape } = this.props;

        setTape(Number.parseInt(e.target.value));
    }

    rememberInterviewLink() {
        const { interview, locale, translations } = this.props;
        const shortTitle = interview.short_title && interview.short_title[locale];

        return (
            <Modal
                title={t({ locale, translations }, 'save_interview_reference') + ": " + shortTitle}
                trigger={<><FaStar /> <span>{t({ locale, translations }, 'save_interview_reference')}</span></>}
                triggerClassName="MediaControls-bookmark"
            >
                {closeModal => (
                    <UserContentFormContainer
                        title={this.defaultTitle()}
                        description=''
                        properties={{title: interview.title}}
                        reference_id={interview.id}
                        reference_type='Interview'
                        media_id={interview.archive_id}
                        type='InterviewReference'
                        submitLabel={t({ locale, translations }, 'notice')}
                        onSubmit={closeModal}
                        onCancel={closeModal}
                    />
                )}
            </Modal>
        );
    }

    defaultTitle() {
        const shortTitle = this.props.interview.short_title && this.props.interview.short_title[this.props.locale];
        moment.locale(this.props.locale);
        let now = moment().format('lll');
        return `${this.props.archiveId} - ${shortTitle} - ${now}`;
    }

    annotateOnSegmentLink() {
        const { locale, translations, interview, tape, mediaTime } = this.props;

        let sortedSegmentsWithIndex = sortedSegmentsWithActiveIndex(mediaTime, { interview, tape });

        return (
            <Modal
                title={t({ locale, translations }, 'save_user_annotation')}
                trigger={<><FaPencilAlt /> <span>{t({ locale, translations }, 'save_user_annotation')}</span></>}
                triggerClassName="MediaControls-annotation"
            >
                {closeModal => this.annotateOnSegmentForm(sortedSegmentsWithIndex, closeModal)}
            </Modal>
        );
    }

    annotateOnSegmentForm(sortedSegmentsWithIndex, closeModal) {
        let segment = sortedSegmentsWithIndex[0];
        let sortedSegments = sortedSegmentsWithIndex[1];
        let activeIndex =  sortedSegmentsWithIndex[2];

        if (segment) {
            return <UserContentFormContainer
                title={this.defaultTitle()}
                description=''
                properties={{
                    time: segment.time,
                    tape_nbr: segment.tape_nbr,
                    segmentIndex: segment.id,
                    interview_archive_id: this.props.interview.archive_id
                }}
                reference_id={segment.id}
                reference_type='Segment'
                media_id={segment.media_id}
                segment={segment}
                segmentIndex={activeIndex}
                sortedSegments={sortedSegments}
                type='UserAnnotation'
                workflow_state='private'
                onSubmit={closeModal}
                onCancel={closeModal}
            />
        }
    }

    render() {
        const { className, tape: currentTape, interview, locale, translations } = this.props;

        const tapes = [...Array(Number.parseInt(interview.tape_count)).keys()]
            .map(i => i + 1);

        return (
            <div className={classNames(className, 'MediaControls')}>
                <div className="MediaControls-selects">
                    {
                        tapes.length > 1 && (
                            <select
                                value={currentTape}
                                onChange={this.handleTapeChange}
                                className="MediaControls-tapeSelector"
                            >
                                {
                                    tapes.map(tape => (
                                        <option key={tape} value={tape}>
                                            {t({ locale, translations }, 'tape')} {tape}
                                        </option>
                                    ))
                                }
                            </select>
                        )
                    }
                </div>

                <div className="MediaControls-buttons">
                    {this.annotateOnSegmentLink()}
                    {this.rememberInterviewLink()}
                </div>
            </div>
        );
    }
}

MediaControls.propTypes = {
    className: PropTypes.string,
    archiveId: PropTypes.string.isRequired,
    interview: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    tape: PropTypes.number.isRequired,
    translations: PropTypes.object.isRequired,
    mediaTime: PropTypes.number.isRequired,
    setTape: PropTypes.func.isRequired,
};
