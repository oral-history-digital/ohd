import React from 'react';
import { t, pluralize } from '../../../lib/utils';
import InterviewSearchFormContainer from '../containers/InterviewSearchFormContainer';
import InterviewSearchResultsContainer from '../containers/InterviewSearchResultsContainer';

export default class InterviewSearch extends React.Component {

    constructor(props) {
        super(props);
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        window.removeEventListener('scroll', this.handleScroll);
        window.addEventListener('scroll', this.handleScroll);
        if(this.props.transcriptScrollEnabled) {
            window.scrollTo(0, 114);
        } else {
            window.scrollTo(0, 1);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll() {
        let fixVideo = ($(document).scrollTop() > $(".site-header").height());
        if (fixVideo && !this.props.transcriptScrollEnabled) {
            this.props.handleTranscriptScroll(true)
        // } else if (!fixVideo && this.props.transcriptScrollEnabled) {
        //     this.props.handleTranscriptScroll(false)
        }
    }

    render () {
        return (
            <div>
                <InterviewSearchFormContainer />
                <InterviewSearchResultsContainer 
                    interview={this.props.interviews[this.props.archiveId]}
                    searchResults={this.props.interviewSearchResults[this.props.archiveId]} 
                />
            </div>
        );
    }
}

