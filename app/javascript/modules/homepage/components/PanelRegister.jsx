import PropTypes from 'prop-types';

import HomepagePanel from './HomepagePanel';

export function PanelRegister({ data }) {
    if (!data) return null;
    return <HomepagePanel data={data} variant="register" />;
}

export default PanelRegister;

PanelRegister.propTypes = {
    data: PropTypes.shape({
        code: PropTypes.string,
        position: PropTypes.number,
        button_primary_target: PropTypes.string,
        button_secondary_target: PropTypes.string,
        show_secondary_button: PropTypes.bool,
        heading: PropTypes.string,
        text: PropTypes.string,
        button_primary_label: PropTypes.string,
        button_secondary_label: PropTypes.string,
        button_primary_description: PropTypes.string,
        button_secondary_description: PropTypes.string,
        image_alt: PropTypes.string,
        image: PropTypes.shape({
            id: PropTypes.number,
            locale: PropTypes.string,
            title: PropTypes.string,
            href: PropTypes.string,
            src: PropTypes.string,
            thumb_src: PropTypes.string,
        }),
    }),
};
