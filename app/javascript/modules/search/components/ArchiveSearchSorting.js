import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Listbox, ListboxOption } from '@reach/listbox';
import '@reach/listbox/styles.css';

import { useI18n } from 'modules/i18n';
import { useQuery } from 'modules/react-toolbox';

export default function ArchiveSearchSorting({
    className,
}) {
    const { t } = useI18n();
    const searchParams = useQuery();
    const history = useHistory();

    function handleSortByChange(newSortBy) {
        searchParams.set('sort', newSortBy);
        history.push({
            search: searchParams.toString(),
        });
    }

    function handleSortOrderChange(newSortOrder) {
        searchParams.set('order', newSortOrder);
        history.push({
            search: searchParams.toString(),
        });
    }

    const sortBy = searchParams.get('sort') || 'relevance';

    const sortByOptions = [
        'relevance',
        'title',
        'id',
        'media',
        'duration',
        'language',
    ];

    const sortOrder = searchParams.get('order') || 'asc';

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
};
