import PropTypes from 'prop-types';

export default function InstanceSettingsSection({
    children,
    description,
    title,
}) {
    return (
        <section className="InstanceSettingsSection">
            <h2>{title}</h2>
            {description && <p>{description}</p>}
            {children}
        </section>
    );
}

InstanceSettingsSection.propTypes = {
    children: PropTypes.node.isRequired,
    description: PropTypes.node,
    title: PropTypes.node.isRequired,
};
