import { useMemo } from 'react';

import { useI18n } from 'modules/i18n';
import { TableWithPagination, DateCell } from 'modules/tables';
import useHelpTexts from './useHelpTexts';
import HelpTextRowActions from './HelpTextRowActions';

export default function HelpTextTable() {
    const { t, locale } = useI18n();
    const { data, isLoading } = useHelpTexts();

    const columns = useMemo(() => ([
        {
            accessorKey: 'id',
            header: t('activerecord.attributes.default.id'),
        },
        {
            accessorKey: 'code',
            header: t('activerecord.attributes.help_text.code'),
        },
        {
            accessorKey: 'description',
            header: t('activerecord.attributes.help_text.description'),
        },
        {
            accessorKey: 'text',
            header: t('activerecord.attributes.help_text.text'),
        },
        {
            accessorKey: 'url',
            header: t('activerecord.attributes.help_text.url'),
        },
        {
            accessorKey: 'created_at',
            header: t('activerecord.attributes.default.created_at'),
            cell: DateCell
        },
        {
            accessorKey: 'updated_at',
            header: t('activerecord.attributes.default.updated_at'),
            cell: DateCell
        },
        {
            id: 'actions',
            header: t('modules.tables.actions'),
            cell: HelpTextRowActions
        }
    ]), [locale]);

    return (
        <TableWithPagination
            data={data}
            columns={columns}
            isLoading={isLoading}
        />
    );
}
