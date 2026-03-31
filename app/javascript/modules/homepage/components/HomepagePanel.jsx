import { Button } from 'modules/ui';
import { SmartImage } from 'modules/ui';
import PropTypes from 'prop-types';
import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export function HomepagePanel({ image, data, variant }) {
    const navigate = useNavigate();

    return (
        <section
            className={`Panel Panel--${variant}`}
            data-testid={`homepage-panel-${variant}`}
        >
            <div className="Panel-content">
                <SmartImage
                    src={image}
                    alt=""
                    className={`Panel-image Panel-image--${variant} Panel-image--clickable`}
                    aspectRatio="16/9"
                    objectFit="cover"
                    onClick={() => navigate(data.buttons.primary.target)}
                    data-testid={`homepage-panel-image-${variant}`}
                />
                <h2 className="Panel-heading">{data.heading}</h2>
                <p className="Panel-text">{data.text}</p>
                <div className="CtaWrapper">
                    <Button
                        buttonText={<FaArrowRight />}
                        variant="contained"
                        size="lg"
                        onClick={() => navigate(data.buttons.primary.target)}
                        className="Panel-cta--primary"
                        data-testid={`homepage-panel-cta-primary-${variant}`}
                    />
                </div>
            </div>
        </section>
    );
}

HomepagePanel.propTypes = {
    image: PropTypes.string.isRequired,
    data: PropTypes.shape({
        heading: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        buttons: PropTypes.shape({
            primary: PropTypes.shape({
                target: PropTypes.string.isRequired,
            }).isRequired,
        }).isRequired,
    }).isRequired,
    variant: PropTypes.string.isRequired,
};

export default HomepagePanel;
