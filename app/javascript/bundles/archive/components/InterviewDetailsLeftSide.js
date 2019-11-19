import React from 'react';
import { Link } from 'react-router-dom';

import InterviewInfoContainer from '../containers/InterviewInfoContainer';
import SelectedRegistryReferencesContainer from '../containers/SelectedRegistryReferencesContainer';
import PersonDataContainer from '../containers/PersonDataContainer';
import { t, contentField } from '../../../lib/utils';

export default class InterviewDetailsLeftSide extends React.Component {

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
                    {contentField(t(this.props, 'subcollection'), this.props.interview && this.props.interview.properties && this.props.interview.properties.subcollection)}
                    {contentField(t(this.props, 'contributions.interviewer'), this.props.interview && this.props.interview.properties && this.props.interview.properties.interviewer)}
                    {contentField('Link', this.props.interview && this.props.interview.properties && <a href={this.props.interview.properties.link} target='_blank'>{this.props.interview.properties.link}</a>)}
                    {contentField('Signature', this.props.interview && this.props.interview.properties && this.props.interview.properties.signature_original)}
                    {this.footerNavigation()}
                </div>
            </div>
        )
    }

    footerNavigation() {
        {/* TODO: this div is needs to get a better structure, and inline styles have to be removed */}
        return (
            <div style={{ padding: "5%" }} >
                <Link
                    className={`search-result-link ${!!this.props.prevArchiveId || "hidden"}`}
                    to={ "/" + this.props.locale + "/interviews/" + this.props.prevArchiveId }
                    style={{ "margin-right": "10%" }}
                >
                    <i className={"fa fa-chevron-left"} />
                    {this.props.prevArchiveId}
                </Link>
                <Link
                    className={`search-result-link ${!!this.props.nextArchiveId || "hidden"}`}
                    to={ "/" + this.props.locale + "/interviews/" + this.props.nextArchiveId }
                >
                    {this.props.nextArchiveId}
                    <i
                        className={"fa fa-chevron-right"}
                        style={{ "margin-left": 10 }}
                    />
                </Link>
            </div>
        )
    }
}

