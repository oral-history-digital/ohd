import React from 'react';
import {Link} from 'react-router-dom';

import { t, admin } from '../../../lib/utils';

import AuthShowContainer from '../containers/AuthShowContainer';

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

    columns(){
        let props = this.props
        return props.listColumns.map(function(column, i){
            let label = (props.interview[column.name] && props.interview[column.name][props.locale])
            return (
                <td key={i}>{(label && ''+label) || '---'}</td>
            )
        })
    }

    renderExportCheckbox() {
        if (admin(this.props, {type: 'Interview', action: 'update'})) {
            return <td>
                <input 
                    type='checkbox' 
                    className='export-checkbox' 
                    checked={this.props.selectedArchiveIds.indexOf(this.props.interview.archive_id) > 0} 
                    onChange={() => {this.props.addRemoveArchiveId(this.props.interview.archive_id)}}
                />
            </td>
        } else {
            return null;
        }
    }

    render() {
        return (
            <tr>
                {this.renderExportCheckbox()}
                <td>
                    <Link className={'search-result-link'}
                        onClick={() => {
                            this.props.searchInInterview({fulltext: this.props.fulltext, id: this.props.interview.archive_id});
                            this.props.setTapeAndTime(1, 0);
                        }}
                        to={'/' + this.props.locale + '/interviews/' + this.props.interview.archive_id}
                        element='tr'
                    >
                        <AuthShowContainer ifLoggedIn={true}>
                            {this.props.interview.short_title && this.props.interview.short_title[this.props.locale]}
                        </AuthShowContainer>
                        <AuthShowContainer ifLoggedOut={true}>
                            {this.props.interview.anonymous_title && this.props.interview.anonymous_title[this.props.locale]}
                        </AuthShowContainer>
                    </Link>
                </td>
                {this.columns()}
            </tr>
        );
    }
}

