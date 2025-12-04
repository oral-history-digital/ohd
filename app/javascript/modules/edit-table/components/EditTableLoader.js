import { Suspense, lazy } from 'react';

import { Spinner } from 'modules/spinners';

const OtherComponent = lazy(() => import('./EditTableContainer'));

export default function EditTableLoader() {
    return (
        <div>
            <Suspense fallback={<Spinner />}>
                <OtherComponent />
            </Suspense>
        </div>
    );
}
