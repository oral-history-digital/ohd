import { useEffect } from 'react';

import '@reach/listbox/styles.css';
import classNames from 'classnames';
import curry from 'lodash.curry';
import flow from 'lodash.flow';
import { getEditView } from 'modules/archive';
import { useI18n } from 'modules/i18n';
import { useSearchParams } from 'modules/query-string';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Select from 'react-select';

import addObligatoryOptions from '../addObligatoryOptions';
import defaultSortOptions from '../defaultSortOptions';
import filterByPossibleOptions from '../filterByPossibleOptions';
import searchOptionsFromMetadataFields from '../searchOptionsFromMetadataFields';
import sortByFacetOrder from '../sortByFacetOrder';
import SortOrderButton from './SortOrderButton';

/**
 * Builds search sorting options from the current project's metadata configuration.
 * Waits for project settings before applying the default sort.
 *
 * @param {Object} props - Component properties.
 * @param {string} [props.className] - Additional CSS class.
 * @returns {React.ReactElement} Sorting controls or their loading/error state.
 */
export default function ArchiveSearchSorting({ className }) {
    const { t } = useI18n();
    const { project, isLoading, error } = useProject({
        include: ['metadata_fields'],
    });
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
        // The ordering helper sorts in place; keep the Redux array unchanged.
        [...(project?.metadata_fields || [])]
    );

    useEffect(() => {
        if (project && !error && !sortBy) {
            const defaults = defaultSortOptions(project.default_search_order);
            setDefaultSortOptions(defaults.sort, defaults.order);
        }
    }, [project, error, sortBy, setDefaultSortOptions]);

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

    if (error) {
        return (
            <InlineNotification
                variant="error"
                title={t('error')}
                description={error.message}
                isClosable={false}
            />
        );
    }
    if (isLoading || !project) return <Spinner />;

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
