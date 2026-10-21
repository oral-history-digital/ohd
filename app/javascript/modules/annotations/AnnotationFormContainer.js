import { useCallback } from 'react';

import { submitData } from 'modules/data';
import { usePathBase } from 'modules/routes';
import { useDispatch } from 'react-redux';

import AnnotationForm from './AnnotationForm';

/**
 * Supplies route context and a stable Redux save action to the existing annotation editor.
 * @param {Object} props - Annotation, segment, content locale, and form callbacks.
 * @returns {React.ReactElement} Annotation editor without a legacy project dependency.
 */
export default function AnnotationFormContainer(props) {
    const pathBase = usePathBase();
    const dispatch = useDispatch();
    const save = useCallback(
        (...args) => dispatch(submitData(...args)),
        [dispatch]
    );
    return <AnnotationForm {...props} pathBase={pathBase} submitData={save} />;
}
