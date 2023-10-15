import { useOktaAuth } from '@okta/okta-react'
import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { AdminMessages } from './components/AdminMessages'
import { AddNewBook } from './components/AddNewBook'
import { ChangeQuantity } from './components/ChangeQuantity'

export const ManageLibraryPage = () => {
    const {authState} = useOktaAuth()
    const [changeBooks, setChangeBooks] = useState(false)
    const [messageClick, setMessagesClick] = useState(false)
    function addBookClickFunction(){
        setChangeBooks(false)
        setMessagesClick(false)
    }
    function changeBooksClickFunction(){
        setChangeBooks(true)
        setMessagesClick(false)
    }
    function messagesClickFunction(){
        setChangeBooks(false)
        setMessagesClick(true)
    }
    if(authState?.accessToken?.claims.userType == undefined){
        return <Redirect to='/home'/>
    }
  return (
    <div className='container'>
    <div className='mt-4 mb-2'>
        <h2>Manage Library</h2>
        <nav className='mt-3'>
            
            <div className='nav nav-tabs' id='nav-tab' role='tablist'>
                <button onClick={()=>addBookClickFunction()} className='nav-link active' id='nav-add-book-tab' data-bs-toggle="tab" data-bs-target="#nav-add-book" type='button' role='tab' aria-controls='nav-add-book' aria-selected="false">
                    Add Book
                </button>
                <button onClick={()=>changeBooksClickFunction()}  className='nav-link' id='nav-quantity-tab' data-bs-toggle="tab" data-bs-target="#nav-quantity" type='button' role='tab' aria-controls='nav-quantity' aria-selected="false">
                    Change Quantity
                </button>
                <button onClick={()=>messagesClickFunction()} className='nav-link' id='nav-messages-tab' data-bs-toggle="tab" data-bs-target="#nav-messages" type='button' role='tab' aria-controls='nav-messages' aria-selected="true">
                    Respond to messages
                </button>
                

            </div>

        </nav>
        <div className='tab-content' id='nav-tabContent'>
            <div className='tab-pane fade show active' id='nav-add-book' role='tabpanel' aria-labelledby='nav-add-book-tab'>
                <AddNewBook></AddNewBook>
            </div>
            <div className='tab-pane fade' id='nav-quantity' role='tabpanel' aria-labelledby='nav-quantity-tab'>
            {changeBooks&&<ChangeQuantity/>}
            

            </div>
            <div className='tab-pane fade' id='nav-messages' role='tabpanel'aria-labelledby='nav-messages-tab'>
            {messageClick&&<AdminMessages/>}

            </div>

        </div>

    </div>


</div>
    )
}
