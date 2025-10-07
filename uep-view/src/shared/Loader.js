import React from 'react';
import 'antd/dist/antd.css';
import { Spin } from 'antd';

const Loader = () => {
    return <div className="loader">
        <Spin size="large" />
    </div>
}

export default Loader
