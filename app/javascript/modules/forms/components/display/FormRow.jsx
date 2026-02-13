import classNames from 'classnames';
import PropTypes from 'prop-types';

/**
 * FormRow component that renders a group of form elements in a flex container.
 * Used to organize and layout form elements side-by-side or in custom grid layouts
 * based on CSS classes.
 */
export default function FormRow({ group, elements, renderElement }) {
    return (
        <div className={classNames('form-row', `form-row--${group}`)}>
            {elements.map((element) => {
                if (
                    element.condition === undefined ||
                    element.condition === true
                ) {
                    return renderElement(element);
                }
            })}
        </div>
    );
}

FormRow.propTypes = {
    group: PropTypes.string.isRequired,
    elements: PropTypes.arrayOf(PropTypes.object).isRequired,
    renderElement: PropTypes.func.isRequired,
};
