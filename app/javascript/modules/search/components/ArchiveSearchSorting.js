import { useEffect } from 'react';

import '@reach/listbox/styles.css';
import classNames from 'classnames';
import curry from 'lodash.curry';
import flow from 'lodash.flow';
import { getEditView } from 'modules/archive';
import { getCurrentProject } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useSearchParams } from 'modules/query-string';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Select from 'react-select';

import addObligatoryOptions from '../addObligatoryOptions';
import defaultSortOptions from '../defaultSortOptions';
import filterByPossibleOptions from '../filterByPossibleOptions';
import searchOptionsFromMetadataFields from '../searchOptionsFromMetadataFields';
import sortByFacetOrder from '../sortByFacetOrder';
import SortOrderButton from './SortOrderButton';

export default function ArchiveSearchSorting({ className }) {
    const { t } = useI18n();
    const project = useSelector(getCurrentProject);
    const editView = useSelector(getEditView);

    const {
        fulltextIsSet,
        sortBy,
        sortOrder,
        setSortOrder,
        setSort,
        setDefaultSortOptions,
    } = useSearchParams();

    const showSortOrderSelect = sortBy !== 'random';

    const transformMetadataFields = flow(
        sortByFacetOrder,
        curry(searchOptionsFromMetadataFields)(editView),
        filterByPossibleOptions,
        curry(addObligatoryOptions)(fulltextIsSet)
    );
    const sortByOptions = transformMetadataFields(
        Object.values(project?.metadata_fields || {})
    );

    useEffect(() => {
        if (!sortBy) {
            // Set defaults.
            const defaults = defaultSortOptions(project?.default_search_order);
            setDefaultSortOptions(defaults.sort, defaults.order);
        }
    }, [sortBy]);

    function handleSortByChange(option) {
        const newSortBy = option.value;

        switch (newSortBy) {
            case 'random':
                setSort(newSortBy, undefined);
                break;
            case 'score':
                setSort(newSortBy, 'desc');
                break;
            default:
                setSort(newSortBy, 'asc');
                break;
        }
    }

    const sortByOptionsWithLabels = sortByOptions.map((option) => ({
        value: option,
        label: t(`modules.search.sorting.by.${option}`),
    }));

    const customStyles = {
        menu: (provided) => ({
            ...provided,
            zIndex: 10,
        }),
        control: (provided, state) => {
            if (!state.isFocused) {
                return provided;
            }

            return {
                ...provided,
                borderColor: 'var(--secondary-color)',
                boxShadow: '0 0 0 1px var(--secondary-color)',
                '&:hover': { borderColor: 'var(--secondary-color)' },
            };
        },
    };

    return (
        <div className={classNames('SearchSorting', className)}>
            <p id="sort_options" className="SearchSorting-label">
                {t('modules.search.sorting.label')}
            </p>

            <Select
                className="SearchSorting-select u-ml-tiny"
                aria-labelledby="sort_options"
                options={sortByOptionsWithLabels}
                value={{
                    value: sortBy,
                    label: t(`modules.search.sorting.by.${sortBy}`),
                }}
                onChange={handleSortByChange}
                styles={customStyles}
            />
            {showSortOrderSelect && (
                <SortOrderButton
                    type={
                        ['score', 'duration'].includes(sortBy)
                            ? 'amount'
                            : 'alpha'
                    }
                    className="u-ml-tiny"
                    value={sortOrder || 'asc'}
                    onChange={setSortOrder}
                />
            )}
        </div>
    );
}

ArchiveSearchSorting.propTypes = {
    className: PropTypes.string,
};
