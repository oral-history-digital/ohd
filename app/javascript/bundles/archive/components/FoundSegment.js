import React from 'react';
import UserContentFormContainer from '../containers/UserContentFormContainer';


export default class Segment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            active: false,
            contentOpen: false,
            contentType: 'none'
        };
    }


    transcript() {
        let locale = this.props.originalLocale ? this.props.interview.lang : this.props.locale;
        return this.props.data.transcripts[locale.substring(0,2)]
    }




    render() {
        let locale = this.props.originalLocale ? this.props.interview.lang.substring(0,2) : this.props.locale;
        let annotionCss = this.props.data.annotation_texts.length > 0 ? 'content-trans-text-ico-link' : 'hidden';
        let referenceCss = this.props.data.references.length > 0 ? 'content-trans-text-ico-link' : 'hidden';
        //let referenceCss = this.props.data.references_count > 0 ? 'content-trans-text-ico-link' : 'hidden';
        let icoCss = this.state.contentOpen ? 'content-trans-text-ico active': 'content-trans-text-ico';
        let contentOpenClass = this.state.contentOpen ? 'content-trans-text-element' : 'hidden';





        return (

            <div onClick={() => this.props.handleSegmentClick(this.props.data.time)}>
                <p className="content-search-timecode">{this.props.data.timecode}</p>
                <div className="content-search-text">
                    <p  dangerouslySetInnerHTML = {{__html:this.transcript()}}></p>
                </div>
            </div>
        )
    }
}

