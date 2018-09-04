import React from 'react';
import moment from 'moment';
import { t } from '../../../lib/utils';

export default class Segment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            active: false,
            contentOpen: false,
            contentType: 'none'
        };
    }

    componentWillReceiveProps(nextProps) {
        let active = this.props.data.end_time > nextProps.transcriptTime && this.props.data.start_time <= nextProps.transcriptTime;
        if (active !== this.state.active) {
            this.setState({
                active: active
            })
        }
    }

    heading() {
        if (this.props.data.lead_segment_heading[this.props.locale].length > 0) {
            return (
                <span>
                {t(this.props, 'in')}: "{this.props.data.lead_segment_heading[this.props.locale]}"
                &nbsp;|&nbsp;
            </span>
        )
    }
    }

    tape() {
        if (this.props.tape_count > 1){
            return (
                <span>
                    {t(this.props, 'tape')} {this.props.data.tape_nbr}/{this.props.tape_count}
                    &nbsp;|&nbsp;
                </span>
            )
        }
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

    css() {
        return 'content-search-text ' + (this.state.active ? 'active' : 'inactive');
    }

    render() {
        return (
            <div className={'content-search-row'} onClick={() => this.props.handleSegmentClick(this.props.data.tape_nbr, this.props.data.time)}>
                <p className="content-search-timecode">
                    {this.heading()}
                    {this.tape()}
                    {moment.utc(this.props.data.start_time * 1000).format("HH:mm:ss")}
                </p>
                <div className={this.css()}>
                    <p  dangerouslySetInnerHTML = {{__html:this.transcript()}}></p>
                </div>
            </div>
        )
    }
}

