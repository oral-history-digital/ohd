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

    const { sortBy, sortOrder, setSortBy, setSortOrder } = useSearchParams();

    let sortByOptions;
    if (editView) {
        sortByOptions = [
            'relevance',
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

    function handleSortByChange(newSortBy) {
        setSortBy(newSortBy);
    }

    function handleSortOrderChange(newSortOrder) {
        setSortOrder(newSortOrder);
    }

    const sortOrderOptions = [
        'asc',
        'desc',
    ];

    return (
        <div className={classNames(className, 'u-flex', 'u-mb-small')}>
            <p>{t('modules.search.sorting.label')}</p>
            <Listbox
                aria-labelledby="map_section"
                value={sortBy}
                onChange={handleSortByChange}
            >
                {
                    sortByOptions.map(option => (
                        <ListboxOption
                            key={option}
                            value={option}
                            label={t(`modules.search.sorting.by.${option}`)}
                        >
                            {t(`modules.search.sorting.by.${option}`)}
                        </ListboxOption>
                    ))
                }
            </Listbox>

            <Listbox
                aria-labelledby="map_section"
                value={sortOrder}
                onChange={handleSortOrderChange}
            >
                {
                    sortOrderOptions.map(option => (
                        <ListboxOption
                            key={option}
                            value={option}
                            label={t(`modules.search.sorting.order.${option}`)}
                        >
                            {t(`modules.search.sorting.order.${option}`)}
                        </ListboxOption>
                    ))
                }
            </Listbox>
        </div>
    );
}

ArchiveSearchSorting.propTypes = {
    className: PropTypes.string,
    searchParams: PropTypes.object,
};
