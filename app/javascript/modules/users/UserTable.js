import { useMemo } from 'react';

import { useI18n } from 'modules/i18n';
import { TableWithPagination, DateCell } from 'modules/tables';
import useUsers from './useUsers';
import UserRowActions from './UserRowActions';

export default function UserTable() {
    const { t, locale } = useI18n();
    const { data, isLoading } = useUsers();

    const columns = useMemo(() => ([
        {
            id: 'first_name',
            accessorFn: row => row.first_name,
            header: t('activerecord.attributes.user_registration.first_name')
        },
        {
            id: 'last_name',
            accessorFn: row => row.last_name,
            header: t('activerecord.attributes.user_registration.last_name')
        },
        {
            id: 'email',
            accessorFn: row => row.email,
            header: t('activerecord.attributes.user_registration.email'),
        },
        {
            accessorKey: 'activated_at',
            header: t('activerecord.attributes.user_registration.activated_at'),
            accessorFn: row => row.activated_at,
            //cell: DateCell
        },
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
