import React from 'react';
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
        window.scrollTo(0, 1);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll() {
        let fixVideo = ($(document).scrollTop() > $(".SiteHeader").height());
        if (fixVideo && !this.props.transcriptScrollEnabled) {
            this.props.handleTranscriptScroll(true)
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
