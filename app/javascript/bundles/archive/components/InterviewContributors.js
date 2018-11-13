import React from 'react';
import { t, fullname, admin } from '../../../lib/utils';
import ContributionFormContainer from '../containers/ContributionFormContainer';
import PersonContainer from '../containers/PersonContainer';

export default class InterviewContributors extends React.Component {

    componentDidMount() {
        if (admin(this.props)) {
            this.loadAllPeople();
        }
    }

    componentDidUpdate() {
        if (admin(this.props)) {
            this.loadAllPeople();
        }
    }

    loadAllPeople() {
        if (!this.props.peopleStatus.all) {
            this.props.fetchData('people');
        }
    }

    contributors() {
        let contributors = [];
        if (
            this.props.interview &&
            this.props.peopleStatus[`contributors_for_interview_${this.props.interview.id}`] &&
            this.props.peopleStatus[`contributors_for_interview_${this.props.interview.id}`].split('-')[0] === 'fetched' && 
            this.props.contributionTypes
        ) {
            for (var c in this.props.interview.contributions) {
                let contribution = this.props.interview.contributions[c];
                //if (
                    //contribution && 
                    //(Object.values(this.props.contributionTypes).indexOf(contribution.contribution_type) > -1 || 
                    //admin(this.props))
                //)
                if (contribution !== 'fetched') {
                    contributors.push(<PersonContainer data={this.props.people[contribution.person_id]} contribution={contribution} key={`contribution-${contribution.id}`} />);
                }
            }
        } 
        return contributors;
    }

    addContribution() {
        if (admin(this.props)) {
            return (
                <div
                    className='flyout-sub-tabs-content-ico-link'
                    title={t(this.props, 'edit.contribution.new')}
                    onClick={() => this.props.openArchivePopup({
                        title: t(this.props, 'edit.contribution.new'),
                        content: <ContributionFormContainer interview={this.props.interview} />
                    })}
                >
                    <i className="fa fa-plus"></i>
                </div>
            )
        }
    }

    contributions() {
        return (
            <div>
                {this.contributors()}
                {this.addContribution()}
            </div>
        );
    }

    render() {
        if (this.props.interview) {
            return (
                <div>
                    {this.contributions()}
                </div>
            );
        } else {
            return null;
        }
    }
}

