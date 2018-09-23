import React from 'react';
import { t, activeSegmentId } from '../../../lib/utils';
import FoundSegmentContainer from '../containers/FoundSegmentContainer';
import InterviewSearchFormContainer from '../containers/InterviewSearchFormContainer';

export default class InterviewSearch extends React.Component {

    constructor(props) {
        super(props);
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        window.removeEventListener('scroll', this.handleScroll);
        window.addEventListener('scroll', this.handleScroll);
        window.scrollTo(0, 1);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll() {
        let fixVideo = ($(document).scrollTop() > $(".site-header").height());
        if (fixVideo && !this.props.transcriptScrollEnabled) {
            this.props.handleTranscriptScroll(true)
        } else if (!fixVideo && this.props.transcriptScrollEnabled) {
            this.props.handleTranscriptScroll(false)
        }
    }


    renderSegments() {
        if(this.props.foundSegments) {
            return this.props.foundSegments.map( (segment, index) => {
                return (
                    <FoundSegmentContainer
                        data={segment}
                        active={parseInt(segment.id) === activeSegmentId(this.props)}
                        key={"segment-" + segment.id}
                        tape_count={this.props.interview.tape_count}
                    />
                )
            })
        }
    }

    contentSearchResults() {
        if (!this.props.isInterviewSearching) {
            let count = this.props.foundSegments ? this.props.foundSegments.length : 0;
            return (
                <div>
                    <div className="content-search-legend"><p>{count} {t(this.props, 'archive_results')}</p></div>
                    {this.renderSegments()}
                </div>
            );
        }
    }

    render () {
        return (
            <div>
                <InterviewSearchFormContainer />
                {this.contentSearchResults()}
            </div>
        );
    }
}

