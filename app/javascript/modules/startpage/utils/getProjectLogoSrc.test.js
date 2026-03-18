import getProjectLogoSrc from './getProjectLogoSrc';

const project = {
    default_locale: 'de',
    logos: {
        1: { locale: 'de', src: '/logos/de.svg' },
        2: { locale: 'en', src: '/logos/en.svg' },
    },
};

test('returns locale logo when available', () => {
    expect(getProjectLogoSrc(project, 'en')).toEqual('/logos/en.svg');
});

test('falls back to default locale logo', () => {
    expect(getProjectLogoSrc(project, 'uk')).toEqual('/logos/de.svg');
});

test('returns null when logos are missing', () => {
    expect(getProjectLogoSrc({ default_locale: 'de' }, 'de')).toBeNull();
});

test('returns null when all logos lack src', () => {
    const projectWithoutSrc = {
        default_locale: 'de',
        logos: {
            1: { locale: 'de' },
            2: { locale: 'en', src: '' },
        },
    };

    expect(getProjectLogoSrc(projectWithoutSrc, 'de')).toBeNull();
});
