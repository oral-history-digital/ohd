import { useSelector } from 'react-redux';

import { LayoutContainer, useScrollBelowThreshold } from 'modules/layout';
import { MemoizedRoutes } from './Routes';

function RouteDivider() {
    const isScrollBelowThreshold = useScrollBelowThreshold();

    return (
        <LayoutContainer scrollPositionBelowThreshold={isScrollBelowThreshold}>
            <MemoizedRoutes/>
        </LayoutContainer>
    );
}

export default RouteDivider;
