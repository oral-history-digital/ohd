import { useMemo } from 'react';

import { useI18n } from 'modules/i18n';
import { TableWithPagination, BooleanCell, DateCell } from 'modules/tables';
import PersonRowActions from './PersonRowActions';
import usePeople from './usePeople';

export default function PersonTable() {
    const { t, locale } = useI18n();
    const { data, isLoading } = usePeople();

    const personArray = Object.values(data || {})
        .sort((a, b) => {
            const aLastName = a.names[locale]?.last_name;
            const bLastName = b.names[locale]?.last_name;

            if (aLastName && bLastName) {
                return aLastName.localeCompare(bLastName);
            } else {
                return 0;
            }
        });

    const columns = useMemo(() => ([
        {
            accessorKey: 'id',
            header: t('activerecord.attributes.default.id'),
        },
        {
            id: 'last_name',
            accessorFn: row => row.names[locale]?.last_name,
            header: t('activerecord.attributes.person.last_name')
        },
        {
            id: 'first_name',
            accessorFn: row => row.names[locale]?.first_name,
            header: t('activerecord.attributes.person.first_name')
        },
        {
            id: 'pseudonym_last_name',
            accessorFn: row => row.names[locale]?.pseudonym_last_name,
            header: t('activerecord.attributes.person.pseudonym_last_name')
        },
        {
            id: 'pseudonym_first_name',
            accessorFn: row => row.names[locale]?.pseudonym_first_name,
            header: t('activerecord.attributes.person.pseudonym_first_name')
        },
        {
            accessorKey: 'use_pseudonym',
            header: t('activerecord.attributes.person.use_pseudonym'),
            cell: BooleanCell
        },
        {
            id: 'title',
            accessorFn: row => row.title ? t(`title.${row.title}`) : '',
            header: t('activerecord.attributes.person.title'),
        },
        {
            id: 'gender',
            accessorFn: row => row.gender ? t(`gender.${row.gender}`) : '',
            header: t('activerecord.attributes.person.gender'),
        },
        {
            accessorKey: 'date_of_birth',
            header: t('activerecord.attributes.person.date_of_birth'),
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
            cell: PersonRowActions
        }
    ]), [locale]);

    return (
        <TableWithPagination
            data={personArray}
            columns={columns}
            isLoading={isLoading}
        />
    );
}
