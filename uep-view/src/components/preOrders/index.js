import React from 'react'
import PropTypes from 'prop-types';
import AuthLayoutContainer from 'shared/AuthLayoutContainer'
// import EventFolderList from 'components/files/EventFolderList';
import PreOrderFolderList from 'components/files/PreOrderFolderList';
import { useEffect } from 'react';
import { useState } from 'react';
// import { useRef } from 'react';

function PreOrder(props) {
    const { history } = props
    const [ scrollDiv, setScrollDiv ]= useState(null)
    let divID;
    useEffect(() => {
        divID = document.getElementById('fileScroll');
        setScrollDiv(divID)
    },);

    return (
        <AuthLayoutContainer history={ history }>
            <div className='file-page-wrapper pre-order-page' id='fileScroll'>
                <div className='page-wrapper event-page'>
                    {/* <EventFolderList /> */}
                    <PreOrderFolderList
                        fileScroll = { scrollDiv }
                    />
                </div>
            </div>
        </AuthLayoutContainer>
    )
}
PreOrder.propTypes = {
    history: PropTypes.object,
};

export default PreOrder
