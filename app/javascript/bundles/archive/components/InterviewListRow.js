import React from 'react';
import {Link} from 'react-router-dom';

import { t, admin, pathBase } from '../../../lib/utils';

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
        return props.project.list_columns.map(function(column, i){
            let value = props.interview[column.name];
            if (typeof value === 'object' && value !== null)
                value = value[props.locale]
            return (
                <td key={i}>{value || '---'}</td>
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

    title() {
        if (this.props.project.is_catalog) {
            return this.props.interview.title && this.props.interview.title[this.props.locale];
        } else {
            return (
                <div>
                    <AuthShowContainer ifLoggedIn={true}>
                        {this.props.interview.short_title && this.props.interview.short_title[this.props.locale]}
                    </AuthShowContainer>
                    <AuthShowContainer ifLoggedOut={true}>
                        {this.props.interview.anonymous_title && this.props.interview.anonymous_title[this.props.locale]}
                    </AuthShowContainer>
                </div>
            )
        }
    }

    render() {
        return (
            <tr>
                {this.renderExportCheckbox()}
                <td>
                    <Link className={'search-result-link'}
                        onClick={() => {
                            this.props.searchInInterview(`${pathBase(this.props)}/searches/interview`, {fulltext: this.props.fulltext, id: this.props.interview.archive_id});
                            this.props.setTapeAndTime(1, 0);
                        }}
                        to={pathBase(this.props) + '/interviews/' + this.props.interview.archive_id}
                    >
                        {this.title()}
                    </Link>
                </td>
                {this.columns()}
            </tr>
        );
    }
}

