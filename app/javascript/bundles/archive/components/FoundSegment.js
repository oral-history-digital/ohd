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

    counter() {
        if(this.props.index && this.props.foundSegmentsAmount){
            return (
                <div className={'hits-count'}>
                        <div>{this.props.index}/{this.props.foundSegmentsAmount}</div>
                    </div>
            )
        } else {
            return null;
        }
    }

    css() {
        return 'content-search-text ' + (this.props.active ? 'active' : 'inactive');
    }

    render() {
        let tabIndex = (this.props.interview && this.props.locale === this.props.interview.lang) ? 0 : 1;
        return (
            <div className={'content-search-row'} onClick={() => this.props.handleSegmentClick(this.props.data.tape_nbr, this.props.data.time, tabIndex)}>
                {this.counter()}
                <p className="content-search-timecode">
                    {this.heading()}
                    {this.tape()}
                    {moment.utc(this.props.data.time * 1000).format("HH:mm:ss")}
                </p>
                <div className={this.css()}>
                    <p dangerouslySetInnerHTML={{__html: this.props.data.text[this.props.locale]}} />
                </div>
            </div>
        )
    }
}

