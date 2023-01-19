export default function getContributorInformation(contributions, people) {
    if (!people) {
        return {};
    }

    const contributionArray = Object.values(contributions);
    const contributorInfo = {};

    contributionArray.forEach(contribution => {
        const contributor = people[contribution.person_id];

        if (typeof contributor === 'undefined') {
            const message = `The below contribution references person ${contribution.person_id} which does not exist: ${JSON.stringify(contribution)}`;
            console.warn(message);
            return;
            // TODO: Clean up MOG database and throw error again:
            //throw new ReferenceError(message);
        }

        if (contributor.id in contributorInfo) {
          return;
        }

        contributorInfo[contributor.id] = {
            initials: contributor.initials || contribution.speaker_designation || undefined,
            fullname: contributor.display_name
        };
    });

    return contributorInfo;
}
