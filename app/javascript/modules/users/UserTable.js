import { useMemo } from 'react';

import { useI18n } from 'modules/i18n';
import { TableWithPagination, DateCell } from 'modules/tables';
import useUsers from './useUsers';
import UserRowActions from './UserRowActions';

export default function UserTable() {
    const { t, locale } = useI18n();
    const { data, isLoading } = useUsers();

    const columns = useMemo(() => ([
        //{
            //accessorKey: 'id',
            //header: t('activerecord.attributes.default.id'),
        //},
        {
            id: 'last_name',
            accessorFn: row => row.last_name,
            header: t('activerecord.attributes.user_registration.last_name')
        },
        {
            id: 'first_name',
            accessorFn: row => row.first_name,
            header: t('activerecord.attributes.user_registration.first_name')
        },
        {
            id: 'email',
            accessorFn: row => row.email,
            header: t('activerecord.attributes.user_registration.email'),
        },
        //{
            //accessorKey: 'created_at',
            //header: t('activerecord.attributes.default.created_at'),
            //cell: DateCell
        //},
        //{
            //accessorKey: 'updated_at',
            //header: t('activerecord.attributes.default.updated_at'),
            //cell: DateCell
        //},
        {
            id: 'actions',
            header: t('modules.tables.actions'),
            cell: UserRowActions
        }
    ]), [locale]);

    return (
        <TableWithPagination
            data={Object.values(data || {})}
            columns={columns}
            isLoading={isLoading}
        />
    );
}
