import { createSelector } from 'reselect'

import { getEditView } from '../archiveSelectors';
import { getCurrentInterview } from '../dataSelectors';

const CONTRIBUTION_TYPES_USER = [
    'interviewer',
    'cinematographer',
    'sound',
    'producer',
    'other_attender',
    'transcriptor',
    'translator',
    'segmentator',
    'proofreader',
    'research',
];

const CONTRIBUTION_TYPES_ADMIN = CONTRIBUTION_TYPES_USER.concat([
    'quality_manager_interviewing',
    'quality_manager_transcription',
    'quality_manager_translation',
    'quality_manager_research',
]);

const getGroupedContributions = createSelector(
    [getEditView, getCurrentInterview],
    (editView, currentInterview) => {
        if (!currentInterview || !currentInterview.contributions) {
            return null;
        }

        const availableTypes = editView ? CONTRIBUTION_TYPES_ADMIN : CONTRIBUTION_TYPES_USER;

        const groupedContributions = Object
            .values(currentInterview.contributions)
            .filter(con => availableTypes.includes(con.contribution_type))
            .reduce((acc, contribution) => {
                const type = contribution.contribution_type;

                if (!acc[type]) {
                    acc[type] = [contribution];
                } else {
                    acc[type].push(contribution);
                }

                return acc;
            }, {});

        const groupedAsArray = Object.keys(groupedContributions).map(type => ({
            type,
            contributions: groupedContributions[type],
        }));

        groupedAsArray.sort((a, b) =>
            (availableTypes.indexOf(a.type) - availableTypes.indexOf(b.type))
        );

        return groupedAsArray;
    }
);

export default getGroupedContributions;
