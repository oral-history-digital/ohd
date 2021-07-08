import PropTypes from 'prop-types';

export default function MapPopupContent({
    name,
    registryEntryId,
    onUpdate = f => f,
}) {
    return (
        <div className="MapPopup">
            <h3 className="MapPopup-heading">{name}</h3>
        </div>
    );
}

MapPopupContent.propTypes = {
    registryEntryId: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    onUpdate: PropTypes.func,
};
