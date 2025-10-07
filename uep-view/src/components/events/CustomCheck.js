import React from 'react';
import 'static/style/checkbox.scss';

const CheckBox = () => {
    return (
        <>
            <label className="container d-flex align-items-center">
                <span className="label mt-1">
                    Active</span>
                <input type="checkbox"className="pink-checkbox" />
                <span className="checkmark"></span>
            </label>
            <label className="container d-flex align-items-center">
                <span className="label mt-1">Inactive</span>
                <input type="checkbox" className="pink-checkbox" />
                <span className="checkmark"></span>
            </label>
        </>
    );
};

export default CheckBox;
