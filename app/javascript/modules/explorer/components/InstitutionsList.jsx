import { useState } from 'react';

import classNames from 'classnames';
import { useGetInstitutionsList } from 'modules/data';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';

import {
    useAccordion,
    useExplorerListCountLabel,
    useInstitutionsSort,
} from '../hooks';
import { filterInstitutions, sortInstitutions } from '../utils';
import { InstitutionCard } from './InstitutionCard';
import { InstitutionsMap } from './InstitutionsMap';
import { InstitutionsSortControl } from './InstitutionsSortControl';

export function InstitutionsList({
    query,
    interviewMin,
    interviewMax,
    instProjectMin,
    instProjectMax,
    institutionLevel,
}) {
    const { t } = useI18n();
    const [isMapExpanded, setIsMapExpanded] = useState(false);
    const { expandedId, toggle } = useAccordion();
    const { sort, setSort } = useInstitutionsSort();
    const { institutions, loading, error } = useGetInstitutionsList({
        all: true,
    });

    const allInstitutions = institutions || [];
    const filteredInstitutions = filterInstitutions(allInstitutions, {
        query,
        interviewMin,
        interviewMax,
        instProjectMin,
        instProjectMax,
        institutionLevel,
    });
    const institutionsCountLabel = useExplorerListCountLabel({
        scope: 'institutions',
        displayedItems: filteredInstitutions,
        totalItems: allInstitutions,
    });
    const topLevelInstitutionsCount = filterInstitutions(allInstitutions, {
        institutionLevel: 'top_level',
    }).length;

    if (loading) {
        return (
            <div className="InstitutionsList InstitutionsList--empty">
                <p>{t('explorer.institutions_list.loading')}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="InstitutionsList InstitutionsList--empty">
                <p>{t('explorer.institutions_list.error')}</p>
            </div>
        );
    }

    if (!institutions || institutions.length === 0) {
        return (
            <div className="InstitutionsList InstitutionsList--empty">
                <p>{t('explorer.institutions_list.no_results')}</p>
            </div>
        );
    }

    const sortedInstitutions = sortInstitutions(filteredInstitutions, sort);

    return (
        <div className="InstitutionsList">
            <div
                className={classNames('InstitutionsList-header', {
                    'InstitutionsList-header--mapExpanded': isMapExpanded,
                })}
            >
                <p className="InstitutionsList-description">
                    {t('explorer.institutions_list.description', {
                        count: topLevelInstitutionsCount,
                    })}
                </p>
                <InstitutionsMap
                    institutions={filteredInstitutions}
                    onExpandedChange={setIsMapExpanded}
                />
            </div>
            <div className="InstitutionsList--filtersInfo">
                <p className="InstitutionsList--countLabel">
                    {institutionsCountLabel}
                </p>
                <InstitutionsSortControl value={sort} onChange={setSort} />
            </div>

            <div className="InstitutionsList-cards">
                {sortedInstitutions.length === 0 ? (
                    <div className="InstitutionsList InstitutionsList--empty">
                        <p>
                            {t(
                                'explorer.institutions_list.no_results_filtered'
                            )}
                        </p>
                    </div>
                ) : (
                    sortedInstitutions.map((institution) => (
                        <InstitutionCard
                            key={institution.id}
                            institution={institution}
                            query={query}
                            expanded={expandedId === institution.id}
                            onToggle={() => toggle(institution.id)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

InstitutionsList.propTypes = {
    query: PropTypes.string,
    interviewMin: PropTypes.number,
    interviewMax: PropTypes.number,
    instProjectMin: PropTypes.number,
    instProjectMax: PropTypes.number,
    institutionLevel: PropTypes.oneOf(['all', 'top_level']),
};

export default InstitutionsList;
