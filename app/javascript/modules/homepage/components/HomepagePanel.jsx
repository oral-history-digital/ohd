import classNames from 'classnames';
import { usePathBase } from 'modules/routes';
import { LinkButton, SmartImage } from 'modules/ui';
import { getIsLoggedIn } from 'modules/user';
import PropTypes from 'prop-types';
import { FaArrowRight } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { isDisabledWhenLoggedIn, isExternalTarget } from '../utils';

export function HomepagePanel({ data, variant }) {
    const navigate = useNavigate();
    const pathBase = usePathBase();
    const isLoggedIn = useSelector(getIsLoggedIn);

    const isImageClickable = !isDisabledWhenLoggedIn(
        data.button_primary_target,
        isLoggedIn
    );
    const handleImageClick = () => {
        isImageClickable
            ? navigate(pathBase + data.button_primary_target)
            : null;
    };

    return (
        <section
            className={`Panel Panel--${variant}`}
            data-testid={`homepage-panel-${variant}`}
        >
            <div className="Panel-content">
                <SmartImage
                    src={data.image?.src}
                    alt={data.image_alt}
                    className={classNames(
                        `Panel-image Panel-image--${variant}`,
                        { 'Panel-image--clickable': isImageClickable }
                    )}
                    aspectRatio="16/9"
                    objectFit="cover"
                    onClick={handleImageClick}
                    data-testid={`homepage-panel-image-${variant}`}
                />
                <h2 className="Panel-heading">{data.heading}</h2>
                <p className="Panel-text">{data.text}</p>
                <div className="CtaWrapper">
                    {data.show_secondary_button &&
                        data.button_secondary_target && (
                            <LinkButton
                                buttonText={data.button_secondary_label}
                                to={pathBase + data.button_secondary_target}
                                title={data.button_secondary_description}
                                variant="outlined"
                                size="md"
                                className={`Panel-cta--secondary`}
                                data-testid={`homepage-panel-cta-secondary-${variant}`}
                                isExternal={isExternalTarget(
                                    data.button_secondary_target
                                )}
                                isDisabled={isDisabledWhenLoggedIn(
                                    data.button_secondary_target,
                                    isLoggedIn
                                )}
                            >
                                {data.button_secondary_label}
                            </LinkButton>
                        )}
                    <LinkButton
                        buttonText={data.button_primary_label}
                        to={pathBase + data.button_primary_target}
                        title={data.button_primary_description}
                        variant="contained"
                        size="md"
                        className={`Panel-cta--primary`}
                        data-testid={`homepage-panel-cta-primary-${variant}`}
                        isExternal={isExternalTarget(
                            data.button_primary_target
                        )}
                        isDisabled={isDisabledWhenLoggedIn(
                            data.button_primary_target,
                            isLoggedIn
                        )}
                        endIcon={<FaArrowRight />}
                    >
                        {data.button_primary_label}
                    </LinkButton>
                </div>
            </div>
        </section>
    );
}

HomepagePanel.propTypes = {
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
    variant: PropTypes.string.isRequired,
};

export default HomepagePanel;
