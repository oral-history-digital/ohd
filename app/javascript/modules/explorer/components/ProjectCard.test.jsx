/* eslint-disable react/prop-types */
import { render, screen } from '@testing-library/react';

import { ProjectCard } from './ProjectCard';

jest.mock('modules/i18n', () => ({
    useI18n: () => ({ t: (key) => key, locale: 'en' }),
    pluralizeKey: (key) => key,
}));
jest.mock('modules/ui', () => ({
    LinkButton: ({ buttonText, to }) => <a href={to}>{buttonText}</a>,
}));
jest.mock('../hooks', () => ({
    useScrollToExpandedCard: () => null,
    useSelectableHeaderToggle: () => ({}),
}));
jest.mock('./CollectionList', () => ({ CollectionList: () => null }));

test('displays v2 project counts and expanded interview languages', () => {
    render(
        <ProjectCard
            project={{
                id: 1,
                shortname: 'archive',
                name: 'Archive',
                collection_counts: { total: 3 },
                interview_counts: { total: 12, public: 12, restricted: 0 },
                interview_languages: ['eng', 'deu'],
            }}
            expanded
            onToggle={jest.fn()}
        />
    );

    expect(
        screen.getByText('3 activerecord.models.collection')
    ).toBeInTheDocument();
    expect(
        screen.getByText('12 activerecord.models.interview')
    ).toBeInTheDocument();
    expect(screen.getByText('deu, eng')).toBeInTheDocument();
    expect(
        screen.getByText(/12 activerecord.models.interview.other/)
    ).toBeInTheDocument();
});
