import { Listbox, ListboxOption } from '@reach/listbox';
import '@reach/listbox/styles.css';
import classNames from 'classnames';
import { getMapSections } from 'modules/data';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

export default function MapSectionsSelect({ className, section, onChange }) {
    const mapSections = useSelector(getMapSections);
    const { t, locale } = useI18n();

    if (mapSections.length < 2) {
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
                {mapSections.map((section) => (
                    <ListboxOption
                        key={section.name}
                        value={section.name}
                        label={section.label[locale]}
                    >
                        {section.label[locale]}
                    </ListboxOption>
                ))}
            </Listbox>
        </div>
    );
}

MapSectionsSelect.propTypes = {
    className: PropTypes.string,
    section: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};
