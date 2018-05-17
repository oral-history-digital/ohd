import React from 'react';
import { t } from '../../../lib/utils';
import {Link, hashHistory} from 'react-router-dom';
import moment from 'moment';



export default class CitationInfoInfo extends React.Component {

    name(person) {
        if (person) {
            return `${person.names[this.props.locale].firstname} ${person.names[this.props.locale].lastname}`;
        }
    }

    content(label, value, className) {
        return (
            <p>
                <span className="flyout-content-label">{label}:</span>
                <span className={"flyout-content-data "+className}>{value}</span>
            </p>
        )
    }


    project(){
        if (this.props.projectName && this.props.projectDomain){
            return `${t(this.props, 'interview_archive')} "${this.props.projectName[this.props.locale]}", ${this.props.archiveDomain}`;
        }
        return "";
    }


    render() {
        let citation = `${this.name(this.props.interview.interviewees[0])}, 
        ${t(this.props, 'interview')} 
        ${this.props.interview.archive_id},  
        ${this.props.interview.created},
        ${this.project()},
        ${t(this.props, 'doi')}: ${this.props.projectDoi + this.props.interview.archive_id}, 
        (${t(this.props, 'called')}: ${moment().format('DD.MM.YYYY')})`;

        return (
            <div>
                {this.content(t(this.props, 'citation'), citation)}
                {this.content(t(this.props, 'doi'), this.props.projectDoi + this.props.interview.archive_id)}
            </div>
        );
    }
}

