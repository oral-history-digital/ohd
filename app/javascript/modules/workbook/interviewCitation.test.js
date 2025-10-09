import interviewCitation from './interviewCitation';
import timekeeper from 'timekeeper';

const interview = {
    anonymous_title: { de: 'Alice H.' },
    archive_id: 'da001',
    interview_date: '18.06.2005',
};
const project = {
    archive_domain: 'http://www.example.com:3000',
    name: { de: 'Dummy Archive' },
};
const pathBase = '/de';
const locale = 'de';
const translations = {
    de: {
        interview: 'Interview',
        modules: {
            workbook: {
                position: 'Position',
            },
        },
    },
};

beforeAll(() => {
    // Lock Time
    timekeeper.freeze(new Date('2014-01-01'));
});

afterAll(() => {
    // Unlock Time
    timekeeper.reset();
});

test('creates citation string for interviews', () => {
    const t = (k) => {
        return (
            translations[locale][k] ||
            translations[locale]?.modules?.workbook?.position ||
            k
        );
    };
    const actual = interviewCitation(
        interview,
        project,
        pathBase,
        undefined,
        undefined,
        { t, locale }
    );
    const expected =
        'Alice H., Interview da001, 18.06.2005, Dummy Archive, http://www.example.com:3000/de/interviews/da001, 01.01.2014';

    expect(actual).toEqual(expected);
});

test('creates citation string for segments', () => {
    const t = (k) => {
        return (
            translations[locale][k] ||
            translations[locale]?.modules?.workbook?.position ||
            k
        );
    };
    const actual = interviewCitation(interview, project, pathBase, 1, 3245, {
        t,
        locale,
    });
    const expected =
        'Alice H., Interview da001, 18.06.2005, Position: 1 – 0:54:05, Dummy Archive, http://www.example.com:3000/de/interviews/da001?tape=1&time=0h54m05s, 01.01.2014';

    expect(actual).toEqual(expected);
});

test('works for projects without archive domain', () => {
    const projectWithoutDomain = {
        ...project,
        archive_domain: null,
    };
    const t = (k) => {
        return (
            translations[locale][k] ||
            translations[locale]?.modules?.workbook?.position ||
            k
        );
    };
    const actual = interviewCitation(
        interview,
        projectWithoutDomain,
        '/da/de',
        undefined,
        undefined,
        { t, locale }
    );
    const expected =
        'Alice H., Interview da001, 18.06.2005, Dummy Archive, https://portal.oral-history.digital/da/de/interviews/da001, 01.01.2014';

    expect(actual).toEqual(expected);
});
