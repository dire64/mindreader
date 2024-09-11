import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'
import { Button } from './Button'

function Navbar() {
  const [click, setClick] = useState(false)
  const [button, setButton] = useState(true)
  const handleClick = () => setClick(!click)
  const closeMobileMenu = () => setClick(false)

  const showButton = () => {
    if(window.innerWidth <= 960) {
      setButton(false)
    } else {
      setButton(true)
    }
  }

  useEffect(() => {
    showButton()
  }, [])

  window.addEventListener('resize', showButton)

  return (
    <>
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
                    MindReader
                </Link>
                <div className="menu-icon" onClick={handleClick}>
                    <i className={click ? 'bx bx-x' : 'bx bx-menu'} />
                </div>
                <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                    <li className='nav-item'>
                      <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                        Home
                      </Link>
                    </li>
                    <li className='nav-item'>
                      <Link to='/forum' className='nav-links' onClick={closeMobileMenu}>
                        Forum
                      </Link>
                    </li>
                    <li className='nav-item'>
                      <Link to='/book-appointment' className='nav-links' onClick={closeMobileMenu}>
                        Book Appointment
                      </Link>
                    </li>
                </ul>

                {button && <Button buttonStyle='btn--urgent'>Find Help Now</Button>}
            </div>
        </nav>
    </>
  )
}

export default Navbar