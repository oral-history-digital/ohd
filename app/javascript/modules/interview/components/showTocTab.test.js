import { PROJECT_DG, PROJECT_ZWAR } from 'modules/constants';

import showTocTab from './showTocTab';

test('is false if project is DG', () => {
    const project = { shortname: PROJECT_DG };
    const interview = { toc_alpha3s: ['ger', 'fre'] };
    const actual = showTocTab(project, interview, 'de');
    const expected = false;
    expect(actual).toBe(expected);
});

test('is true if toc is available for a given locale', () => {
    const project = { shortname: PROJECT_ZWAR };
    const interview = { toc_alpha3s: ['ger', 'fre'] };
    const actual = showTocTab(project, interview, 'de');
    const expected = true;
    expect(actual).toBe(expected);
});

test('is false if toc is not available', () => {
    const project = { identifier: PROJECT_ZWAR };
    const interview = { toc_alpha3s: ['ger', 'fre'] };
    const actual = showTocTab(project, interview, 'ru');
    const expected = false;
    expect(actual).toBe(expected);
});
