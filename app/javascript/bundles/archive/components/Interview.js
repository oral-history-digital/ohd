import React from 'react';
import { Link } from 'react-router-dom';

import WrapperPageContainer from '../containers/WrapperPageContainer';
import InterviewInfoContainer from '../containers/InterviewInfoContainer';
import InterviewDataContainer from '../containers/InterviewDataContainer';
import InterviewRegistryReferencesContainer from '../containers/InterviewRegistryReferencesContainer';
import PersonDataContainer from '../containers/PersonDataContainer';
import VideoPlayerContainer from '../containers/VideoPlayerContainer';
import InterviewTabsContainer from '../containers/InterviewTabsContainer';
import AuthShowContainer from '../containers/AuthShowContainer';
import { t } from '../../../lib/utils';

export default class Interview extends React.Component {

    componentDidMount() {
        this.setArchiveId();
        this.loadInterview();
        this.loadContributors();
        this.loadDoiContent();
    }

    componentDidUpdate() {
        this.setArchiveId();
        this.loadInterview();
        this.loadContributors();
        this.loadDoiContent();
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
            this.props.fetchData('interviews', this.props.match.params.archiveId);
        }
    }

    interviewLoaded() {
        return this.props.interviewsStatus[this.props.match.params.archiveId] && 
            this.props.interviewsStatus[this.props.match.params.archiveId].split('-')[0] === 'fetched';
    }

    loadContributors() {
        if ( 
            this.interviewLoaded() &&
            !this.props.peopleStatus[`contributors_for_interview_${this.interview().id}`]
        ) {
            this.props.fetchData('people', null, null, this.props.locale, `contributors_for_interview=${this.interview().id}`);
        }
    }

    interview() {
        return this.interviewLoaded() ? this.props.interviews[this.props.match.params.archiveId] : {};
    }

    loadDoiContent() {
        if (!this.props.doiContentsStatus[`for_interviews_${this.props.match.params.archiveId}`]) {
            this.props.fetchData('interviews', this.props.match.params.archiveId, 'doi_contents');
        }
    }

    doiContentLoaded() {
        return this.props.doiContentsStatus[`for_interviews_${this.props.match.params.archiveId}`] && 
               this.props.doiContentsStatus[`for_interviews_${this.props.match.params.archiveId}`].split('-')[0] === 'fetched';
    }

    loggedOutContent() {
        if (this.interviewLoaded() && this.props.interviews) {
            return (
                <div>
                    <div className='wrapper-video' >
                        <div className={"video-title-container"}>
                            <h1 className='video-title'>
                                {this.props.interviews[this.props.match.params.archiveId].anonymous_title[this.props.locale]}
                            </h1>
                        </div>
                        <div className='video-element'>
                            <img src={this.interview().still_url}/>
                        </div>
                    </div>
                    {this.doiContent()}
                </div>
            )
        } else {
            return null;
        }
    }

    doiContent() {
        if (this.doiContentLoaded()) {
            return (
                <div className='wrapper-content'
                     dangerouslySetInnerHTML={{__html: this.interview().doi_contents[this.props.locale]}}
                />
            )
        } else {
            return null;
        }
    }

    content() {
        if (this.interviewLoaded()){
            let tabIndex = this.props.locales.length + 2;
            return (
                <WrapperPageContainer tabIndex={tabIndex}>
                    <AuthShowContainer ifLoggedIn={true}>
                        <VideoPlayerContainer interview={this.interview()}/>
                        <InterviewTabsContainer interview={this.interview()}/>
                    </AuthShowContainer>
                    <AuthShowContainer ifLoggedOut={true}>
                        {this.loggedOutContent()}
                    </AuthShowContainer>
                    {/* for campscapes only: show metadata on left side. TODO: generalize this */}
                    <div style={{"padding": "5%"}} className={this.props.project !== 'campscapes' && 'hidden'}>
                        <h3>{t(this.props, 'person_info')}</h3>
                        <div>
                            <PersonDataContainer/>
                            <InterviewRegistryReferencesContainer
                                refObjectType={'person'}
                            />
                        </div>
                        <h3>{t(this.props, 'interview_info')}</h3>
                        <InterviewInfoContainer refObjectType={'interview'}/>
                    </div>
                    {/* TODO: this div is needs to get a better structure, and inline styles have to be removed */}
                    <div style={{'padding': '5%'}} className={this.props.project !== 'campscapes' && 'hidden'}>
                        <Link className={`search-result-link ${!!this.props.prevArchiveId || 'hidden'}`}
                            to={'/' + this.props.locale + '/interviews/' + this.props.prevArchiveId}
                            style={{'padding-right': '10%'}}
                        >
                            <i className={'fa fa-chevron-left'} />
                            {this.props.prevArchiveId}
                        </Link>
                        <Link className={`search-result-link ${!!this.props.nextArchiveId || 'hidden'}`}
                            to={'/' + this.props.locale + '/interviews/' + this.props.nextArchiveId}
                        >
                            {this.props.nextArchiveId}
                            <i className={'fa fa-chevron-right'} style={{'margin-left': 10}}/>
                        </Link>
                    </div>
                </WrapperPageContainer>
            );
        } else {
            return null;
        }
    }

    render() {
        return this.content();
    }
}

