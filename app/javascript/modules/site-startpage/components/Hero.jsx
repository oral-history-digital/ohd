import heroBg from 'assets/images/hero-bg.jpg';
import { Button } from 'modules/ui';
import { useNavigate } from 'react-router-dom';

import heroData from '../data/dummy-data-hero.json';

export function Hero() {
    const navigate = useNavigate();

    return (
        <section className="Hero" style={{ backgroundImage: `url(${heroBg})` }}>
            <div className="Hero-content">
                <h1 className="Hero-heading">{heroData.heading}</h1>
                <p className="Hero-text">{heroData.text}</p>
                <div className="CtaWrapper">
                    <Button
                        buttonText={heroData.buttons.secondary.label}
                        variant="outlined"
                        size="large"
                        onClick={() =>
                            navigate(heroData.buttons.secondary.target)
                        }
                        className="Hero-cta--secondary"
                    />
                    <Button
                        buttonText={heroData.buttons.primary.label}
                        variant="contained"
                        size="large"
                        onClick={() =>
                            navigate(heroData.buttons.primary.target)
                        }
                        className="Hero-cta--primary"
                    />
                </div>
            </div>
        </section>
    );
}

export default Hero;
