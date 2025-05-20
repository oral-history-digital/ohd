import { Menu, MenuButton, MenuItem, MenuList } from '@reach/menu-button';
import '@reach/menu-button/styles.css';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { BsGearFill } from 'react-icons/bs';
import { IoIosArrowForward } from 'react-icons/io';
import { LuSettings2 } from 'react-icons/lu';
import { MdSlowMotionVideo } from 'react-icons/md';

function ConfigurationMenu({ player, playbackRates, qualities }) {
    /* ──────────── state ──────────── */
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [showRateSubmenu, setShowRateSubmenu] = useState(false);
    const [showQualitySubmenu, setShowQualitySubmenu] = useState(false);
    const [selectedRate, setSelectedRate] = useState(player.playbackRate());

    const [selectedQuality, setSelectedQuality] = useState(() => {
        if (player?.currentSources?.length) {
            const src =
                player.currentSources().find((s) => s.selected) ||
                player.currentSources()[0];
            return src.label || (src.height ? `${src.height}p` : qualities[0]);
        }
        return qualities[0];
    });

    /* ──────────── refs ──────────── */
    const rateMenuItemRef = useRef(null);
    const qualityMenuItemRef = useRef(null);
    const allSourcesRef = useRef([]);

    /* guardar fuentes al montar */
    useEffect(() => {
        if (player?.currentSources)
            allSourcesRef.current = player.currentSources();
    }, [player]);

    const menuTimeout = useRef(null);
    const rateSubTimeout = useRef(null);
    const qualitySubTimeout = useRef(null);

    /* helper: es HLS/DASH ? */
    const isHls = () =>
        (player.currentSource().type || '').includes('mpegURL') || player.vhs;

    /* helper: ocultar controles nativos no deseados */
    const hideNativeControls = () => {
        /* QualitySelector nativo */
        const nativeQS =
            player.controlBar?.getChild('qualitySelector') ||
            player.controlBar?.children_.find(
                (c) => c?.constructor?.name === 'QualitySelector'
            );
        if (nativeQS && !player.isFullscreen()) nativeQS.hide();

        /* PlaybackRateMenuButton nativo */
        const nativePR =
            player.controlBar?.getChild('playbackRateMenuButton') ||
            player.controlBar?.children_.find(
                (c) => c?.constructor?.name === 'PlaybackRateMenuButton'
            );
        if (nativePR && !player.isFullscreen()) nativePR.hide();

        /* Asegurar que tu ConfigurationControl siga visible */
        const cfg = player.controlBar?.getChild('ConfigurationControl');
        if (cfg && !player.isFullscreen()) cfg.show();
    };

    /* listeners globales */
    useEffect(() => {
        if (!player) return;

        const onRate = () => setSelectedRate(player.playbackRate());
        player.on('ratechange', onRate);

        const afterEvt = () => setTimeout(hideNativeControls, 0);
        player.on('sourceset', afterEvt);
        player.on('loadstart', afterEvt);
        player.on('fullscreenchange', afterEvt);

        hideNativeControls(); // inicial

        return () => {
            player.off('ratechange', onRate);
            player.off('sourceset', afterEvt);
            player.off('loadstart', afterEvt);
            player.off('fullscreenchange', afterEvt);
        };
    }, [player]);

    /* handler: cambio de velocidad */
    const handlePlaybackRate = (rate) => {
        player.playbackRate(rate);
        setSelectedRate(rate);
        setShowRateSubmenu(false);
        setIsMenuVisible(false);
    };

    /* handler: cambio de calidad */
    const handleQualitySelect = (qualityLabel) => {
        if (!player) return;

        /* ───── HLS/DASH ───── */
        if (isHls()) {
            const reps = player.vhs?.representations?.() || [];
            reps.forEach((r) => {
                const wanted = qualityLabel.replace(/\D/g, '');
                r.enabled(!wanted || String(r.height) === wanted);
            });
            console.log(`[Quality] (HLS) → ${qualityLabel}`);
        } else {
            /* ───── MP4 progresivo ───── */
            const all = allSourcesRef.current;
            const selected = all.find(
                (s) => (s.label || `${s.height}p`) === qualityLabel
            );
            if (!selected) return;

            const others = all.filter((s) => s !== selected);
            const time = player.currentTime();
            const wasPaused = player.paused();

            console.log(`[Quality] (MP4) → ${qualityLabel}`);

            player.src([selected, ...others]);

            /* al empezar a cargar, esconder controles nativos y big-play si estaba en play */
            player.one('loadstart', () => {
                setTimeout(hideNativeControls, 0);
                if (!wasPaused) player.getChild('BigPlayButton')?.hide();
            });

            player.one('loadedmetadata', () => {
                player.currentTime(time);
                if (!wasPaused) player.play();
            });
        }

        /* actualizar UI & cerrar menús */
        setSelectedQuality(qualityLabel);
        setTimeout(() => {
            setShowQualitySubmenu(false);
            setIsMenuVisible(false);
        }, 0);

        player.trigger('qualitySelected', { quality: qualityLabel });
    };

    /* limpiar timeouts al desmontar */
    useEffect(
        () => () => {
            clearTimeout(menuTimeout.current);
            clearTimeout(rateSubTimeout.current);
            clearTimeout(qualitySubTimeout.current);
        },
        []
    );

    /* ──────────── UI ──────────── */
    return (
        <div
            className="vjs-configuration-menu-container"
            onMouseEnter={() => {
                clearTimeout(menuTimeout.current);
                setIsMenuVisible(true);
            }}
            onMouseLeave={() => {
                menuTimeout.current = setTimeout(() => {
                    setIsMenuVisible(false);
                    setShowRateSubmenu(false);
                    setShowQualitySubmenu(false);
                }, 100);
            }}
        >
            <Menu>
                <MenuButton className="vjs-configuration-menu-button">
                    <BsGearFill className="vjs-configuration-menu-icon" />
                </MenuButton>

                {isMenuVisible && (
                    <MenuList className="vjs-configuration-menu">
                        {/* RATE */}
                        <MenuItem
                            ref={rateMenuItemRef}
                            className="vjs-configuration-menu-item main-container"
                            onMouseEnter={() => {
                                clearTimeout(rateSubTimeout.current);
                                setShowRateSubmenu(true);
                            }}
                            onMouseLeave={() => {
                                rateSubTimeout.current = setTimeout(
                                    () => setShowRateSubmenu(false),
                                    100
                                );
                            }}
                        >
                            <div className="menu-item-title-container">
                                <MdSlowMotionVideo className="rate-icon" />
                                <span>Rate</span>
                            </div>
                            <IoIosArrowForward />
                        </MenuItem>

                        {showRateSubmenu && (
                            <div
                                className="vjs-configuration-submenu horizontal-menu"
                                onMouseEnter={() => {
                                    clearTimeout(rateSubTimeout.current);
                                    setShowRateSubmenu(true);
                                }}
                                onMouseLeave={() => {
                                    rateSubTimeout.current = setTimeout(
                                        () => setShowRateSubmenu(false),
                                        100
                                    );
                                }}
                                style={{
                                    top: rateMenuItemRef.current
                                        ? rateMenuItemRef.current.offsetTop - 5
                                        : 0,
                                }}
                            >
                                {playbackRates.map((rate) => (
                                    <MenuItem
                                        key={rate}
                                        className={`vjs-configuration-submenu-item ${
                                            selectedRate === rate
                                                ? 'selected'
                                                : ''
                                        }`}
                                        onSelect={() =>
                                            handlePlaybackRate(rate)
                                        }
                                    >
                                        {rate}x
                                    </MenuItem>
                                ))}
                            </div>
                        )}

                        <hr className="vjs-configuration-menu-divider" />

                        {/* QUALITY */}
                        <MenuItem
                            ref={qualityMenuItemRef}
                            className="vjs-configuration-menu-item main-container"
                            onMouseEnter={() => {
                                clearTimeout(qualitySubTimeout.current);
                                setShowQualitySubmenu(true);
                            }}
                            onMouseLeave={() => {
                                qualitySubTimeout.current = setTimeout(
                                    () => setShowQualitySubmenu(false),
                                    100
                                );
                            }}
                        >
                            <div className="menu-item-title-container">
                                <LuSettings2 className="quality-icon" />
                                <span>Quality</span>
                            </div>
                            <IoIosArrowForward />
                        </MenuItem>

                        {showQualitySubmenu && (
                            <div
                                className="vjs-configuration-submenu horizontal-menu"
                                onMouseEnter={() => {
                                    clearTimeout(qualitySubTimeout.current);
                                    setShowQualitySubmenu(true);
                                }}
                                onMouseLeave={() => {
                                    qualitySubTimeout.current = setTimeout(
                                        () => setShowQualitySubmenu(false),
                                        100
                                    );
                                }}
                                style={{
                                    top: qualityMenuItemRef.current
                                        ? qualityMenuItemRef.current.offsetTop -
                                          5
                                        : 0,
                                }}
                            >
                                {qualities.map((q) => (
                                    <MenuItem
                                        key={q}
                                        className={`vjs-configuration-submenu-item ${
                                            selectedQuality === q
                                                ? 'selected'
                                                : ''
                                        }`}
                                        onSelect={() => handleQualitySelect(q)}
                                    >
                                        {q}
                                    </MenuItem>
                                ))}
                            </div>
                        )}
                    </MenuList>
                )}
            </Menu>
        </div>
    );
}

ConfigurationMenu.propTypes = {
    player: PropTypes.object.isRequired,
    playbackRates: PropTypes.arrayOf(PropTypes.number).isRequired,
    qualities: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ConfigurationMenu;
