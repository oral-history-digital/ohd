import { useCallback, useEffect, useRef, useState } from 'react';

import { useGetProjects } from 'modules/data';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';

import ProjectTile from './ProjectTile';

export function HomepageProjects({ className }) {
    const { projects } = useGetProjects({
        all: true,
        workflowState: 'public',
    });
    const { t } = useI18n();
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // Sort by number of contained interviews DESC and keep first 15
    const sortedProjects = [...projects].sort((a, b) => {
        const aCount = a.interviews?.total || 0;
        const bCount = b.interviews?.total || 0;
        return bCount - aCount;
    });
    const displayedProjects = sortedProjects.slice(0, 15);

    const updateScrollButtons = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    }, []);

    useEffect(() => {
        updateScrollButtons();
        window.addEventListener('resize', updateScrollButtons);
        return () => window.removeEventListener('resize', updateScrollButtons);
    }, [updateScrollButtons, displayedProjects]);

    const getCardWidth = () => {
        const el = scrollRef.current;
        if (!el || !el.firstElementChild) return 0;
        const child = el.firstElementChild;
        const style = window.getComputedStyle(el);
        const gap = parseFloat(style.gap) || 0;
        return child.offsetWidth + gap;
    };

    const CARDS_PER_SCROLL = 3;

    const scroll = (direction) => {
        const el = scrollRef.current;
        if (!el) return;
        const cardWidth = getCardWidth();
        el.scrollBy({
            left: direction * cardWidth * CARDS_PER_SCROLL,
            behavior: 'smooth',
        });
    };

    const handleScroll = () => {
        updateScrollButtons();
    };

    return (
        <article className={className}>
            <div className="HomepageProjects-header">
                <h3 className="Homepage-heading u-mt-none u-mb-none">
                    {t('modules.site_startpage.sample_archives')}
                </h3>

                <div className="HomepageProjects-nav">
                    <button
                        type="button"
                        className="HomepageProjects-navBtn"
                        onClick={() => scroll(-1)}
                        disabled={!canScrollLeft}
                        aria-label={t('modules.site_startpage.previous')}
                    >
                        &#8249;
                    </button>
                    <button
                        type="button"
                        className="HomepageProjects-navBtn"
                        onClick={() => scroll(1)}
                        disabled={!canScrollRight}
                        aria-label={t('modules.site_startpage.next')}
                    >
                        &#8250;
                    </button>
                </div>
            </div>

            <div
                className="HomepageProjects-scroll u-mt"
                ref={scrollRef}
                onScroll={handleScroll}
            >
                {displayedProjects.map((project) => (
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
