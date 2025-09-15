import { checkTextDir } from './checkTextDir';

describe('checkTextDir majority method', () => {
    it('returns "ltr" for pure left-to-right text', () => {
        const result = checkTextDir('Hello, world!');
        expect(result).toBe('ltr');
    });

    it('returns "rtl" for pure right-to-left text', () => {
        const result = checkTextDir('!مرحبا بالعالم');
        expect(result).toBe('rtl');
    });

    it('returns "rtl" for mixed text with majority rtl text', () => {
        const result = checkTextDir('Hello, مرحبا بالعالم!');
        expect(result).toBe('rtl');
    });

    it('returns "ltr" for mixed text with majority ltr text', () => {
        const result = checkTextDir(
            'Hello this is a long text, مرحبا بالعالم!'
        );
        expect(result).toBe('ltr');
    });

    it('returns "ltr" for ltr text with tags', () => {
        const result = checkTextDir('Hello, <l(fr) Texte français>!');
        expect(result).toBe('ltr');
    });

    it('returns "ltr" for ltr text with <s/... KEEP> tags', () => {
        const result = checkTextDir('Hello, <s(Sprechweise) SPEAK STYLE>!');
        expect(result).toBe('ltr');
    });

    it('returns "ltr" for ltr text with <sim KEEP> tags', () => {
        const result = checkTextDir('This is <sim SIM> now');
        expect(result).toBe('ltr');
    });

    it('returns "rtl" for rtl text that contains an s/nl/g tag afterward', () => {
        const result = checkTextDir('مرحبا <nl(Geräusch) NOISE> كيف حالك؟');
        expect(result).toBe('rtl');
    });

    it('returns "rtl" for rtl text with sim/res tags after the text', () => {
        const result = checkTextDir('שלום <res RESP> מה נשמע?');
        expect(result).toBe('rtl');
    });

    it('returns "rtl" for rtl text preceded with tags to be ignored', () => {
        const result = checkTextDir('<l(es) ignorame por favor> מה נשמע?');
        expect(result).toBe('rtl');
    });
});

describe('checkTextDir first-strong method', () => {
    it('first-strong: returns "ltr" when RTL text appears after a tag at the start', () => {
        const result = checkTextDir('<nl(Geräusch) NOISE> مرحبا', {
            method: 'first-strong',
        });
        expect(result).toBe('ltr');
    });

    it('first-strong: returns "ltr" when multiple tags precede RTL text', () => {
        const result = checkTextDir('<sim SIM><s(טון) TONE> שלום', {
            method: 'first-strong',
        });
        expect(result).toBe('ltr');
    });

    it('first-strong: returns "ltr" when an adjacent tag (no space) precedes RTL text', () => {
        const result = checkTextDir('<res RESP>مرحبا', {
            method: 'first-strong',
        });
        expect(result).toBe('ltr');
    });

    it('first-strong: returns "ltr" if a kept LTR string from a tag comes before RTL text', () => {
        const result = checkTextDir('<s(Sprechweise) SPEAK> مرحبا', {
            method: 'first-strong',
        });
        expect(result).toBe('ltr');
    });

    it('first-strong: returns "rtl" even with LTR majority if RTL is at the start', () => {
        const result = checkTextDir(
            'مرحبا <nl(Geräusch) HERE IS SOME LONG TEXT>',
            {
                method: 'first-strong',
            }
        );
        expect(result).toBe('rtl');
    });
});
