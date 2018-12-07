import React from 'react';
import {Link} from 'react-router-dom';

import { t } from '../../../lib/utils';

export default class InterviewListRow extends React.Component {

    constructor(props) {
        super(props);
        // this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
    }

    content(label, value) {
        return (
            <div>
                {label}:&nbsp;
                <span>{value}</span>
            </div>
        )
    }



    typologies(){
        let interviewee =  this.props.interview.interviewees && this.props.interview.interviewees[0];
        if (interviewee && interviewee.typology && interviewee.typology[this.props.locale]) {
            //if (interviewee.typology[this.props.locale] && interviewee.typology[this.props.locale].length > 1) {
                return this.content(t(this.props, 'typologies'), interviewee.typology[this.props.locale].join(', '), "");
            //} else if (interviewee.typology && interviewee.typology[this.props.locale].length == 1) {
                //return this.content(t(this.props, 'typology'), interviewee.typology[this.props.locale][0], "");
            //}
        }
    }





    render() {
        return (
            <tr>
                <td>
                    <Link className={'search-result-link'}
                        onClick={() => {
                            this.props.searchInInterview({fulltext: this.props.fulltext, id: this.props.interview.archive_id});
                            this.props.setTapeAndTime(1, 0);
                        }}
                        to={'/' + this.props.locale + '/interviews/' + this.props.interview.archive_id}
                        element='tr'
                    >
                        {this.props.interview.short_title && this.props.interview.short_title[this.props.locale]}
                    </Link>
                </td>
                <td>{this.props.interview.video_array[this.props.locale]}</td>
                <td>{this.props.interview.formatted_duration}</td>
                <td>{this.props.interview.languages_array[this.props.locale]}</td>
            </tr>
        );
    }
}

