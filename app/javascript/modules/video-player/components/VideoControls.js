import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { UserContentFormContainer } from 'modules/workbook';
import { sortedSegmentsWithActiveIndex } from 'modules/transcript';
import { t } from 'modules/i18n';
import { Modal } from 'modules/ui';

export default class VideoControls extends React.Component {
    constructor(props) {
        super(props);

        this.handleTapeChange = this.handleTapeChange.bind(this);
        this.handleResolutionChange = this.handleResolutionChange.bind(this);
    }

    handleTapeChange(e) {
        this.props.setTapeAndTimeAndResolution(parseInt(e.target.value), 0, this.props.resolution);
    }

    handleResolutionChange(e) {
        this.props.setTapeAndTimeAndResolution(this.props.tape, this.props.videoTime, e.target.value, 'pause');
    }

    rememberInterviewLink() {
        const { locale, translations } = this.props;

        return (
            <Modal
                title={t({ locale, translations }, 'save_interview_reference') + ": " + this.props.interview.short_title[locale]}
                trigger={<><i className="fa fa-star"/><span>{t({ locale, translations }, 'save_interview_reference')}</span></>}
                triggerClassName="video-bookmark"
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

        let sortedSegmentsWithIndex = sortedSegmentsWithActiveIndex(this.props.videoTime, { interview, tape });

        return (
            <Modal
                title={t({ locale, translations }, 'save_user_annotation')}
                trigger={<><i className="fa fa-pencil"></i><span>{t({ locale, translations }, 'save_user_annotation')}</span></>}
                triggerClassName="video-text-note"
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
                        className="resolutionselector"
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
        return (
            <div className="VideoHeader-controls">
                <select
                    value={this.props.tape}
                    onChange={this.handleTapeChange}
                    className={this.props.interview.tape_count == 1 ? 'hidden tapeselector' : 'tapeselector'}
                >
                    {this.tapeSelector()}
                </select>
                {this.resolutionSelector()}
                {this.annotateOnSegmentLink()}
                {this.rememberInterviewLink()}
            </div>
        );
    }
}

VideoControls.propTypes = {
    archiveId: PropTypes.string.isRequired,
    interview: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    mediaStreams: PropTypes.object.isRequired,
    resolution: PropTypes.string.isRequired,
    tape: PropTypes.number.isRequired,
    translations: PropTypes.object.isRequired,
    videoTime: PropTypes.number.isRequired,
    setTapeAndTimeAndResolution: PropTypes.func.isRequired,
};
