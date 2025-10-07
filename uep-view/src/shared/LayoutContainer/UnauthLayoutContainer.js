import React from 'react'
import PropTypes from 'prop-types';
import Header from './Header'
import { useSelector } from 'react-redux';
import Loader from 'shared/Loader';

const UnauthLayoutContainer = ({
    pageTitle,
    formTitle,
    children
}) => {
    const isLoading = useSelector((state) => state.applicationIsLoading);
    return (
        <>
            <div className="admin-dashboard splash-container d-flex justify-content-center">
                <Header />
                <div className='d-flex flex-column'>
                    { isLoading && <div className="loginLoader"><Loader /></div> }
                    <div className="login_card">
                        <h3 className="title">{pageTitle}</h3>
                        <div className="login_card_header text-center border-0"><span className="splash_description">{formTitle}</span></div>
                        <div className="login_card_body d-flex justify-content-center">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
UnauthLayoutContainer.propTypes = {
    children: PropTypes.object,
    pageTitle: PropTypes.string,
    formTitle: PropTypes.string,
};
export default UnauthLayoutContainer
