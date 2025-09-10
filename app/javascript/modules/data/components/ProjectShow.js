import { getLocale } from 'modules/archive';
import { LinkOrA } from 'modules/routes';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

export default function ProjectShow({ data, hideLogo, children }) {
    const locale = useSelector(getLocale);

    const logo =
        data.logos &&
        Object.values(data.logos).find((l) => l.locale === locale);

    return (
        <>
            <LinkOrA project={data} to="">
                {!hideLogo && (
                    <img
                        className="logo-img"
                        src={logo?.src}
                        alt="project logo"
                    />
                )}
                {data.name[locale]}
            </LinkOrA>
            {children}
        </>
    );
}

ProjectShow.propTypes = {
    data: PropTypes.object.isRequired,
    hideLogo: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};
