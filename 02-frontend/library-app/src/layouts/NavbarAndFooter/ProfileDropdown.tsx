import React from 'react'
import './../../App.css';

export const ProfileDropdown = () => {
    return (
            
                <div className='action'>
                    <div className='menu'>
                        <h3>testuser@gamil.com</h3>
                        
                        <h3><span>Student</span></h3>
                        <ul>
                            <li>
                                <img src={require('./../../Images/Icons/log-out.png')} />
                                <a href="#">Logout</a>
                            </li>
                            <li>
                                <img src={require('./../../Images/Icons/question.png')} />
                                <a href="#">Help</a>
                            </li>
                        </ul>
                    </div>
                </div>
            
        
    )
}
