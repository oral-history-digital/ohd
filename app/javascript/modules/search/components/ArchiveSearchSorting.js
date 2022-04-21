import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Listbox, ListboxOption } from '@reach/listbox';
import '@reach/listbox/styles.css';
import flow from 'lodash.flow';

import { useI18n } from 'modules/i18n';
import { getCurrentProject } from 'modules/data';
import { getEditView } from 'modules/archive';
import addObligatoryOptions from '../addObligatoryOptions';
import filterByPossibleOptions from '../filterByPossibleOptions';
import searchOptionsFromMetadataFields from '../searchOptionsFromMetadataFields';
import sortByFacetOrder from '../sortByFacetOrder';
import useSearchParams from '../useSearchParams';

export default function ArchiveSearchSorting({
    className,
}) {
    const { t } = useI18n();
    const project = useSelector(getCurrentProject);
    const editView = useSelector(getEditView);

    const { sortBy, sortOrder, setSortOrder, setSort } =
        useSearchParams();

    const showSortOrderSelect = sortBy !== 'random';

    let sortByOptions;
    if (editView) {
        sortByOptions = [
            'relevance',
            'random',
            'title',
            'archive_id',
            'media_type',
            'duration',
            'language',
            'workflow_state',
        ];
    } else {
        const transformMetadataFields = flow(
            sortByFacetOrder,
            searchOptionsFromMetadataFields,
            filterByPossibleOptions,
            addObligatoryOptions,
        );
        sortByOptions = transformMetadataFields(
            Object.values(project?.metadata_fields) || []);
    }

    useEffect(() => {
        if (!sortBy) {
            // Set defaults.
            if (project.default_search_order === 'random') {
                setSort('random', undefined);
            } else {
                setSort('title', 'asc');
            }
        }
    }, []);

    function handleSortByChange(event) {
        const newSortBy = event.target.value;

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

    function handleSortOrderChange(event) {
        setSortOrder(event.target.value);
    }

    const sortOrderOptions = [
        'asc',
        'desc',
    ];

    return (
        <div className={classNames('SearchSorting', className)}>
            <p
                id="sort_options"
                className="SearchSorting-label"
            >
                {t('modules.search.sorting.label')}
            </p>

            <select
                className="SearchSorting-select u-ml-tiny"
                aria-labelledby="sort_options"
                value={sortBy}
                onChange={handleSortByChange}
            >
                {
                    sortByOptions.map(option => (
                        <option
                            key={option}
                            value={option}
                        >
                            {t(`modules.search.sorting.by.${option}`)}
                        </option>
                    ))
                }
            </select>

            {showSortOrderSelect && (
                <select
                    className="SearchSorting-select u-ml-tiny"
                    aria-labelledby="sort_options"
                    value={sortOrder}
                    onChange={handleSortOrderChange}
                >
                    {
                        sortOrderOptions.map(option => (
                            <option
                                key={option}
                                value={option}
                            >
                                {t(`modules.search.sorting.order.${option}`)}
                            </option>
                        ))
                    }
                </select>
            )}
        </div>
    );
}

ArchiveSearchSorting.propTypes = {
    className: PropTypes.string,
};
