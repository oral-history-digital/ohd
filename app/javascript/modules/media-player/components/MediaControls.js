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
        this.handleResolutionChange = this.handleResolutionChange.bind(this);
    }

    handleTapeChange(e) {
        this.props.setTape(Number.parseInt(e.target.value));
    }

    handleResolutionChange(e) {
        this.props.setResolution(e.target.value);
    }

    rememberInterviewLink() {
        const { locale, translations } = this.props;

        return (
            <Modal
                title={t({ locale, translations }, 'save_interview_reference') + ": " + this.props.interview.short_title[locale]}
                trigger={<><FaStar /> <span>{t({ locale, translations }, 'save_interview_reference')}</span></>}
                triggerClassName="MediaControls-bookmark"
            >
                {closeModal => (
                    <UserContentFormContainer
                        title={this.defaultTitle()}
                        description=''
                        properties={{title: this.props.interview.title}}
                        reference_id={this.props.interview.id}
                        reference_type='Interview'
                        media_id={this.props.interview.archive_id}
                        type='InterviewReference'
                        submitLabel={t({ locale, translations }, 'notice')}
                        onSubmit={closeModal}
                    />
                )}
            </Modal>
        );
    }

    defaultTitle() {
        moment.locale(this.props.locale);
        let now = moment().format('lll');
        return `${this.props.archiveId} - ${this.props.interview.short_title[this.props.locale]} - ${now}`;
    }

    annotateOnSegmentLink() {
        const { locale, translations, interview, tape } = this.props;

        let sortedSegmentsWithIndex = sortedSegmentsWithActiveIndex(this.props.mediaTime, { interview, tape });

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

    annotateOnSegmentForm(sortedSegmentsWithIndex, onSubmit) {
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
                onSubmit={onSubmit}
            />
        }
    }

    tapeSelector(){
        const { locale, translations } = this.props;

        let options = [];
        for(var i = 1; i <= this.props.interview.tape_count; i++) {
                options.push(<option value={i} key={'tape' + i}>{t({ locale, translations }, 'tape')} {i}</option>);
        }
        return options;
    }

    resolutionSelector(){
        if (this.props.interview.media_type && this.props.mediaStreams) {
            let resolutions = Object.values(this.props.mediaStreams).filter(m => m.media_type === this.props.interview.media_type).map(m => m.resolution)
            if (resolutions.length > 1) {

                let options = [];
                for(var i = 0; i < resolutions.length; i++) {
                    options.push(<option value={resolutions[i]} key={'resolution' + i}>{resolutions[i]}</option>);
                }
                return (
                    <select
                        value={this.props.resolution}
                        onChange={this.handleResolutionChange}
                        className="MediaControls-resolutionSelector"
                    >
                        {options}
                    </select>
                )
            }
        }
        else {
            return null;
        }
    }

    render() {
        const { className, tape, interview, resolution } = this.props;

        return (
            <div className={classNames(className, 'MediaControls')}>
                <div className="MediaControls-selects">
                    {
                        interview.tape_count > 1 && (
                            <select
                                value={tape}
                                onChange={this.handleTapeChange}
                                className="MediaControls-tapeSelector"
                            >
                                {this.tapeSelector()}
                            </select>
                        )
                    }
                    {resolution && this.resolutionSelector()}
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
    mediaStreams: PropTypes.object.isRequired,
    resolution: PropTypes.string,
    tape: PropTypes.number.isRequired,
    translations: PropTypes.object.isRequired,
    mediaTime: PropTypes.number.isRequired,
    setTape: PropTypes.func.isRequired,
    setResolution: PropTypes.func.isRequired,
};
