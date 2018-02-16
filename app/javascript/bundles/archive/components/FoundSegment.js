import React from 'react';
import UserContentFormContainer from '../containers/UserContentFormContainer';
import moment from 'moment';


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
        let segment = this.props.data.transcripts[this.props.locale];
        if (!segment || segment.length === 0){
            for (let lang in this.props.data.transcripts) {
                if (lang != this.props.locale) {
                    segment = this.props.data.transcripts[lang];
                    if (segment.length > 0) break;
                }
            }
        }
        return segment;
    }

    render() {
        return (
            <div className={'content-search-row'} onClick={() => this.props.handleSegmentClick(this.props.data.tape_nbr, this.props.data.time)}>
                <p className="content-search-timecode">{moment.utc(this.props.data.time * 1000).format("HH:mm:ss")}</p>
                <div className="content-search-text">
                    <p  dangerouslySetInnerHTML = {{__html:this.transcript()}}></p>
                </div>
            </div>
        )
    }
}

