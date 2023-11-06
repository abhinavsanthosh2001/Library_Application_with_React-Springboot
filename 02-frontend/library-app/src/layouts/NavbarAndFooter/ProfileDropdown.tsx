import React from 'react'
import './../../App.css';
import { Link } from 'react-router-dom';

export const ProfileDropdown: React.FC<{handleLogout: any, email: string, userType: string}> = (props) => {
    return (
            
                <div className='action '>
                    <div className='menu'>
                        <h3>{props.email}</h3>
                        
                        <h3><span>{props.userType}</span></h3>
                        <ul>
                            <li>
                                <img src={require('./../../Images/Icons/log-out.png')} />
                                <a onClick={props.handleLogout}>Logout</a>
                            </li>
                            <li>
                                <img src={require('./../../Images/Icons/question.png')} />
                                <Link to='/messages'>Help</Link>

                            </li>
                        </ul>
                    </div>
                </div>
            
        
    )
}
