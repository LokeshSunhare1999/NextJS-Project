import React from 'react';
import { Switch } from 'antd';
import PropTypes from 'prop-types';

const ToggleButton = (props) => {
    const { checked, onChange, labelOn, labelOff, disabled, className } = props
    return (
        <div style={ { display: 'flex', alignItems: 'center' } }>
            <span className="text-nowrap" style= { { marginRight: '8px', marginLeft: '8px' } }>{checked ? labelOn : labelOff}</span>
            <Switch
                checked={ checked }
                onChange={ onChange }
                disabled={ disabled }
                className={ className }
            />
        </div>
    );
};

ToggleButton.propTypes = {
    checked: PropTypes.func,
    onChange: PropTypes.func,
    labelOn: PropTypes.func,
    labelOff: PropTypes.func,
    disabled: PropTypes.bool,
    className: PropTypes.any
}

export default ToggleButton;
