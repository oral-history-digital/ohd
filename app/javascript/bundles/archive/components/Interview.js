import React from 'react';
import { Link } from 'react-router-dom';

import WrapperPageContainer from '../containers/WrapperPageContainer';
import InterviewDataContainer from '../containers/InterviewDataContainer';
import InterviewEditViewContainer from '../containers/InterviewEditViewContainer';
import InterviewDetailsLeftSideContainer from '../containers/InterviewDetailsLeftSideContainer';
import VideoPlayerContainer from '../containers/VideoPlayerContainer';
import InterviewTabsContainer from '../containers/InterviewTabsContainer';
import AuthShowContainer from '../containers/AuthShowContainer';
import { t } from '../../../lib/utils';

export default class Interview extends React.Component {

    componentDidMount() {
        this.setArchiveId();
        this.loadInterview();
        this.loadContributors();
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

    content() {
        if (this.interviewLoaded()){
            if (this.props.isCatalog) {
                return (<InterviewDetailsLeftSideContainer interview={this.interview()} />);
            } else if (this.props.interviewEditView) {
                return (
                    <div>
                        <AuthShowContainer ifLoggedIn={true}>
                            <VideoPlayerContainer
                                interview={this.interview()}
                            />
                            <InterviewEditViewContainer
                                interview={this.interview()}
                            />
                        </AuthShowContainer>
                        <AuthShowContainer ifLoggedOut={true}>
                            {this.loggedOutContent()}
                        </AuthShowContainer>
                    </div>
                )
            } else {
                return (
                    <div>
                        <AuthShowContainer ifLoggedIn={true}>
                            <VideoPlayerContainer
                                interview={this.interview()}
                            />
                            <InterviewTabsContainer
                                interview={this.interview()}
                            />
                        </AuthShowContainer>
                        <AuthShowContainer ifLoggedOut={true}>
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
        let tabIndex = this.props.locales.length + 2;
        return (
            <WrapperPageContainer tabIndex={tabIndex}>
                {this.content()}
            </WrapperPageContainer>
        )
    }
}

