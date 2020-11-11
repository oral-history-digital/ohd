import React from 'react';

import InterviewEditViewContainer from '../containers/InterviewEditViewContainer';
import InterviewDetailsLeftSideContainer from '../containers/InterviewDetailsLeftSideContainer';
import VideoPlayerContainer from '../containers/VideoPlayerContainer';
import InterviewTabsContainer from '../containers/InterviewTabsContainer';
import AuthShowContainer from '../containers/AuthShowContainer';

export default class Interview extends React.Component {

    componentDidMount() {
        this.setArchiveId();
        this.loadInterview();
        this.loadContributors();

        this.props.setFlyoutTabsIndex(2);
    }

    componentDidUpdate() {
        this.setArchiveId();
        this.loadInterview();
        this.loadContributors();
    }

    setArchiveId() {
        if ( this.props.match.params.archiveId !== this.props.archiveId) {
            this.props.setArchiveId(this.props.match.params.archiveId);
        }
    }

    loadInterview() {
        if (
            !this.props.interviewsStatus[this.props.match.params.archiveId] ||
            this.props.interviewsStatus[this.props.match.params.archiveId].split('-')[0] === 'reload'
        ) {
            this.props.fetchData(this.props, 'interviews', this.props.match.params.archiveId);
        }
    }

    interviewLoaded() {
        return this.props.interviewsStatus[this.props.match.params.archiveId] &&
            (this.props.interviewsStatus[this.props.match.params.archiveId].split('-')[0] === 'fetched' ||
            this.props.interviewsStatus[this.props.match.params.archiveId].split('-')[0] === 'processed');
    }

    loadContributors() {
        if (
            this.interviewLoaded() &&
            !this.props.peopleStatus[`contributors_for_interview_${this.interview().id}`]
        ) {
            this.props.fetchData(this.props, 'people', null, null, `contributors_for_interview=${this.interview().id}`);
        }
    }

    interview() {
        return this.interviewLoaded() ? this.props.interviews[this.props.match.params.archiveId] : {};
    }

    loggedOutContent() {
        if (this.interviewLoaded() && this.props.interviews) {
            return (
                <div>
                    <div className='wrapper-video' >
                        <div className={"video-title-container"}>
                            <h1 className='video-title'>
                                {this.props.project.fullname_on_landing_page ? this.interview().title[this.props.locale] : this.interview().anonymous_title[this.props.locale]}
                            </h1>
                        </div>
                        <div className='video-element'>
                            <img src={this.interview().still_url}/>
                        </div>
                    </div>
                    {this.landingPageText()}
                </div>
            )
        } else {
            return null;
        }
    }

    landingPageText() {
        return (
            <div className='wrapper-content'
                 dangerouslySetInnerHTML={{__html: this.interview().landing_page_texts[this.props.locale]}}
            />
        )
    }

    innerContent() {
        if (this.props.interviewEditView) {
            return (
                <InterviewEditViewContainer
                    interview={this.interview()}
                />
            )
        } else {
            return (
                <InterviewTabsContainer
                    interview={this.interview()}
                />
            )
        }
    }

    content() {
        if (this.interviewLoaded()){
            if (this.props.isCatalog) {
                return (<InterviewDetailsLeftSideContainer interview={this.interview()} />);
            } else {
                return (
                    <div>
                        <AuthShowContainer ifLoggedIn={true}>
                            <VideoPlayerContainer
                                interview={this.interview()}
                            />
                            {this.innerContent()}
                        </AuthShowContainer>
                        <AuthShowContainer ifLoggedOut={true} ifNoProject={true}>
                            {this.loggedOutContent()}
                        </AuthShowContainer>
                    </div>
                )
            }
        } else {
            return null;
        }
    }

    render() {
        return this.content();
    }
}
