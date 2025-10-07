import React from 'react';
import 'static/style/checkbox.scss';
import PropTypes from 'prop-types';

const CheckBox = (props) => {
    const { handleActive, inputName, inputValue, id, disabled } = props
    return(
        <>
            <label className="container-chk">
                <input id = { id } type="checkbox" name = { inputName } onChange = { handleActive } defaultChecked={ inputValue } disabled={ disabled } />
                <span className="checkmark"></span>
            </label>
        </>
    )
}
CheckBox.propTypes = {
    handleActive: PropTypes.func,
    inputName: PropTypes.string,
    inputValue: PropTypes.string,
    id: PropTypes.string,
    disabled: PropTypes.bool
};
export default CheckBox;