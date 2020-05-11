import React from 'react';
import { t } from '../../../lib/utils';
import moment from 'moment';

export default class CitationInfoInfo extends React.Component {

    content(label, value, className) {
        return (
            <p>
                <span className="flyout-content-label">{label}:</span>
                <span className={"flyout-content-data "+className}>{value}</span>
            </p>
        )
    }

    project(){
        if (this.props.projectName && this.props.archiveDomain){
            return `${this.props.projectName[this.props.locale]}, ${this.props.archiveDomain}`;
        }
        return "";
    }

    doi(withCalled=false) {
        if (this.props.interview.doi_status === 'created') {
            let doi = `https://doi.org/${this.props.projectDoi}/${this.props.projectId}.${this.props.interview.archive_id}`;
            let called = withCalled ? ` (${t(this.props, 'called')}: ${moment().format('DD.MM.YYYY')})` : '';
            return `, ${t(this.props, 'doi.name')}: ${doi}${called}`;
        } else {
            return '';
        }
    }

    render() {
        if (this.props.interview) {
            let citation = `${this.props.interview.short_title && this.props.interview.short_title[this.props.locale]},
            ${t(this.props, 'interview')}
            ${this.props.interview.archive_id},
            ${this.props.interview.interview_date},
            ${this.project()}${this.doi(true)}`

            return (
                <div>
                    {this.content(t(this.props, 'citation'), citation)}
                </div>
            );
        } else {
            return null;
        }
    }
}
