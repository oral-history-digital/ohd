import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Select from 'react-select';
import '@reach/listbox/styles.css';
import flow from 'lodash.flow';
import curry from 'lodash.curry';

import { useI18n } from 'modules/i18n';
import { getCurrentProject } from 'modules/data';
import { getEditView } from 'modules/archive';
import { useSearchParams } from 'modules/query-string';
import addObligatoryOptions from '../addObligatoryOptions';
import filterByPossibleOptions from '../filterByPossibleOptions';
import searchOptionsFromMetadataFields from '../searchOptionsFromMetadataFields';
import sortByFacetOrder from '../sortByFacetOrder';
import SortOrderButton from './SortOrderButton';

export default function ArchiveSearchSorting({
    className,
}) {
    const { t } = useI18n();
    const project = useSelector(getCurrentProject);
    const editView = useSelector(getEditView);

    const { fulltextIsSet, sortBy, sortOrder, setSortOrder, setSort,
        setDefaultSortOptions } = useSearchParams();

    const showSortOrderSelect = sortBy !== 'random';

    const transformMetadataFields = flow(
        sortByFacetOrder,
        curry(searchOptionsFromMetadataFields)(editView),
        filterByPossibleOptions,
        curry(addObligatoryOptions)(fulltextIsSet)
    );
    const sortByOptions = transformMetadataFields(
        Object.values(project?.metadata_fields || {}));

    useEffect(() => {
        if (!sortBy) {
            // Set defaults.
            if (project?.default_search_order === 'random') {
                setDefaultSortOptions('random', undefined);
            } else {
                setDefaultSortOptions('title', 'asc');
            }
        }
    }, [sortBy]);

    function handleSortByChange(option) {
        const newSortBy = option.value;

        switch (newSortBy) {
        case 'random':
            setSort(newSortBy, undefined);
            break;
        case 'relevance':
            setSort(newSortBy, 'desc');
            break;
        default:
            setSort(newSortBy, 'asc');
            break;
        }
    }

    const sortByOptionsWithLabels = sortByOptions.map(option => ({
        value: option,
        label: t(`modules.search.sorting.by.${option}`),
    }));

    return (
        <div className={classNames('SearchSorting', className)}>
            <p
                id="sort_options"
                className="SearchSorting-label"
            >
                {t('modules.search.sorting.label')}
            </p>

            <Select
                className="SearchSorting-select u-ml-tiny"
                aria-labelledby="sort_options"
                options={sortByOptionsWithLabels}
                value={{ value: sortBy, label: t(`modules.search.sorting.by.${sortBy}`) }}
                onChange={handleSortByChange}
            />
            {showSortOrderSelect && (
                <SortOrderButton
                    type={['relevance', 'duration'].includes(sortBy) ? 'amount' : 'alpha'}
                    className="u-ml-tiny"
                    value={sortOrder}
                    onChange={setSortOrder}
                />
            )}
        </div>
    );
}

ArchiveSearchSorting.propTypes = {
    className: PropTypes.string,
};
