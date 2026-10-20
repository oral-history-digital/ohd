import { useEffect, useRef } from 'react';

import { FormElement } from 'modules/forms';
import { HelpText } from 'modules/help-text';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import { pluralize } from 'modules/strings';
import { isMobile } from 'modules/user-agent';
import PropTypes from 'prop-types';

import { parametrizedQuery } from '../utils';
import DataSearchFormElement from './DataSearchFormElement';

/**
 * Uses the current route for resource requests without loading project details.
 * @param {Object} props - Record data, form settings, and request callbacks.
 * @returns {React.ReactElement} Resource form and controls.
 */
export default function DataSearchForm({
    scope,
    query,
    helpTextCode,
    searchableAttributes,
    submitText,
    setQueryParams,
    fetchData,
    resetQuery,
    hideSidebar,
}) {
    const { t } = useI18n();
    const pathBase = usePathBase();
    const formEl = useRef(null);

    useEffect(() => {
        return () => handleReset();
    }, []);

    function handleChange(event) {
        const value = event.target.value;
        const name = event.target.name;
        setQueryParams(pluralize(scope), {
            [name]: value,
            page: 1,
        });
    }

    function handleReset() {
        formEl.current?.reset();
        resetQuery(pluralize(scope));
        fetchData({ pathBase }, pluralize(scope), null, null, null);
    }

    function handleSubmit(event) {
        if (event !== undefined) event.preventDefault();
        if (isMobile()) {
            hideSidebar();
        }
        fetchData(
            { pathBase },
            pluralize(scope),
            null,
            null,
            parametrizedQuery(query)
        );
    }

    return (
        <form
            ref={formEl}
            id={`${scope}_search_form`}
            className="flyout-search default"
            onSubmit={handleSubmit}
        >
            {helpTextCode && <HelpText code={helpTextCode} />}

            {searchableAttributes.map((element) => {
                return (
                    <FormElement
                        key={element.attributeName}
                        label={t(
                            `activerecord.attributes.${scope}.${element.attributeName}`
                        )}
                    >
                        <DataSearchFormElement
                            element={element}
                            scope={scope}
                            query={query}
                            onChange={handleChange}
                        />
                    </FormElement>
                );
            })}
            <input
                className="lonely-search-button"
                value={t(submitText || 'search')}
                type="submit"
            />
        </form>
    );
}

DataSearchForm.propTypes = {
    query: PropTypes.object.isRequired,
    searchableAttributes: PropTypes.array.isRequired,
    scope: PropTypes.string.isRequired,
    submitText: PropTypes.string,
    helpTextCode: PropTypes.string,
    fetchData: PropTypes.func.isRequired,
    hideSidebar: PropTypes.func.isRequired,
    resetQuery: PropTypes.func.isRequired,
    setQueryParams: PropTypes.func.isRequired,
};
