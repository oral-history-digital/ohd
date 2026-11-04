import { createContext, useContext, useMemo, useState } from 'react';

import { useProject } from 'modules/routes';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

const DEFAULT_PRIMARY_COLOR = '#e01217';
const DEFAULT_SECONDARY_COLOR = '#808080';
const DEFAULT_EDITORIAL_COLOR = '#262626';
const DEFAULT_ASPECT_X = 4;
const DEFAULT_ASPECT_Y = 3;

export const ThemeContext = createContext({
    primaryColor: DEFAULT_PRIMARY_COLOR,
    secondaryColor: DEFAULT_SECONDARY_COLOR,
    editorialColor: DEFAULT_EDITORIAL_COLOR,
    aspectX: DEFAULT_ASPECT_X,
    aspectY: DEFAULT_ASPECT_Y,
});

export function useTheme() {
    return useContext(ThemeContext);
}

/**
 * Applies project colors and aspect ratios from Redux display details.
 * Retains public branding for the same project while access-sensitive details reload.
 *
 * @param {Object} props - Provider properties.
 * @param {React.ReactNode} [props.children] - Content receiving the theme context.
 * @returns {React.ReactElement} Theme context and CSS variables.
 */
export default function ThemeProvider({ children }) {
    const { project, projectShortname } = useProject();
    const primaryColor = project?.primary_color || DEFAULT_PRIMARY_COLOR;
    const secondaryColor = project?.secondary_color || DEFAULT_SECONDARY_COLOR;
    const editorialColor = project?.editorial_color || DEFAULT_EDITORIAL_COLOR;
    const aspectX = project?.aspect_x || DEFAULT_ASPECT_X;
    const aspectY = project?.aspect_y || DEFAULT_ASPECT_Y;

    const resolvedTheme = useMemo(
        () => ({
            primaryColor,
            secondaryColor,
            editorialColor,
            aspectX,
            aspectY,
        }),
        [primaryColor, secondaryColor, editorialColor, aspectX, aspectY]
    );

    const [retained, setRetained] = useState({ projectShortname, theme: null });

    // Adjust presentation state during render so changing projects clears the
    // fallback immediately, including when navigating back before details load.
    if (
        retained.projectShortname !== projectShortname ||
        (project && retained.theme !== resolvedTheme)
    ) {
        setRetained({
            projectShortname,
            theme: project ? resolvedTheme : null,
        });
    }
    const theme =
        project || retained.projectShortname !== projectShortname
            ? resolvedTheme
            : retained.theme || resolvedTheme;

    return (
        <ThemeContext.Provider value={theme}>
            <Helmet>
                <style>{`
                    :root {
                        --primary-color: ${theme.primaryColor};
                        --secondary-color: ${theme.secondaryColor};
                        --editorial-color: ${theme.editorialColor};
                        --aspect-x: ${theme.aspectX};
                        --aspect-y: ${theme.aspectY};
                    }
                `}</style>
            </Helmet>
            {children}
        </ThemeContext.Provider>
    );
}

ThemeProvider.propTypes = {
    children: PropTypes.node,
};
