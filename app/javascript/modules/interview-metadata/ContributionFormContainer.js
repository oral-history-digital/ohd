import { getLocale } from 'modules/archive';
import {
    FetchProjectResource,
    getContributionTypesForCurrentProject,
} from 'modules/data';
import { useSelector } from 'react-redux';

import ContributionForm from './ContributionForm';

/**
 * Loads contribution-type choices and supplies them to the contributor editor.
 * Parent form submission callbacks are forwarded unchanged, including for nested forms.
 *
 * @param {Object} props - Contributor form values and parent callbacks.
 * @returns {React.ReactElement} Contributor editor or resource loading indicator.
 */
export default function ContributionFormContainer(props) {
    const locale = useSelector(getLocale);
    const contributionTypes = useSelector(
        getContributionTypesForCurrentProject
    );
    return (
        <FetchProjectResource resource="contribution_types">
            <ContributionForm
                {...props}
                locale={locale}
                contributionTypes={contributionTypes}
            />
        </FetchProjectResource>
    );
}
