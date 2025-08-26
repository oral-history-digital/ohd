/**
 * Returns contributor information (initials and full name) for each person referenced in contributions.
 *
 * Iterates over the contributions, looks up each contributor in the people object,
 * and builds an object mapping contributor IDs to their initials and full name.
 * If a referenced person does not exist in people, logs a warning.
 *
 * @param {Object} contributions - An object mapping contribution IDs to contribution objects. Each contribution should have a person_id and optionally a speaker_designation.
 * @param {Object} people - An object mapping person IDs to person objects. Each person should have id, initials, and display_name properties.
 * @returns {Object} An object mapping contributor IDs to their information: { initials, fullname }.
 */
export function getContributorInformation(contributions, people) {
    if (!people) {
        return {};
    }

    const contributionArray = Object.values(contributions);
    const contributorInfo = {};

    contributionArray.forEach((contribution) => {
        const contributor = people[contribution.person_id];

        if (typeof contributor === 'undefined') {
            const message = `The below contribution references person ${
                contribution.person_id
            } which does not exist: ${JSON.stringify(contribution)}`;
            console.warn(message);
            return;
            // TODO: Clean up MOG database and throw error again:
            //throw new ReferenceError(message);
        }

        if (contributor.id in contributorInfo) {
            return;
        }

        contributorInfo[contributor.id] = {
            initials:
                contributor.initials ||
                contribution.speaker_designation ||
                undefined,
            fullname: contributor.display_name,
        };
    });

    return contributorInfo;
}
