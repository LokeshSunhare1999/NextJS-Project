/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
const unAuthorizedRoutes = [ '/', '/signup' ]

const AuthRoutes = ({
    component,
    path
}) => {
    const isAuthenticated = useSelector(state => state.isAuthenticated)
    if (!isAuthenticated) {
        if (!unAuthorizedRoutes.includes(path)) {
            return <Redirect to='/' />
        } else {
            return <Route exact path={ path } component={ component } />
        }
    }
    if (isAuthenticated) {
        if (unAuthorizedRoutes.includes(path)) {
            return <Redirect to='/not-found' />
        }
        else {
            return <Route exact path={ path } component={ component } />
        }
    }

}

export default AuthRoutes