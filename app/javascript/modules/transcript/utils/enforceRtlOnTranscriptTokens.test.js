import { enforceRtlOnTranscriptTokens } from './enforceRtlOnTranscriptTokens';

describe('enforceRtlOnTranscriptTokens', () => {
    const RLI = '\u2067';
    const PDI = '\u2069';
    const RLM = '\u200F';

    it('wraps a single sim token with RLM+RLI...PDI+RLM by default', () => {
        const input = 'before <sim SIM> after';
        const expected = `before ${RLM}${RLI}<sim SIM>${PDI}${RLM} after`;
        expect(enforceRtlOnTranscriptTokens(input)).toBe(expected);
    });

    it('wraps a token at the start of the string', () => {
        const input = '<res RESP> hello';
        const expected = `${RLM}${RLI}<res RESP>${PDI}${RLM} hello`;
        expect(enforceRtlOnTranscriptTokens(input)).toBe(expected);
    });

    it('wraps multiple adjacent tokens separately', () => {
        const input = '<sim A><res B> done';
        const expected = `${RLM}${RLI}<sim A>${PDI}${RLM}${RLM}${RLI}<res B>${PDI}${RLM} done`;
        expect(enforceRtlOnTranscriptTokens(input)).toBe(expected);
    });

    it('wraps parentheses-only s(...) tokens (no trailing KEEP)', () => {
        const input = 'x <s(Sprechweise)> y';
        const expected = `x ${RLM}${RLI}<s(Sprechweise)>${PDI}${RLM} y`;
        expect(enforceRtlOnTranscriptTokens(input)).toBe(expected);
    });

    it('does not fence with RLM when fenceWithRLM is false', () => {
        const input = 'x <sim SIM> y';
        const expected = `x ${RLI}<sim SIM>${PDI} y`;
        expect(
            enforceRtlOnTranscriptTokens(input, { fenceWithRLM: false })
        ).toBe(expected);
    });

    it('leaves text without tokens unchanged', () => {
        const input = 'just plain text';
        expect(enforceRtlOnTranscriptTokens(input)).toBe(input);
    });
});
