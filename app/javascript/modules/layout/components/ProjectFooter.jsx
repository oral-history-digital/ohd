import zwarLogoDe2 from 'assets/images/zwar-logo-red_de.png';
import PropTypes from 'prop-types';

export function ProjectFooter({ project, locale }) {
    const identifier = project && project.shortname;
    console.log('ProjectFooter', { identifier, locale });

    // TODO: This is currently dead code, ZWAR shortname is za. Decide what to do with it.
    if (identifier === 'zwar' && locale === 'de') {
        return (
            <div>
                <p>Weitere Angebote:</p>
                <div style={{ display: 'inline-block' }}>
                    {/* lieber ein div, das sich ausklappt, dann sind normale <a>-Links möglich */}
                    <img
                        src={zwarLogoDe2}
                        alt="Logo des ZWAR-Projekts"
                        style={{
                            paddingRight: '10px',
                            borderRight: '2px solid #9f403f',
                            float: 'left',
                            marginRight: 8,
                            width: '36%',
                        }}
                    />
                    <select
                        className="Link"
                        style={{ color: '#9f403f', marginTop: 5, fontSize: 14 }}
                        onChange={(e) => window.open(e.target.value, '_blank')}
                    >
                        <option defaultValue>
                            Archiv: Vollständige Interviews
                        </option>
                        <option value="https://zwangsarbeit-archiv.de/">
                            Infos: Geschichte und Projekt
                        </option>
                        <option value="https://lernen-mit-interviews.de/">
                            Bildung: Lernen mit Interviews
                        </option>
                        <option value="https://forum.lernen-mit-interviews.de/">
                            Forum: Für Lehrende
                        </option>
                    </select>
                </div>
                <p></p>
                <p>
                    Eine Kooperation der Stiftung &quot;Erinnerung,
                    Verantwortung und Zukunft&quot; mit der Freien Universität
                    Berlin{' '}
                </p>
            </div>
        );
    } else if (identifier === 'campscapes') {
        return (
            <div>
                <p>
                    Created by Freie Universität Berlin within the HERA-funded
                    project Accessing Campscapes. Inclusive Strategies for Using
                    European Conflicted Heritage
                </p>
                <p>
                    <a
                        className="Link"
                        href="https://ec.europa.eu/programmes/horizon2020/en"
                    >
                        This project has received funding from the European
                        Union&apos;s Horizon 2020 research and innovation
                        programme under grant agreement No 649307
                    </a>
                </p>
            </div>
        );
    } else {
        return null;
    }
}

ProjectFooter.propTypes = {
    project: PropTypes.object,
    locale: PropTypes.string.isRequired,
};

export default ProjectFooter;
