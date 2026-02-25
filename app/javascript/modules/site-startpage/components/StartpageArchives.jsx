import { useCallback, useEffect, useRef, useState } from 'react';

import { getStartpageProjects } from 'modules/data';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import ArchiveTile from './ArchiveTile';

export function StartpageArchives({ className }) {
    const archives = useSelector(getStartpageProjects);
    const { t } = useI18n();
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

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
    }, [updateScrollButtons, archives]);

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
            <div className="StartpageArchives-header">
                <h3 className="Startpage-heading u-mt-none u-mb-none">
                    {t('modules.site_startpage.sample_archives')}
                </h3>

                <div className="StartpageArchives-nav">
                    <button
                        type="button"
                        className="StartpageArchives-navBtn"
                        onClick={() => scroll(-1)}
                        disabled={!canScrollLeft}
                        aria-label={t('modules.site_startpage.previous')}
                    >
                        &#8249;
                    </button>
                    <button
                        type="button"
                        className="StartpageArchives-navBtn"
                        onClick={() => scroll(1)}
                        disabled={!canScrollRight}
                        aria-label={t('modules.site_startpage.next')}
                    >
                        &#8250;
                    </button>
                </div>
            </div>

            <div
                className="StartpageArchives-scroll u-mt"
                ref={scrollRef}
                onScroll={handleScroll}
            >
                {archives.map((archive) => (
                    <ArchiveTile key={archive.id} archive={archive} />
                ))}
            </div>
        </article>
    );
}

export default StartpageArchives;

StartpageArchives.propTypes = {
    className: PropTypes.string,
};
