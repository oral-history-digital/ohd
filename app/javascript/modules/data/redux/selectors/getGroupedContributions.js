import { getEditView } from 'modules/archive';
import { createSelector } from 'reselect';
import {
    getContributionTypesForCurrentProject,
    getCurrentInterview,
} from './baseSelectors';

const getGroupedContributions = createSelector(
    [getEditView, getCurrentInterview, getContributionTypesForCurrentProject],
    (editView, currentInterview, contributionTypes) => {
        if (!currentInterview || !currentInterview.contributions) {
            return null;
        }

        const availableTypes = Object.values(contributionTypes)
            .filter((ct) => editView || ct.use_in_details_view)
            .sort((a, b) => a.order - b.order)
            .map((ct) => ct.code);

        const groupedContributions = Object.values(
            currentInterview.contributions
        )
            .filter((con) => availableTypes.includes(con.contribution_type))
            .reduce((acc, contribution) => {
                const type = contribution.contribution_type;

                if (!acc[type]) {
                    acc[type] = [contribution];
                } else {
                    acc[type].push(contribution);
                }

                return acc;
            }, {});

        const groupedAsArray = Object.keys(groupedContributions).map(
            (type) => ({
                type,
                contributions: groupedContributions[type],
            })
        );

        groupedAsArray.sort(
            (a, b) =>
                availableTypes.indexOf(a.type) - availableTypes.indexOf(b.type)
        );

        return groupedAsArray;
    }
);

export default getGroupedContributions;
