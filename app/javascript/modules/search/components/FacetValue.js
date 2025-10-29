import PropTypes from 'prop-types';
import classNames from 'classnames';

import { useI18n } from 'modules/i18n';
import { FacetLink } from 'modules/interview-metadata';
import { useSearchParams } from 'modules/query-string';
import { Checkbox } from 'modules/ui';

export default function FacetValue({
    id,
    facetName,
    facetValue,
    checked,
}) {
    const { locale } = useI18n();
    const { addFacetParam, deleteFacetParam } = useSearchParams();

    function handleCheckboxChange(event) {
        const name = event.target.name;
        const value = event.target.value;

        if (event.target.checked) {
            addFacetParam(name, value);
        } else {
            deleteFacetParam(name, value);
        }
    }

    return (
        <div className={classNames('Facet-value', { 'is-checked': checked })}>
            <label className="Facet-label">
                <Checkbox
                    className={classNames('Input', 'with-font', facetName, 'checkbox',
                        'Facet-checkbox', 'u-mr-tiny')}
                    id={`${facetName}_${id}`}
                    name={facetName}
                    checked={checked}
                    value={id}
                    onChange={handleCheckboxChange}
                />
                <span className="Facet-value-name">
                    {facetValue.name[locale]}
                </span>
                <span className="Facet-count">
                    {facetValue.count}
                </span>
                {facetName === 'collection_id' && (
                    <FacetLink id={id} type="collection"/>
                )}
                {facetName === 'project_id' && (
                    <FacetLink id={id} type="archive"/>
                )}
            </label>
        </div>
    );
}

FacetValue.propTypes = {
    id: PropTypes.oneOf([PropTypes.string, PropTypes.number]).isRequired,
    facetName: PropTypes.string.isRequired,
    facetValue: PropTypes.object.isRequired,
    checked: PropTypes.bool.isRequired,
};
