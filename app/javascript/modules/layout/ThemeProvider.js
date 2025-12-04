import { createContext, useContext, useMemo } from 'react';

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

export default function ThemeProvider({ children }) {
    const { project } = useProject();

    const primaryColor = project?.primary_color || DEFAULT_PRIMARY_COLOR;
    const secondaryColor = project?.secondary_color || DEFAULT_SECONDARY_COLOR;
    const editorialColor = project?.editorial_color || DEFAULT_EDITORIAL_COLOR;
    const aspectX = project?.aspect_x || DEFAULT_ASPECT_X;
    const aspectY = project?.aspect_y || DEFAULT_ASPECT_Y;

    const theme = useMemo(
        () => ({
            primaryColor,
            secondaryColor,
            editorialColor,
            aspectX,
            aspectY,
        }),
        [primaryColor, secondaryColor, editorialColor, aspectX, aspectY]
    );

    return (
        <ThemeContext.Provider value={theme}>
            <Helmet>
                <style>{`
                    :root {
                        --primary-color: ${primaryColor};
                        --secondary-color: ${secondaryColor};
                        --editorial-color: ${editorialColor};
                        --aspect-x: ${aspectX};
                        --aspect-y: ${aspectY};
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
