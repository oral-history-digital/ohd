import { usePathBase } from 'modules/routes';
import { LinkButton } from 'modules/ui';
import PropTypes from 'prop-types';

import { isExternalTarget } from '../utils';

export function Hero({ data }) {
    const pathBase = usePathBase();

    if (!data) return null;

    return (
        <section
            className="Hero"
            style={{ backgroundImage: `url(${data.image?.src})` }}
            data-testid="homepage-hero"
        >
            <div className="Hero-content" data-testid="homepage-hero-content">
                <h1
                    className="Hero-heading"
                    data-testid="homepage-hero-heading"
                >
                    {data.heading}
                </h1>
                <p className="Hero-text" data-testid="homepage-hero-text">
                    {data.text}
                </p>
                <div className="CtaWrapper" data-testid="homepage-hero-cta">
                    {data.show_secondary_button && (
                        <LinkButton
                            buttonText={data.button_secondary_label}
                            variant="outlined"
                            size="lg"
                            to={pathBase + data.button_secondary_target}
                            className="Hero-cta--secondary"
                            data-testid="homepage-hero-cta-secondary"
                            title={data.button_secondary_description}
                            isExternal={isExternalTarget(
                                data.button_secondary_target
                            )}
                        />
                    )}
                    <LinkButton
                        buttonText={data.button_primary_label}
                        variant="contained"
                        size="lg"
                        to={pathBase + data.button_primary_target}
                        className="Hero-cta--primary"
                        data-testid="homepage-hero-cta-primary"
                        title={data.button_primary_description}
                        isExternal={isExternalTarget(
                            data.button_primary_target
                        )}
                    />
                </div>
            </div>
        </section>
    );
}

export default Hero;

Hero.propTypes = {
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
