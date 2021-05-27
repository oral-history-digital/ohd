import PropTypes from 'prop-types';
import { HexColorPicker } from 'react-colorful';

export default function ColorPicker({
    data,
    handleChange,
}) {
    return (
        <div>
            <HexColorPicker
                color={data.map_color}
                onChange={color => handleChange('map_color', color)}
            />
        </div>
    );
}

ColorPicker.propTypes = {
    data: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
};
