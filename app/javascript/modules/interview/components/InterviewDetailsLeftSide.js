import { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import { InterviewInfoContainer, InterviewContributorsContainer } from 'modules/interview-metadata';
import { SelectedRegistryReferencesContainer } from 'modules/registry-references';
import { ContentField } from 'modules/forms';
import { PersonDataContainer } from 'modules/interviewee-metadata';
import { pathBase } from 'modules/routes';
import { t } from 'modules/i18n';
import getInterviewArchiveIdWithOffset from './getInterviewArchiveIdWithOffset';

export default class InterviewDetailsLeftSide extends Component {
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
                        { this.props.interviewee && <SelectedRegistryReferencesContainer refObject={this.props.interviewee} /> }
                    </div>
                    <h3>{t(this.props, "interview_info")}</h3>
                    <InterviewInfoContainer />
                    <InterviewContributorsContainer/>
                    { this.props.interview?.properties?.subcollection &&
                        <ContentField label={t(this.props, 'subcollection')} value={this.props.interview.properties.subcollection} />
                    }
                    { this.props.interview?.properties?.link &&
                        <ContentField label={'Link'} value={<a href={this.props.interview.properties.link} target='_blank'>{this.props.interview.properties.link}</a>} />
                    }
                    {this.props.projectId === 'CAMPSCAPES' && this.footerNavigation()}
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
                    <FaChevronLeft className="Icon Icon--text" />
                    {prevArchiveId}
                </Link>
                <Link
                    className={`search-result-link ${!!nextArchiveId || "hidden"}`}
                    to={ "/" + this.props.locale + "/interviews/" + nextArchiveId }
                >
                    {nextArchiveId}
                    <FaChevronRight className="Icon Icon--text" />
                </Link>
            </div>
        )
    }
}

InterviewDetailsLeftSide.propTypes = {
    interview: PropTypes.object.isRequired,
    archiveId: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    foundInterviews: PropTypes.object,
    query: PropTypes.object.isRequired,
    interviewee: PropTypes.object.isRequired,
    sortedArchiveIds: PropTypes.array.isRequired,
    searchInArchive: PropTypes.func.isRequired,
};
