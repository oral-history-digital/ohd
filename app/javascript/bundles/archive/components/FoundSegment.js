import React from 'react';
import moment from 'moment';
import { t } from '../../../lib/utils';

export default class Segment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            contentOpen: false,
            contentType: 'none'
        };
    }

    componentWillReceiveProps(nextProps) {
    }

    heading() {
        if (this.props.data.last_heading && this.props.data.last_heading[this.props.locale]) {
            return (
                <span>
                {t(this.props, 'in')}: "{this.props.data.last_heading[this.props.locale]}"
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
        let segment = this.props.data.text[this.props.locale];
        if (!segment || segment.length === 0){
            for (let lang in this.props.data.text) {
                if (lang != this.props.locale) {
                    segment = this.props.data.text[lang];
                    if (segment.length > 0) break;
                }
            }
        }
        return segment;
    }

    css() {
        return 'content-search-text ' + (this.props.active ? 'active' : 'inactive');
    }

    render() {
        let tabIndex = 0
        if(this.props.data.text['orig']){
            tabIndex = (this.props.data.text['orig'] === '') ? 1 : 0; 
        } else {
            tabIndex = (this.props.interview && this.props.locale === this.props.interview.lang) ? 0 : 1;
        }
        return (
            <div className={'content-search-row'} onClick={() => this.props.handleSegmentClick(this.props.data.tape_nbr, this.props.data.time, tabIndex)}>
                <p className="content-search-timecode">
                    {this.heading()}
                    {this.tape()}
                    {moment.utc(this.props.data.time * 1000).format("HH:mm:ss")}
                </p>
                <div className={this.css()}>
                    <p dangerouslySetInnerHTML={{__html:this.transcript()}} />
                </div>
            </div>
        )
    }
}

