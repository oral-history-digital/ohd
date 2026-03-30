import heroBg from 'assets/images/hero-bg.jpg';
import { Button } from 'modules/ui';
import { useNavigate } from 'react-router-dom';

import heroData from '../data/dummy-data-hero.json';

export function Hero() {
    const navigate = useNavigate();

    return (
        <section
            className="Hero"
            style={{ backgroundImage: `url(${heroBg})` }}
            data-testid="homepage-hero"
        >
            <div className="Hero-content" data-testid="homepage-hero-content">
                <h1
                    className="Hero-heading"
                    data-testid="homepage-hero-heading"
                >
                    {heroData.heading}
                </h1>
                <p className="Hero-text" data-testid="homepage-hero-text">
                    {heroData.text}
                </p>
                <div className="CtaWrapper" data-testid="homepage-hero-cta">
                    <Button
                        buttonText={heroData.buttons.secondary.label}
                        variant="outlined"
                        size="lg"
                        onClick={() =>
                            navigate(heroData.buttons.secondary.target)
                        }
                        className="Hero-cta--secondary"
                        data-testid="homepage-hero-cta-secondary"
                        title={heroData.buttons.secondary.description}
                    />
                    <Button
                        buttonText={heroData.buttons.primary.label}
                        variant="contained"
                        size="lg"
                        onClick={() =>
                            navigate(heroData.buttons.primary.target)
                        }
                        className="Hero-cta--primary"
                        data-testid="homepage-hero-cta-primary"
                        title={heroData.buttons.primary.description}
                    />
                </div>
            </div>
        </section>
    );
}

export default Hero;
