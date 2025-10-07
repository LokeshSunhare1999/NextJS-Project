import React from 'react'
function FilterDropDown() {
    return (
        <>
            <select
                className="customer-status pointer"
                name="isToday"
            >
                <option>
                    <span className="status"></span>
                    1
                </option>
                <option>
                    2
                </option>
            </select>
        </>
    )
}

export default FilterDropDown
