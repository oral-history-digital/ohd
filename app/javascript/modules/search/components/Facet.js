import { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FaPlus, FaMinus } from 'react-icons/fa';

import { useI18n } from 'modules/i18n';
import FacetFilterInput from './FacetFilterInput';
import SubFacets from './SubFacets';

export default function Facet({
    data,
    facet,
    show,
    admin,
}) {
    const { locale } = useI18n();

    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState('');

    function handleFilterChange(event) {
        event.preventDefault();
        setFilter(event.target.value);
    }

    function handleClick(event) {
        event.preventDefault();
        setOpen(prev => !prev);
    }

    if (!show) {
        return null;
    }

    return (
        <div className="subfacet-container">
            <button
                type="button"
                className={classNames('Button', 'accordion', {
                    'active': open,
                    'admin': admin,
                })}
                onClick={handleClick}
            >
                {data.name[locale]}
                {
                    open ?
                        <FaMinus className="Icon Icon--primary" /> :
                        <FaPlus className="Icon Icon--primary" />
                }
            </button>

            <div className={classNames('panel', { 'open': open })}>
                <div className="flyout-radio-container">
                    <FacetFilterInput
                        data={data}
                        facet={facet}
                        filter={filter}
                        onChange={handleFilterChange}
                    />
                    <SubFacets
                        data={data}
                        facet={facet}
                        filter={filter}
                        locale={locale}
                    />
                </div>
            </div>
        </div>
    );
}

Facet.propTypes = {
    facet: PropTypes.string,
    show: PropTypes.bool.isRequired,
    admin: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired,
};
