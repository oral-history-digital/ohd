import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FaInfoCircle, FaExternalLinkAlt } from 'react-icons/fa';

import { Checkbox } from 'modules/ui';
import { useSearchParams } from 'modules/query-string';

export default function SubFacets({
    data,
    facet,
    filter,
    locale,
}) {
    const { getFacetParam, addFacetParam, deleteFacetParam } = useSearchParams();

    const checkedFacets = getFacetParam(facet);

    function handleCheckboxChange(event) {
        const name = event.target.name;
        const value = event.target.value;

        if (event.target.checked) {
            addFacetParam(name, value);
        } else {
            deleteFacetParam(name, value);
        }
    }

    function sortedSubfacets() {
        // if the Facet is about time periods, sort by years ( by doing: .replace(/[^\d]/g, '') )
        if (data.name['de'] && data.name['de'].trim() === 'Zeitperioden') {
            return Object.keys(data.subfacets).sort((a, b) => {
                return (localDescriptor(a).replace(/[^\d]/g, '') > localDescriptor(b).replace(/[^\d]/g, '')) ? 1 : ((localDescriptor(b).replace(/[^\d]/g, '') > localDescriptor(a).replace(/[^\d]/g, '')) ? -1 : 0);
            });
        }
        // everything else
        // sort first alphabetically, then put prioritized down in the list (like "others"/"sonstige")
        else {
            return Object.keys(data.subfacets).sort((a, b) => {
                return (localDescriptor(a) > localDescriptor(b)) ? 1 : ((localDescriptor(b) > localDescriptor(a)) ? -1 : 0);
            }).sort((a, b) => {
                return (priority(a) > priority(b)) ? 1 : ((priority(b) > priority(a)) ? -1 : 0);
            });
        }
    }

    function localDescriptor(subfacetId) {
        return data.subfacets[subfacetId].name[locale];
    }

    function priority(subfacetId) {
        return data.subfacets[subfacetId].priority;
    }

    function renderCollectionInfo(subfacet) {
        if (facet === 'collection_id' && (subfacet.notes || subfacet.homepage)) {
            return (
                <span>
                    <FaInfoCircle
                        className="Icon Icon--unobtrusive u-mr-tiny"
                        title={subfacet.notes[locale]}
                    />
                    {collectionLink(subfacet)}
                </span>
            );
        }
    }

    function collectionLink(subfacet) {
        if (subfacet.homepage && subfacet.homepage[locale]) {
            // apend 'http://' to homepage if not present
            let href = /^http/.test(subfacet.homepage[locale]) ? subfacet.homepage[locale] : `http://${subfacet.homepage[locale]}`

            return (
                <a href={href} title={subfacet.homepage[locale]} target="_blank" rel="noreferrer">
                    <FaExternalLinkAlt className="Icon Icon--unobtrusive" />
                </a>
            );
        }
    }

    return sortedSubfacets().filter(subfacetId => {
        let subfacetName = data.subfacets[subfacetId].name[locale];
        if (subfacetName) {
            return subfacetName.toLowerCase().includes(filter.toLowerCase());
        }
    }).map((subfacetId, index) => {
        let checkedState = false;
        if (checkedFacets) {
            checkedState = checkedFacets.indexOf(subfacetId.toString()) > -1;
        }
        return (
            <div
                key={index}
                className={classNames('Facet-value', {
                    'is-checked': checkedState,
                })}
            >
                <label>
                    <Checkbox
                        className={classNames('Input', 'with-font', facet, 'checkbox', 'u-mr-tiny')}
                        id={facet + "_" + subfacetId}
                        name={facet}
                        checked={checkedState}
                        value={subfacetId}
                        onChange={handleCheckboxChange}
                    />
                    {localDescriptor(subfacetId)}
                    <span className="Facet-count">
                        {data.subfacets[subfacetId].count}
                    </span>
                </label>
                &nbsp;
                {renderCollectionInfo(data.subfacets[subfacetId])}
            </div>
        );
    })
}

SubFacets.propTypes = {
    data: PropTypes.object.isRequired,
    facet: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
};
