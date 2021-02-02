import React from 'react';
import {Link} from 'react-router-dom';
import Slider from "react-slick";
import FoundSegmentContainer from '../containers/FoundSegmentContainer';
import PersonContainer from '../containers/PersonContainer';
import BiographicalEntryContainer from '../containers/BiographicalEntryContainer';
import { PhotoContainer } from 'modules/gallery';
import { RegistryEntryContainer } from 'modules/registry';
import { t, pluralize, pathBase } from '../../../lib/utils';

export default class InterviewSearchResults extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            open: Array(5).fill(false)
        }
    }

    components() {
        return {
            Segment: FoundSegmentContainer,
            Person: PersonContainer,
            BiographicalEntry: BiographicalEntryContainer,
            Photo: PhotoContainer,
            RegistryEntry: RegistryEntryContainer,
        }
    }

    handleClick(event, count, i) {
      if (count > 0) {
        let open = this.state.open.slice();
        open[i] = !open[i]
        this.setState({open: open})
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
            let iconCss = this.state.open[modelIndex] || count === 0 ? 'heading-ico active' : 'heading-ico inactive';
            let expandedCss = this.state.open[modelIndex] ? 'expanded' : 'collapsed'

            return (
                <div className='heading' key={modelIndex} >
                    <div className={iconCss} onClick={() => this.handleClick(event, count, modelIndex)}></div>
                    <div className='mainheading' onClick={() => this.handleClick(event, count, modelIndex)}>{count} {t(this.props, model.toLowerCase() + '_results')}</div>
                    <div className={expandedCss}>{this.renderResults(model)}</div>
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
                <div className='content-index content-search-entries'>
                    {['Segment', 'Person', 'BiographicalEntry', 'Photo', 'RegistryEntry'].map((model, modelIndex) => {
                        return this.searchResults(model, modelIndex)
                    })}
                </div>
            )
        }
    }
}
