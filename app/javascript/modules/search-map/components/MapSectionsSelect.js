import { Listbox, ListboxOption } from '@reach/listbox';
import '@reach/listbox/styles.css';
import classNames from 'classnames';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';

/**
 * Selects among the localized map sections loaded by the search page.
 *
 * @param {Object} props - Section selection properties.
 * @param {string} [props.className] - Additional wrapper classes.
 * @param {Object[]} props.sections - Ordered sections with localized labels.
 * @param {string} props.section - Selected section name.
 * @param {Function} props.onChange - Selects a section by name.
 * @returns {React.ReactElement|null} Section selector, or nothing for fewer than two sections.
 */
export default function MapSectionsSelect({
    className,
    sections,
    section,
    onChange,
}) {
    const { t } = useI18n();

    if (sections.length < 2) {
        return null;
    }

    return (
        <div className={classNames('u-flex', className)}>
            <span id="map_section" className="u-mr-small">
                {t('modules.search_map.map_section')}
            </span>
            <Listbox
                aria-labelledby="map_section"
                value={section}
                onChange={onChange}
            >
                {sections.map((section) => (
                    <ListboxOption
                        key={section.name}
                        value={section.name}
                        label={section.label || section.name}
                    >
                        {section.label || section.name}
                    </ListboxOption>
                ))}
            </Listbox>
        </div>
    );
}

MapSectionsSelect.propTypes = {
    className: PropTypes.string,
    sections: PropTypes.array.isRequired,
    section: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};
