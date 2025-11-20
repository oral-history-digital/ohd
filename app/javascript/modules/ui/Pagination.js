import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

import { useI18n } from 'modules/i18n';
import getPageRange from './getPageRange';
import { PAGE_SIZES } from './constants';

const WINDOW_SIZE = 5;

export default function Pagination({
    page,
    pageCount,
    pageSize,
    onPageChange,
    onPageSizeChange,
    changePageSize = true,
    className,
}) {
    const { t } = useI18n();

    const hasPreviousPage = page > 1;
    const hasNextPage = page < pageCount;

    const pageRange = getPageRange(pageCount, page, WINDOW_SIZE);

    const hasEllipsisAtFront = pageRange[0] > 1;
    const hasEllipsisAtBack = pageRange[pageRange.length - 1] < pageCount;

    return (
        <nav className={classNames('Pagination', className)}>
            <button
                type="button"
                className="Pagination-browse Button Button--transparent Button--icon"
                disabled={!hasPreviousPage}
                title={t('modules.ui.pagination.prev')}
                aria-label={t('modules.ui.pagination.prev')}
                onClick={() => onPageChange(page - 1)}
            >
                <FaAngleLeft
                    className={classNames(
                        'Icon',
                        hasPreviousPage ? 'Icon--primary' : 'Icon--unobtrusive'
                    )}
                />
            </button>

            {hasEllipsisAtFront && (
                <span className="Pagination-ellipsis u-ml-tiny">…</span>
            )}

            {pageRange.map((number) => (
                <button
                    key={number}
                    type="button"
                    className="Pagination-page Button Button--transparent u-ml-tiny"
                    disabled={number === page}
                    title={t('modules.ui.pagination.page', {
                        current: number,
                        total: pageCount,
                    })}
                    aria-label={t('modules.ui.pagination.page', {
                        current: number,
                        total: pageCount,
                    })}
                    onClick={() => onPageChange(number)}
                >
                    {number}
                </button>
            ))}

            {hasEllipsisAtBack && (
                <span className="Pagination-ellipsis u-ml-tiny">…</span>
            )}

            <button
                type="button"
                className="Pagination-browse Button Button--transparent Button--icon u-ml-tiny"
                disabled={!hasNextPage}
                title={t('modules.ui.pagination.next')}
                aria-label={t('modules.ui.pagination.next')}
                onClick={() => onPageChange(page + 1)}
            >
                <FaAngleRight
                    className={classNames(
                        'Icon',
                        hasNextPage ? 'Icon--primary' : 'Icon--unobtrusive'
                    )}
                />
            </button>

            {changePageSize && (
                <select
                    className="Pagination-pageSize u-ml-tiny"
                    value={pageSize}
                    onChange={(e) => {
                        onPageSizeChange(Number(e.target.value));
                    }}
                >
                    {PAGE_SIZES.map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            {t('modules.ui.pagination.show', { pageSize })}
                        </option>
                    ))}
                </select>
            )}
        </nav>
    );
}

Pagination.propTypes = {
    page: PropTypes.number.isRequired,
    pageCount: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onPageSizeChange: PropTypes.func.isRequired,
    className: PropTypes.string,
};
