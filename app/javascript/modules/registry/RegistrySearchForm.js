import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaSearch } from 'react-icons/fa';

import { usePathBase, useProject } from 'modules/routes';
import { useI18n } from 'modules/i18n';
import { PixelLoader } from 'modules/spinners';
import { isMobile } from 'modules/user-agent';

export default function RegistrySearchForm({
    fulltext,
    isRegistryEntrySearching,
    changeRegistryEntriesViewMode,
    searchRegistryEntry,
    hideSidebar,
}) {
    const { t } = useI18n();
    const { projectId } = useProject();
    const pathBase = usePathBase();
    const [searchTerm, setSearchTerm] = useState(fulltext || '');

    function handleChange(event) {
        setSearchTerm(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();

        let url = `${pathBase}/searches/registry_entry`;
        searchRegistryEntry(url, { fulltext: searchTerm });
        changeRegistryEntriesViewMode(true, projectId);

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
