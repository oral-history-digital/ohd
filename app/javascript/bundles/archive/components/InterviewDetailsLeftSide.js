import React from 'react';
import { Link } from 'react-router-dom';

import InterviewInfoContainer from '../containers/InterviewInfoContainer';
import InterviewRegistryReferencesContainer from '../containers/InterviewRegistryReferencesContainer';
import PersonDataContainer from '../containers/PersonDataContainer';
import { t } from '../../../lib/utils';

export default class InterviewDetailsLeftSide extends React.Component {

    metadatum(label, value, className) {
        if (value) {
            return (
                <p>
                    <span className="flyout-content-label">{label}:</span>
                    <span className={"flyout-content-data " + className}>{value}</span>
                </p>
            )
        }
    }

    render() {
        return (
            <div>
                <div style={{ padding: "5%" }} >
                    <h3>{t(this.props, "person_info")}</h3>
                    <div>
                        <PersonDataContainer />
                        <InterviewRegistryReferencesContainer
                            refObjectType={"person"}
                        />
                    </div>
                    <h3>{t(this.props, "interview_info")}</h3>
                    <InterviewInfoContainer
                        refObjectType={"interview"}
                    />
                </div>
                {/* for campscapes only: show metadata on left side. TODO: generalize this */}
                <div style={{ padding: "5%" }} >
                    {this.metadatum(t(this.props, 'contributions.interviewer'), this.props.interview && this.props.interview.properties && this.props.interview.properties.interviewer)}
                    {this.metadatum('Link', this.props.interview && this.props.interview.properties && <a href={this.props.interview.properties.link} target='_blank'>{this.props.interview.properties.link}</a>)}
                    {this.metadatum('Signature', this.props.interview && this.props.interview.properties && this.props.interview.properties.signature_original)}
                </div>
                {/* TODO: this div is needs to get a better structure, and inline styles have to be removed */}
                <div style={{ padding: "5%" }} >
                    <Link
                        className={`search-result-link ${!!this
                            .props.prevArchiveId || "hidden"}`}
                        to={
                            "/" +
                            this.props.locale +
                            "/interviews/" +
                            this.props.prevArchiveId
                        }
                        style={{ "margin-right": "10%" }}
                    >
                        <i className={"fa fa-chevron-left"} />
                        {this.props.prevArchiveId}
                    </Link>
                    <Link
                        className={`search-result-link ${!!this
                            .props.nextArchiveId || "hidden"}`}
                        to={
                            "/" +
                            this.props.locale +
                            "/interviews/" +
                            this.props.nextArchiveId
                        }
                    >
                        {this.props.nextArchiveId}
                        <i
                            className={"fa fa-chevron-right"}
                            style={{ "margin-left": 10 }}
                        />
                    </Link>
                </div>
            </div>
        )
    }
}

