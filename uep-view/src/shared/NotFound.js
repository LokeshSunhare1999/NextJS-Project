import React from 'react';

const handleBack = () => {
    window.location = '/'
    sessionStorage.removeItem('accessToken');
}

const NotFound = () => (
    <div id="notfound-page">
        <div className="notfound-page">
            <h1 className="label-404">404</h1>
            <div className="page-label">Oops! Something is wrong.</div>
            <button className="btn btn-404" onClick={ handleBack }>Go back</button>
        </div>
    </div>
);
export default NotFound;