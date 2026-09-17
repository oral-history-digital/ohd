import { selectBreadcrumbLogo } from './Breadcrumbs';

describe('selectBreadcrumbLogo', () => {
    const defaultLogo = '/uploads/breadcrumb.svg';
    const outlineLogo = '/uploads/breadcrumb-outline.svg';

    test('uses separate logos for umbrella and other projects', () => {
        const instanceSettings = {
            breadcrumb_logo_url: defaultLogo,
            secondary_breadcrumb_logo_url: outlineLogo,
        };

        expect(
            selectBreadcrumbLogo({
                logoVariant: 'default',
                instanceSettings,
            })
        ).toBe(defaultLogo);
        expect(
            selectBreadcrumbLogo({
                logoVariant: 'outline',
                instanceSettings,
            })
        ).toBe(outlineLogo);
    });

    test('uses either configured logo for both contexts when only one exists', () => {
        expect(
            selectBreadcrumbLogo({
                logoVariant: 'outline',
                instanceSettings: { breadcrumb_logo_url: defaultLogo },
            })
        ).toBe(defaultLogo);
        expect(
            selectBreadcrumbLogo({
                logoVariant: 'default',
                instanceSettings: {
                    secondary_breadcrumb_logo_url: outlineLogo,
                },
            })
        ).toBe(outlineLogo);
    });

    test('leaves built-in fallback to Logo when no breadcrumb logo exists', () => {
        expect(
            selectBreadcrumbLogo({
                logoVariant: 'default',
                instanceSettings: {},
            })
        ).toBeUndefined();
    });
});
