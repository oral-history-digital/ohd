import { FaUndo } from 'react-icons/fa';
import { useDispatch } from 'react-redux';

import { useI18n } from 'modules/i18n';
import { isMobile } from 'modules/user-agent';
import { Spinner } from 'modules/spinners';
import { hideSidebar } from 'modules/sidebar';
import { useSearchParams } from 'modules/query-string';
import ArchiveFacets from './ArchiveFacets';
import useFacets from '../useFacets';

export default function ArchiveSearchForm() {
    const { t } = useI18n();
    const { facets } = useFacets();
    const { resetSearchParams } = useSearchParams();
    const dispatch = useDispatch();

    function handleReset() {
        resetSearchParams();

        if (isMobile()) {
            dispatch(hideSidebar());
        }
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (isMobile()) {
            dispatch(hideSidebar());
        }
    }

    return (
        <div>
            <form
                id="archiveSearchForm"
                className="flyout-search"
                onSubmit={handleSubmit}
            >
                <button
                    type="button"
                    className="Button reset"
                    onClick={handleReset}
                >
                    {t('reset')}
                    <FaUndo className="Icon" />
                </button>

                {facets ? (
                    <ArchiveFacets map handleSubmit={handleSubmit} />
                ) : (
                    <Spinner withPadding />
                )}
            </form>
        </div>
    );
}
