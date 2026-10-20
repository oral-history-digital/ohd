import { useState } from 'react';

import { useI18n } from 'modules/i18n';
import { usePathBase, useProjectIdentity } from 'modules/routes';
import { PixelLoader } from 'modules/spinners';
import { isMobile } from 'modules/user-agent';
import PropTypes from 'prop-types';
import { FaSearch } from 'react-icons/fa';

/**
 * Searches registry entries and switches the current project to search results.
 *
 * @param {Object} props - Search controls and state.
 * @param {string} [props.fulltext] - Initial search term.
 * @param {boolean} [props.isRegistryEntrySearching] - Whether results are loading.
 * @param {Function} props.changeRegistryEntriesViewMode - Selects the project view.
 * @param {Function} props.searchRegistryEntry - Requests matching entries.
 * @param {Function} props.hideSidebar - Closes the sidebar on mobile devices.
 * @returns {React.ReactElement} Search form and loading indicator.
 */
export default function RegistrySearchForm({
    fulltext,
    isRegistryEntrySearching,
    changeRegistryEntriesViewMode,
    searchRegistryEntry,
    hideSidebar,
}) {
    const { t } = useI18n();
    const { projectShortname } = useProjectIdentity();
    const pathBase = usePathBase();
    const [searchTerm, setSearchTerm] = useState(fulltext || '');

    function handleChange(event) {
        setSearchTerm(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();

        let url = `${pathBase}/searches/registry_entry`;
        searchRegistryEntry(url, { fulltext: searchTerm });
        changeRegistryEntriesViewMode(true, projectShortname);

        if (isMobile()) {
            hideSidebar();
        }
    }

    return (
        <div className="content-search">
            <form className="content-search-form" onSubmit={handleSubmit}>
                <input
                    type="search"
                    className="search-input"
                    value={searchTerm}
                    onChange={handleChange}
                    placeholder={t('search_registry_entry')}
                    aria-label={t('search_registry_entry')}
                />
                <button
                    type="submit"
                    className="Button Button--transparent Button--icon search-button"
                >
                    <FaSearch className="Icon Icon--primary" />
                </button>
            </form>

            {isRegistryEntrySearching && <PixelLoader />}
        </div>
    );
}

RegistrySearchForm.propTypes = {
    fulltext: PropTypes.string,
    isRegistryEntrySearching: PropTypes.bool,
    hideSidebar: PropTypes.func.isRequired,
    searchRegistryEntry: PropTypes.func.isRequired,
    changeRegistryEntriesViewMode: PropTypes.func.isRequired,
};
