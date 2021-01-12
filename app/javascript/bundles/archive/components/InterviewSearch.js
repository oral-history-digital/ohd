import React from 'react';
import InterviewSearchFormContainer from '../containers/InterviewSearchFormContainer';
import InterviewSearchResultsContainer from '../containers/InterviewSearchResultsContainer';

export default class InterviewSearch extends React.Component {

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
