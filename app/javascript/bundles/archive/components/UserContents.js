import React from 'react';

import UserContentContainer from '../containers/UserContentContainer';

export default class UserContents extends React.Component {
  
    componentDidMount() {
        if (!this.userContentsLoaded()) {
            this.props.fetchUserContents();
        }
    }

    userContentsLoaded() {
        return this.props.userContents && !this.props.userContents.fetched;
    }

    sortedContent() {
        let searches = [];
        let userAnnotations = [];
        let interviewReferences = [];
        
        for(let i = 0; i < this.props.contents.length; i++) {
            if(this.props.contents[i].type === 'Search') {
                searches.push(<UserContentContainer data={this.props.contents[i]} key={`search-${i}`} />);
            } else if(this.props.contents[i].type === 'UserAnnotation') {
                userAnnotations.push(<UserContentContainer data={this.props.contents[i]} key={`userAnnotation-${i}`} />);
            } else if(this.props.contents[i].type === 'InterviewReference') {
                interviewReference.push(<UserContentContainer data={this.props.contents[i]} key={`interviewReference-${i}`} />);
            }
        }
        return {
            searches: searches, 
            userAnnotations: userAnnotations,
            interviewReferences: interviewReferences
        }
    }

    render() {
        let searches = this.sortedContent().searches;
        let userAnnotations = this.sortedContent().userAnnotations;
        let interviewReferences = this.sortedContent().interviewReferences;

        return (
            <div className='userContents'>
                <div className='searches'>
                    <h3>Searches</h3>
                    {searches}
                </div>
                <div className='userAnnotations'>
                    <h3>User Annotations</h3>
                    {userAnnotations}
                </div>
                <div className='interviewReferences'>
                    <h3>Interview References</h3>
                    {interviewReferences}
                </div>
            </div>
        );
    }
}

