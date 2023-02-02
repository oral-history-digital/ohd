import { formatPersonName } from 'modules/person';
import getInitials from './getInitials';

export default function getContributorInformation(contributions, people, locale, translations) {
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

        const info = {};

        const firstName = contributor.names[locale]?.first_name;
        const lastName = contributor.names[locale]?.last_name;

        if (firstName && lastName) {
            info.initials = getInitials(firstName, lastName);
        } else if (contribution.speaker_designation) {
            info.initials = contribution.speaker_designation;
        } else {
            info.initials = undefined;
        }

        info.fullname = formatPersonName(contributor, translations, { locale });

        contributorInfo[contributor.id] = info;
    });

    return contributorInfo;
}
