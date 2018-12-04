import React from 'react';
import { t, pluralize } from '../../../lib/utils';
import FoundSegmentContainer from '../containers/FoundSegmentContainer';
import PersonContainer from '../containers/PersonContainer';
import BiographicalEntryContainer from '../containers/BiographicalEntryContainer';
import PhotoContainer from '../containers/PhotoContainer';
import InterviewSearchFormContainer from '../containers/InterviewSearchFormContainer';

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
        } else if (!fixVideo && this.props.transcriptScrollEnabled) {
            this.props.handleTranscriptScroll(false)
        }
    }

    components() {
        return {
            Segment: FoundSegmentContainer,
            Person: PersonContainer,
            BiographicalEntry: BiographicalEntryContainer,
            Photo: PhotoContainer,
        }
    }
    
    renderResults(model) {
        if(this.props[`found${pluralize(model)}`]) {
            let active = false;
            return this.props[`found${pluralize(model)}`].map( (data, index) => {
                if (model === 'Segment') {
                    if (data.time <= this.props.transcriptTime + 10 && data.time >= this.props.transcriptTime - 5) {
                        active = true;
                    }
                }
                return (
                    React.createElement(this.components()[model], 
                        {
                            data: data,
                            key: `search-result-${model}-${data.id}`,
                            tape_count: this.props.interview.tape_count,
                            active: false
                        }
                    )
                )
            })
        }
    }

    searchResults(model, modelIndex) {
        if (!this.props.isInterviewSearching) {
            let count = this.props[`found${pluralize(model)}`] ? this.props[`found${pluralize(model)}`].length : 0;
            return (
                <div key={modelIndex}>
                    <div className="content-search-legend"><p>{count} {t(this.props, model.toLowerCase() + '_results')}</p></div>
                    {this.renderResults(model)}
                </div>
            );
        }
    }

    render () {
        return (
            <div>
                <InterviewSearchFormContainer />
                {['Segment', 'Person', 'BiographicalEntry', 'Photo'].map((model, modelIndex) => {
                    return this.searchResults(model, modelIndex)
                })}
            </div>
        );
    }
}

