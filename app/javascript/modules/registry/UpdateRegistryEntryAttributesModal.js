import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { InlineNotification, Modal } from 'modules/ui';
import PropTypes from 'prop-types';

import {
    prepareNormDataAttributes,
    prepareRegistryNameAttributes,
    updateRegistryEntryTranslationsAttributes,
} from './updateRegistryEntryAttributes';

/**
 * Applies selected authority data to an entry form using the project's configured locales.
 * Waits for Redux project settings before allowing the import.
 *
 * @param {Object} props - Authority import properties.
 * @param {Object} props.entry - Selected authority search result.
 * @param {string} props.apiSearchTerm - Descriptor used for the authority search.
 * @param {Object} props.registryEntryAttributes - Current form attributes.
 * @param {Object} props.registryNameTypes - Name types used to build imported names.
 * @param {Object} props.normDataProviders - Providers used to build imported identifiers.
 * @param {Function} props.setRegistryEntryAttributes - Replaces the parent form's entry attributes.
 * @param {Function} props.setShowElementsInForm - Reveals imported form fields.
 * @param {Function} props.setResultsFromNormDataSet - Marks the form as populated from authority data.
 * @param {Function} props.replaceNestedFormValues - Replaces nested name and authority values.
 * @returns {React.ReactElement} Import dialog or project loading/error state.
 */
function UpdateRegistryEntryAttributesModal({
    entry,
    apiSearchTerm,
    registryEntryAttributes,
    registryNameTypes,
    normDataProviders,
    setRegistryEntryAttributes,
    setShowElementsInForm,
    setResultsFromNormDataSet,
    replaceNestedFormValues,
}) {
    const { t, locale } = useI18n();
    const { project, isLoading, error } = useProject({});

    const show = (entry) => {
        const alternateName = entry.AlternativeNames?.AlternativeName;
        const name = Array.isArray(alternateName)
            ? alternateName.find((n) => n.Lang === locale && n.Name)?.Name
            : alternateName?.Name;
        const description = Array.isArray(entry.Description)
            ? entry.Description.find((n) => n.Lang === locale && n.Description)
                  ?.Description
            : entry.Description?.Description;
        return (name || entry.Name) + (description ? ', ' + description : '');
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
        <Modal
            title={t('normdata.update_registry_entry_attributes')}
            trigger={show(entry)}
            triggerClassName="flyout-sub-tabs-content-ico-link"
        >
            {(close) => (
                <div id="overwrite_registry_entry">
                    <div className="Form-footer u-mt">
                        <button
                            type="button"
                            className="Button Button--primaryAction"
                            onClick={() => {
                                setRegistryEntryAttributes({
                                    api_search_term: apiSearchTerm,
                                    latitude: entry.Location?.Latitude,
                                    longitude: entry.Location?.Longitude,
                                    has_geo_coords: !!(
                                        entry.Location?.Latitude &&
                                        entry.Location?.Longitude
                                    ),
                                    delete_persistent_values: true,
                                    translations_attributes:
                                        updateRegistryEntryTranslationsAttributes(
                                            entry,
                                            project,
                                            [
                                                ...(registryEntryAttributes.translations_attributes ||
                                                    []),
                                            ]
                                        ),
                                });
                                (replaceNestedFormValues(
                                    'registry_names_attributes',
                                    prepareRegistryNameAttributes(
                                        entry,
                                        registryNameTypes,
                                        project
                                    )
                                ),
                                    replaceNestedFormValues(
                                        'norm_data_attributes',
                                        prepareNormDataAttributes(
                                            entry,
                                            normDataProviders
                                        )
                                    ),
                                    setShowElementsInForm(true));
                                setResultsFromNormDataSet(true);
                                close();
                            }}
                        >
                            {t('ok')}
                        </button>
                        <button
                            type="button"
                            className="Button Button--secondaryAction"
                            onClick={() => {
                                close();
                            }}
                        >
                            {t('cancel')}
                        </button>
                    </div>
                </div>
            )}
        </Modal>
    );
}

UpdateRegistryEntryAttributesModal.propTypes = {
    entry: PropTypes.object.isRequired,
    apiSearchTerm: PropTypes.string.isRequired,
    registryEntryAttributes: PropTypes.object.isRequired,
    registryNameTypes: PropTypes.object.isRequired,
    normDataProviders: PropTypes.object.isRequired,
    setRegistryEntryAttributes: PropTypes.func.isRequired,
    setShowElementsInForm: PropTypes.func.isRequired,
    setResultsFromNormDataSet: PropTypes.func.isRequired,
    replaceNestedFormValues: PropTypes.func.isRequired,
};

export default UpdateRegistryEntryAttributesModal;
