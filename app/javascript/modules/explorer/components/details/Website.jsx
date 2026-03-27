import PropTypes from 'prop-types';

import { GenericLink } from './GenericLink';

export function Website({ url, labelKey }) {
    return (
        <GenericLink
            labelKey={labelKey || 'modules.catalog.web_page'}
            url={url}
            isExternal
            groupClassName="DescriptionList-group--homepage"
        />
    );
}

Website.propTypes = {
    url: PropTypes.string,
    labelKey: PropTypes.string,
};

export default Website;
