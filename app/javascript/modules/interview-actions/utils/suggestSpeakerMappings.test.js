import { suggestSpeakerMappings } from './suggestSpeakerMappings';

const people = {
    1: { initials: 'AM' },
    2: { initials: 'BH' },
    3: { initials: 'BH' },
};

test('prefers existing designations over initials, including normalized matches', () => {
    const contributions = [
        { id: 10, person_id: 1, speaker_designation: ' int ' },
        { id: 20, person_id: 2, speaker_designation: 'INTERVIEWEE' },
    ];
    expect(
        suggestSpeakerMappings(contributions, people, [
            'INT',
            'AM',
            'INTERVIEWEE',
            'BH',
        ])
    ).toEqual([
        { ...contributions[0], speaker_designation: 'INT' },
        contributions[1],
    ]);
});

test.each(['am', ' IP_AM ', 'speaker-AM'])(
    'matches unique initials against %p while preserving the file label',
    (label) => {
        const contribution = {
            id: 10,
            person_id: 1,
            speaker_designation: 'OLD',
        };
        expect(suggestSpeakerMappings([contribution], people, [label])).toEqual(
            [{ ...contribution, speaker_designation: label }]
        );
    }
);

test('leaves ambiguous initials, multiple matching labels, and missing initials unselected', () => {
    const contributions = [
        { id: 10, person_id: 1, speaker_designation: 'OLD' },
        { id: 20, person_id: 2 },
        { id: 30, person_id: 3 },
        { id: 40, person_id: 4 },
    ];
    expect(
        suggestSpeakerMappings(contributions, people, [
            'AM',
            'IP_AM',
            'BH',
            'OTHER',
        ]).map((contribution) => contribution.speaker_designation)
    ).toEqual(['', '', '', '']);
});

test('does not suggest a label already assigned to another participant', () => {
    const contributions = [
        { id: 20, person_id: 2, speaker_designation: 'IP_BH' },
        { id: 30, person_id: 3 },
    ];
    expect(suggestSpeakerMappings(contributions, people, ['IP_BH'])).toEqual([
        contributions[0],
        { ...contributions[1], speaker_designation: '' },
    ]);
});

test('preserves manual choices and cleared mappings, reserving manual choices', () => {
    const contributions = [
        { id: 10, person_id: 1, speaker_designation: 'CUSTOM' },
        { id: 20, person_id: 2, speaker_designation: '' },
        { id: 30, person_id: 3, speaker_designation: 'BH' },
    ];
    const edited = new Set([10, 20, 30]);
    expect(
        suggestSpeakerMappings(contributions, people, ['AM', 'BH'], edited)
    ).toEqual(contributions);

    expect(
        suggestSpeakerMappings(
            contributions,
            people,
            ['AM', 'BH'],
            new Set([10, 30])
        )
    ).toEqual([
        contributions[0],
        { ...contributions[1], speaker_designation: '' },
        contributions[2],
    ]);
});

test('returns the original contributions without labels or people', () => {
    const contributions = [
        { id: 10, person_id: 1, speaker_designation: 'INT' },
    ];
    expect(suggestSpeakerMappings(contributions, people, null)).toBe(
        contributions
    );
    expect(suggestSpeakerMappings(contributions, people, [])).toBe(
        contributions
    );
    expect(suggestSpeakerMappings(contributions, null, ['AM'])).toBe(
        contributions
    );
});

test('does not mutate contributions, people, labels, or edited IDs', () => {
    const contribution = Object.freeze({
        id: 10,
        person_id: 1,
        speaker_designation: 'OLD',
    });
    const contributions = Object.freeze([contribution]);
    const participants = Object.freeze({
        1: Object.freeze({ initials: 'AM' }),
    });
    const labels = Object.freeze(['AM']);
    const edited = new Set();

    expect(
        suggestSpeakerMappings(contributions, participants, labels, edited)
    ).toEqual([{ ...contribution, speaker_designation: 'AM' }]);
    expect(contribution.speaker_designation).toBe('OLD');
    expect([...edited]).toEqual([]);
});
