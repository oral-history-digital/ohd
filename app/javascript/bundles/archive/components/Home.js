import React from 'react';
import WrapperPageContainer from '../containers/WrapperPageContainer';
import InterviewPreviewContainer from '../containers/InterviewPreviewContainer';
import logo1 from '../../../images/auswaertiges-amt-logo.png';
import logo2 from '../../../images/snf-logo.jpg';
import logo3 from '../../../images/evz-off-co-d-hd-s.jpg';
import logo4 from '../../../images/fu-logo-3x.png';
import logo5 from '../../../images/logo_uni_athen.png';
import logo6 from '../../../images/heralogot.png';
import logo7 from '../../../images/EU-logo.jpg';
import PropTypes from 'prop-types';

export default class Home extends React.Component {


    static contextTypes = {
        router: PropTypes.object
    }

    componentDidMount() {
        window.scrollTo(0, 1);
    }

    componentDidUpdate(prevProps) {
        if ((prevProps.account.isFetchingAccount === undefined || prevProps.account.isFetchingAccount === false) &&
            (this.props.account.isFetchingAccount === undefined || this.props.account.isFetchingAccount === false) &&
            prevProps.account.email === undefined &&
            this.props.account.email && !this.props.account.error) {
            const url = "/" + this.props.locale + "/searches/archive";
            this.context.router.history.push(url);
        }
    }

    startVideo() {
        if (this.props.project.idenifier === 'mog') {
             return (
                 <div className='video-element home-video'>
                     <video 
                         poster="https://medien.cedis.fu-berlin.de/eog/interviews/mog/home/still-home-video.jpg" 
                         controls="false" 
                         playsinline="true"
                         src={`https://medien.cedis.fu-berlin.de/eog/interviews/mog/home/mog_home_movie_${this.props.locale}_1803.mp4`}
                     />
                 </div>
             )
        }
    }

    textOrFeaturedInterviews(moreText) {
        if (moreText) {
            return (<div dangerouslySetInnerHTML={{__html: moreText}} />)
        } else {
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

    content() {
        if (this.props.project) {
            let projectTranslation = this.props.project.translations.find(t => t.locale === this.props.locale);
            return (
                    <WrapperPageContainer
                        // show login tab automatically, unless we're in campscapes
                        // TODO: generalize this
                        tabIndex={this.props.project.identifier !== 'campscapes' ? 0 : -1}>
                        <div className='wrapper-content home-content'>
                            {this.startVideo()}
                            <div  className='home-text'>
                                <h1>{projectTranslation.name}</h1>
                                <p dangerouslySetInnerHTML={{__html: projectTranslation.introduction}} />
                            </div>
                            <div className={'search-results-container'}>
                                {this.textOrFeaturedInterviews()}
                            </div>
                        </div>
                    </WrapperPageContainer>
            )
        }
    }

    render() {
        return this.content();
    }

}
