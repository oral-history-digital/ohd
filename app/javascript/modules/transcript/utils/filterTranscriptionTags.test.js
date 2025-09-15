import { filterTranscriptionTags } from './filterTranscriptionTags';

describe('filterTranscriptionTags', () => {
    // Should ignore certain tags completely
    it('ignores some transcription tags completely', () => {
        const withTagsToIgnore = [
            // Language changes
            ['This is <l(en) English text>, you see?', 'This is, you see?'],
            ['This is <l(fr) Texte français>, you see?', 'This is, you see?'],
            ['This is <l(it) Testo italiano>, you see?', 'This is, you see?'],
            [
                'This is <l(pt) Texto em português>, you see?',
                'This is, you see?',
            ],
            ['This is <l(es) Texto en español>, you see?', 'This is, you see?'],
            ['This is <l(de) Deutscher Text>, you see?', 'This is, you see?'],
            ['This is <l(ar) مرحبا بالعالم>, you see?', 'This is, you see?'],
            // Vocalizations
            ['This is <v(Lachen)>, you see?', 'This is, you see?'],
            ['This is <v(Weinen)>, you see?', 'This is, you see?'],
            ['This is <v(Seufzen)>, you see?', 'This is, you see?'],
            ['This is <v(Räuspern)>, you see?', 'This is, you see?'],
            ['This is <v(Husten)>, you see?', 'This is, you see?'],
            ['This is <v(Gähnen)>, you see?', 'This is, you see?'],
            // Notes
            ['This is <n(Kurfürstendamm)>, you see?', 'This is, you see?'],
            ['This is <n(Champs-Élysées)>, you see?', 'This is, you see?'],
            ['This is <n(Plaza Mayor)>, you see?', 'This is, you see?'],
            ['This is <n(Grand Canyon)>, you see?', 'This is, you see?'],
            ['This is <n(Νέα Υόρκη)>, you see?', 'This is, you see?'],
            ['This is <n(مصر)>, you see?', 'This is, you see?'],
            ['This is <n(東京)>, you see?', 'This is, you see?'],
            ['This is <n(Москва)>, you see?', 'This is, you see?'],
            ['This is <n(القاهرة)>, you see?', 'This is, you see?'],
            ['This is <n(北京)>, you see?', 'This is, you see?'],
            // Interruptions
            ['This is <i(Batteriewechsel)>, you see?', 'This is, you see?'],
            ['This is <i(تغيير البطارية)>, you see?', 'This is, you see?'],
            ['This is <i(バッテリー交換)>, you see?', 'This is, you see?'],
            ['This is <i(смена батареи)>, you see?', 'This is, you see?'],
            ['This is <i(cambio de batería)>, you see?', 'This is, you see?'],
            // Pauses
            ['This is <p2>, you see?', 'This is, you see?'],
            ['This is <p3>, you see?', 'This is, you see?'],
            ['This is <p4>, you see?', 'This is, you see?'],
            ['This is <p5>, you see?', 'This is, you see?'],
            ['This is <p125>, you see?', 'This is, you see?'],
        ];

        withTagsToIgnore.forEach(([withTags, expected]) => {
            expect(filterTranscriptionTags(withTags)).toBe(expected);
        });
    });

    it('removes tags correctly when main text is Arabic or Hebrew', () => {
        const rtlCases = [
            // Arabic main text with a vocalization tag
            ['مرحبا <v(صوت)>, كيف الحال?', 'مرحبا, كيف الحال?'],
            // Hebrew main text with a note tag
            ['שלום <n(תל אביב)>, מה שלומך?', 'שלום, מה שלומך?'],
            // Arabic with pause and vocalization tags mixed
            ['هذا <p2> نص <v(صوت)> عربي.', 'هذا نص عربي.'],
            // Hebrew with language tag and vocalization, multiple tags
            ['שלום <l(en) Hello> <v(שם)>, מה קורה?', 'שלום, מה קורה?'],
        ];

        rtlCases.forEach(([input, expected]) => {
            expect(filterTranscriptionTags(input)).toBe(expected);
        });
    });

    it('keeps strings for s/nl/g tags while removing the rest of the tag', () => {
        const cases = [
            [
                'This is <s(Sprechweise) SPEAK STYLE>, you see?',
                'This is SPEAK STYLE, you see?',
            ],
            ['Here <nl(Geräusch) NOISE> is noise.', 'Here NOISE is noise.'],
            ['He <g(Art der Geste) GESTURE> waved.', 'He GESTURE waved.'],
            // multiple occurrences
            ['<s(A) A> and <nl(B) B>, done.', 'A and B, done.'],
        ];

        cases.forEach(([input, expected]) => {
            expect(filterTranscriptionTags(input)).toBe(expected);
        });
    });

    it('keeps strings for sim/res/an/? tags while removing the rest of the tag', () => {
        const cases = [
            ['This is <sim SIM> now', 'This is SIM now'],
            ['Response: <res RES>!', 'Response: RES!'],
            ['Note <an AN> here.', 'Note AN here.'],
            ['Unknown <? Q> mark', 'Unknown Q mark'],
            // multiple occurrences and adjacency
            ['<sim A><res B> done.', 'A B done.'],
        ];

        cases.forEach(([input, expected]) => {
            expect(filterTranscriptionTags(input)).toBe(expected);
        });
    });
});
