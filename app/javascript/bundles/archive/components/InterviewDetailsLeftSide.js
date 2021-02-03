import React from 'react';
import { Link } from 'react-router-dom';

import InterviewInfoContainer from '../containers/InterviewInfoContainer';
import SelectedRegistryReferencesContainer from '../containers/SelectedRegistryReferencesContainer';
import ContentField from './ContentField';
import PersonDataContainer from '../containers/PersonDataContainer';
import { getInterviewArchiveIdWithOffset, pathBase } from 'lib/utils';
import { t } from 'modules/i18n';

export default class InterviewDetailsLeftSide extends React.Component {

    componentDidMount() {
        let nextArchiveId = getInterviewArchiveIdWithOffset(this.props.archiveId, this.props.foundInterviews, [], 1);
        if (nextArchiveId === false) {
            let query = this.props.query
            query['page'] = (this.props.query['page'] || 0) + 1;
            let url = `${pathBase(this.props)}/searches/archive`;
            this.props.searchInArchive(url, query);
        }
    }

    render() {
        return (
            <div>
                <div style={{ padding: "5%" }} >
                    <h3>{t(this.props, "person_info")}</h3>
                    <div>
                        <PersonDataContainer />
                        <SelectedRegistryReferencesContainer refObject={this.props.interviewee} />
                    </div>
                    <h3>{t(this.props, "interview_info")}</h3>
                    {<InterviewInfoContainer />}
                    <ContentField label={t(this.props, 'subcollection')} value={this.props.interview && this.props.interview.properties && this.props.interview.properties.subcollection} />
                    <ContentField label={t(this.props, 'contributions.interviewer')} value={this.props.interview && this.props.interview.properties && this.props.interview.properties.interviewer} />
                    <ContentField label={'Link'} value={this.props.interview && this.props.interview.properties && <a href={this.props.interview.properties.link} target='_blank'>{this.props.interview.properties.link}</a>} />
                    <ContentField label={'Signature'} value={this.props.interview && this.props.interview.signature_original} />
                    {this.footerNavigation()}
                </div>
            </div>
        )
    }

    footerNavigation() {
        let prevArchiveId = getInterviewArchiveIdWithOffset(this.props.archiveId, this.props.foundInterviews, this.props.sortedArchiveIds, -1);
        let nextArchiveId = getInterviewArchiveIdWithOffset(this.props.archiveId, this.props.foundInterviews, this.props.sortedArchiveIds, 1);
        return (
            <div className={"footer-navigation"}>
                <Link
                    className={`search-result-link ${!!prevArchiveId || "hidden"}`}
                    to={ "/" + this.props.locale + "/interviews/" + prevArchiveId }
                >
                    <i className={"fa fa-chevron-left"} />
                    {prevArchiveId}
                </Link>
                <Link
                    className={`search-result-link ${!!nextArchiveId || "hidden"}`}
                    to={ "/" + this.props.locale + "/interviews/" + nextArchiveId }
                >
                    {nextArchiveId}
                    <i className={"fa fa-chevron-right"} />
                </Link>
            </div>
        )
    }
}
