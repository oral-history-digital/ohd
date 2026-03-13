import { Button } from 'modules/ui';
import PropTypes from 'prop-types';
import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export function StartpagePanel({ image, data, variant }) {
    const navigate = useNavigate();

    return (
        <section className={`Panel Panel--${variant}`}>
            <div className="Panel-content">
                <img
                    src={image}
                    alt=""
                    className={`Panel-image Panel-image--${variant}`}
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
                    />
                </div>
            </div>
        </section>
    );
}

StartpagePanel.propTypes = {
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

export default StartpagePanel;
