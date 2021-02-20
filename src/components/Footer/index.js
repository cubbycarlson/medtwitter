import React from 'react';
import { NavLink } from 'react-router-dom';

import './footer.css';

export default function () {
    return (
        <footer className="footer">
            {/*<NavLink className="footerItem" to='/terms'>Terms and Services</NavLink>*/}
            {/*<NavLink className="footerItem" to='/contactus'>Contact Us</NavLink>*/}
            <p className="footerItem">&copy; 2021</p>
        </footer>
    )
}