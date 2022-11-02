import StartpageIntroduction from './StartpageIntroduction';
import StartpageArchives from './StartpageArchives';

export default function SiteStartpage() {
    return (
        <div className="wrapper-content project-index">
            <StartpageIntroduction />

            <StartpageArchives className="u-mt-large" />
        </div>
    );
}
