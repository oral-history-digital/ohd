import React from 'react';
import {Link} from 'react-router-dom';
import Slider from "react-slick";
import '../../../css/slick.css';
import '../../../css/slick-theme.css';
import FoundSegmentContainer from '../containers/FoundSegmentContainer';
import PersonContainer from '../containers/PersonContainer';
import BiographicalEntryContainer from '../containers/BiographicalEntryContainer';
import PhotoContainer from '../containers/PhotoContainer';
import RegistryEntryContainer from '../containers/RegistryEntryContainer';
import { t, pluralize, pathBase } from '../../../lib/utils';

export default class InterviewSearchResults extends React.Component {

    components() {
        return {
            Segment: FoundSegmentContainer,
            Person: PersonContainer,
            BiographicalEntry: BiographicalEntryContainer,
            Photo: PhotoContainer,
            RegistryEntry: RegistryEntryContainer,
        }
    }
    
    renderResults(model) {
        if(this.props.searchResults[`found${pluralize(model)}`]) {
            let active = false;
            return this.props.searchResults[`found${pluralize(model)}`].map( (data, index) => {
                if (model === 'Segment') {
                    if (data.time <= this.props.transcriptTime + 10 && data.time >= this.props.transcriptTime - 5) {
                        active = true;
                    }
                }

                let result = React.createElement(this.components()[model], 
                    {
                        data: data,
                        key: `search-result-${model}-${data.id}`,
                        tape_count: this.props.interview.tape_count,
                        active: false,
                        // TODO: reintegrate counter with different models
                        //index: index+1,
                        //foundSegmentsAmount: this.props.searchResults.foundSegments.length
                    }
                )

                if (this.props.asSlideShow) {
                    return (
                        <Link 
                            key={`search-result-link-${model}-${data.id}`}
                            onClick={() => { 
                                this.props.setArchiveId(this.props.interview.archive_id); 
                                this.props.setTapeAndTime(1, 0) 
                            }}
                            to={pathBase(this.props) + '/interviews/' + this.props.interview.archive_id}
                        >
                            {result}
                        </Link>
                    )
                } else {
                    return result;
                }
            })
        }
    }

    searchResults(model, modelIndex) {
        if (!this.props.isInterviewSearching && this.props.searchResults) {
            let count = this.props.searchResults[`found${pluralize(model)}`] ? this.props.searchResults[`found${pluralize(model)}`].length : 0;
            return (
                <div key={modelIndex}>
                    <div className="content-search-legend"><p>{count} {t(this.props, model.toLowerCase() + '_results')}</p></div>
                    {this.renderResults(model)}
                </div>
            );
        }
    }

    render () {
        if (this.props.asSlideShow) {
            let settings = {
                infinite: false,
            };
            return (
                <Slider {...settings}>
                    {['Segment', 'Person', 'BiographicalEntry', 'Photo', 'RegistryEntry'].map((model, modelIndex) => {
                        return this.renderResults(model, modelIndex)
                    })}
                </Slider>
            )
        } else {
            return (
                <div>
                    {['Segment', 'Person', 'BiographicalEntry', 'Photo', 'RegistryEntry'].map((model, modelIndex) => {
                        return this.searchResults(model, modelIndex)
                    })}
                </div>
            )
        }
    }
}

