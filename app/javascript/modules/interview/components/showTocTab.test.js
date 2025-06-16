import { PROJECT_DG, PROJECT_ZWAR } from 'modules/constants';
import showTocTab from './showTocTab';

test('is false if project is DG', () => {
    const project = { identifier: PROJECT_DG };
    const interview = { toc_alpha3s: ['ger', 'fre'] };
    const actual = showTocTab(project, interview, 'ger');
    const expected = false;
    expect(actual).toBe(expected);
});

test('is true if toc is available for a given locale', () => {
    const project = { identifier: PROJECT_ZWAR };
    const interview = { toc_alpha3s: ['ger', 'fre'] };
    const actual = showTocTab(project, interview, 'ger');
    const expected = true;
    expect(actual).toBe(expected);
});

test('is false if toc is not available', () => {
    const project = { identifier: PROJECT_ZWAR };
    const interview = { toc_alpha3s: ['ger', 'fre'] };
    const actual = showTocTab(project, interview, 'rus');
    const expected = false;
    expect(actual).toBe(expected);
});
