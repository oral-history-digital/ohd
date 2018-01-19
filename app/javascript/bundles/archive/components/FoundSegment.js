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
        let transcript = this.props.data.transcripts[this.props.locale];
        if (transcript.length == 0){
            transcript = this.props.data.transcripts[this.props.lang];
        }
        return transcript;
    }

    render() {
        return (

            <div className={'content-search-row'} onClick={() => this.props.handleSegmentClick(this.props.data.tape_nbr, this.props.data.time)}>
                <p className="content-search-timecode">{this.props.data.timecode}</p>
                <div className="content-search-text">
                    <p  dangerouslySetInnerHTML = {{__html:this.transcript()}}></p>
                </div>
            </div>
        )
    }
}

