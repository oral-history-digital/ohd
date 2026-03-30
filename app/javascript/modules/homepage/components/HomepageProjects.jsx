import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useGetProjects } from 'modules/data';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';

import ProjectTile from './ProjectTile';

const CARDS_PER_SCROLL = 3;

export function HomepageProjects({ className }) {
    const { projects } = useGetProjects({
        all: true,
        workflowState: 'public',
    });
    const { t } = useI18n();
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [hasUserInteracted, setHasUserInteracted] = useState(false);

    // Sort by number of contained interviews DESC and keep first 21
    const sortedProjects = useMemo(
        () =>
            [...projects].sort((a, b) => {
                const aCount = a.interviews?.total || 0;
                const bCount = b.interviews?.total || 0;
                return bCount - aCount;
            }),
        [projects]
    );
    const displayedProjects = useMemo(
        () => sortedProjects.slice(0, 21),
        [sortedProjects]
    );

    // Randomize order of projects to display (only when displayedProjects changes)
    const shuffledProjects = useMemo(
        () => [...displayedProjects].sort(() => Math.random() - 0.5),
        [displayedProjects]
    );

    const updateScrollButtons = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    }, []);

    const scroll = useCallback((direction) => {
        const el = scrollRef.current;
        if (!el) return;
        const cardWidth = getCardWidth();
        el.scrollBy({
            left: direction * cardWidth * CARDS_PER_SCROLL,
            behavior: 'smooth',
        });
    }, []);

    useEffect(() => {
        updateScrollButtons();
        window.addEventListener('resize', updateScrollButtons);
        return () => window.removeEventListener('resize', updateScrollButtons);
    }, [updateScrollButtons, displayedProjects]);

    // Auto-scroll every 3 seconds unless hovering or user has interacted
    useEffect(() => {
        if (isHovering || hasUserInteracted) return;

        const interval = setInterval(() => {
            const el = scrollRef.current;
            if (!el) return;

            const isAtEnd =
                el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;

            if (isAtEnd) {
                el.scrollTo({ left: 0, behavior: 'auto' });
                return;
            }

            scroll(1);
        }, 3000);

        return () => clearInterval(interval);
    }, [isHovering, hasUserInteracted, scroll]);

    const getCardWidth = () => {
        const el = scrollRef.current;
        if (!el || !el.firstElementChild) return 0;
        const child = el.firstElementChild;
        const style = window.getComputedStyle(el);
        const gap = parseFloat(style.gap) || 0;
        return child.offsetWidth + gap;
    };

    const handleScroll = () => {
        updateScrollButtons();
    };

    const handleUserInteraction = () => {
        setHasUserInteracted(true);
    };

    const handleButtonClick = (direction) => {
        setHasUserInteracted(true);
        scroll(direction);
    };

    return (
        <article className={className} data-testid="homepage-projects">
            <div
                className="HomepageProjects-header"
                data-testid="homepage-projects-header"
            >
                <h3
                    className="Homepage-heading u-mt-none u-mb-none"
                    data-testid="homepage-projects-heading"
                >
                    {t('modules.site_startpage.sample_archives')}
                </h3>

                <div
                    className="HomepageProjects-nav"
                    data-testid="homepage-projects-nav"
                >
                    <button
                        type="button"
                        className="HomepageProjects-navBtn"
                        onClick={() => handleButtonClick(-1)}
                        disabled={!canScrollLeft}
                        title={t('modules.site_startpage.previous')}
                        aria-label={t('modules.site_startpage.previous')}
                        data-testid="homepage-projects-nav-prev"
                    >
                        <span className="HomepageProjects-navIcon">
                            &#8249;
                        </span>
                    </button>
                    <button
                        type="button"
                        className="HomepageProjects-navBtn"
                        onClick={() => handleButtonClick(1)}
                        disabled={!canScrollRight}
                        title={t('modules.site_startpage.next')}
                        aria-label={t('modules.site_startpage.next')}
                        data-testid="homepage-projects-nav-next"
                    >
                        <span className="HomepageProjects-navIcon">
                            &#8250;
                        </span>
                    </button>
                </div>
            </div>

            <div
                className="HomepageProjects-scroll"
                ref={scrollRef}
                onScroll={handleScroll}
                onWheel={handleUserInteraction}
                onTouchStart={handleUserInteraction}
                onPointerDown={handleUserInteraction}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                data-testid="homepage-projects-scroll"
            >
                {shuffledProjects.map((project) => (
                    <ProjectTile key={project.id} project={project} />
                ))}
            </div>
        </article>
    );
}

export default HomepageProjects;

HomepageProjects.propTypes = {
    className: PropTypes.string,
};
