import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'

import "./header.css";

export default function ({ token, user, setUser, setToken, logout }) {
    let [menuOpen, setMenuOpen] = useState(false);

    function logoutButton(e) {
        // e.preventDefault();
        logout();
    }

    function menuToggle(e) {
        // e.preventDefault();
        setMenuOpen(!menuOpen);
    }

    function closeMenu (e) {
        // e.preventDefault();
        setMenuOpen(false);
    }

    function activate(className = 'item') {
        return menuOpen ? className + " active" : className
    }

    const node = useRef(null)

    const outsideClick = e => {
        if (!node.current.contains(e.target)) closeMenu(e);
        return;
    };

    useEffect(() => {
        document.addEventListener("mousedown", outsideClick);
        return () => {
            document.removeEventListener("mousedown", outsideClick);
        };
    }, []);

    return (
        <div ref={node}>
            <nav>
                <ul className="menu">
                    <li className="logo" onClick={closeMenu}><NavLink to='/'>Med Twitter</NavLink></li>
                    <li className={activate()} onClick={closeMenu}><NavLink to='/about'>About</NavLink></li>
                    {token === undefined
                        ? <>
                            <li className={activate('item button')} onClick={closeMenu}><NavLink to='/login'>Log In</NavLink></li>
                            {/*<li className={activate('item button secondary')} onClick={closeMenu}><NavLink to='/signup'>Sign Up</NavLink></li>*/}
                          </>
                        : <li className={activate('item button secondary')} onClick={closeMenu}><NavLink onClick={logoutButton} to='/'>Logout</NavLink></li>
                    }
                    {!menuOpen
                        ? <li className={activate('toggle')} onClick={menuToggle}><NavLink to="#"><FontAwesomeIcon icon={faBars}/></NavLink></li>
                        : <li className={activate('toggle')} onClick={menuToggle}><NavLink to="#"><FontAwesomeIcon icon={faTimes}/></NavLink></li>
                    }
                </ul>
            </nav>
        </div>
    )
}