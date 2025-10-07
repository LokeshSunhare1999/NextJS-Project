import React, { useEffect } from 'react';
import  uepLogo  from 'static/images/UepLogo.png'

function Header() {
    useEffect(() => {
        var header = document.getElementById('myHeader');
        var sticky = header.offsetTop;
        if (window.pageYOffset > sticky) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });
    return (
        <div className="header" id="myHeader">
            <img src ={ uepLogo } alt='logo' className='header-logo'/>
            <div className='sub-header'>
            </div>
        </div>
    )
}

export default Header
