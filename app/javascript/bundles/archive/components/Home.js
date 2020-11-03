import React from 'react';
import InterviewPreviewContainer from '../containers/InterviewPreviewContainer';
import PropTypes from 'prop-types';

export default class Home extends React.Component {


    static contextTypes = {
        router: PropTypes.object
    }

    componentDidMount() {
        window.scrollTo(0, 1);
        this.loadRandomFeaturedInterviews();
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.isLoggedIn && this.props.isLoggedIn) {
            const url = "/" + this.props.locale + "/searches/archive";
            this.context.router.history.push(url);
        } else {
            this.loadRandomFeaturedInterviews();
        }
    }

    loadRandomFeaturedInterviews() {
        if (
            !this.props.randomFeaturedInterviewsStatus.all
        ) {
            this.props.fetchData(this.props, 'random_featured_interviews');
        }
    }

    startVideo() {
        // TODO: put the 'if' to project-conf
        if (this.props.project.identifier === 'mog') {
             return (
                 <div className='video-element home-video'>
                     <video
                         poster="https://medien.cedis.fu-berlin.de/eog/interviews/mog/home/still-home-video.jpg"
                         controls={false}
                         playsInline={true}
                         src={`https://medien.cedis.fu-berlin.de/eog/interviews/mog/home/mog_home_movie_${this.props.locale}_1803.mp4`}
                     />
                 </div>
             )
        }
    }

    featuredInterviews() {
        if (
            // TODO: put the first two lines to project-conf
            this.props.project.identifier !== 'mog' &&
            this.props.project.identifier !== 'campscapes' &&
            this.props.randomFeaturedInterviewsStatus.all &&
            this.props.randomFeaturedInterviewsStatus.all.split('-')[0] === 'fetched'
        ) {
            return (
                Object.keys(this.props.randomFeaturedInterviews).map((i, index) => {
                    let interview = this.props.randomFeaturedInterviews[i];
                    return <InterviewPreviewContainer
                        interview={interview}
                        key={"interview-" + interview.archive_id + "-" + index}
                    />;
                })
            )
        }
    }

    moreText(text) {
        if (text) {
            return <p dangerouslySetInnerHTML={{__html: text}} />
        } else {
            return null;
        }
    }

    content() {
        if (this.props.project) {
            let projectTranslation = this.props.project.translations.find(t => t.locale === this.props.locale);
            return (
                <div className='wrapper-content home-content'>
                    {this.startVideo()}
                    <div  className='home-text'>
                        <h1>{projectTranslation.name}</h1>
                        <div dangerouslySetInnerHTML={{__html: projectTranslation.introduction}} />
                    </div>
                    <div className={'search-results-container'}>
                        {this.moreText(projectTranslation.more_text)}
                        {this.featuredInterviews()}
                    </div>
                </div>
            )
        }
    }

    render() {
        return this.content();
    }

}
