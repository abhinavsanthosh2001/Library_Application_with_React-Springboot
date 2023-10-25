import { useOktaAuth } from '@okta/okta-react'
import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { AddNewBook } from '../ManageLibraryPage/components/AddNewBook'
import { BookReservations } from './Components/BookReservations'



export const ManageReserves = () => {
  const { authState } = useOktaAuth()
  const [newFeature, setNewFeature] = useState(true)
  function addBookClickFunction() {
    setNewFeature(false)
  }
  function changeBooksClickFunction() {
    setNewFeature(true)
  }
  if (authState?.accessToken?.claims.userType == undefined) {
    return <Redirect to='/home' />
  }
  return (
    <div className='container'>
      <div className='mt-4 mb-2'>
        <h2>Manage Library</h2>
        <nav className='mt-3'>

          <div className='nav nav-tabs' id='nav-tab' role='tablist'>
            <button onClick={() => changeBooksClickFunction()} className='nav-link active' id='nav-quantity-tab' data-bs-toggle="tab" data-bs-target="#nav-quantity" type='button' role='tab' aria-controls='nav-quantity' aria-selected="false">
              Manage Reservations
            </button>
            <button onClick={() => addBookClickFunction()} className='nav-link ' id='nav-add-book-tab' data-bs-toggle="tab" data-bs-target="#nav-add-book" type='button' role='tab' aria-controls='nav-add-book' aria-selected="false">
              Add New Feature!
            </button>

          </div>

        </nav>
        <div className='tab-content' id='nav-tabContent'>
          <div className='tab-pane fade ' id='nav-add-book' role='tabpanel' aria-labelledby='nav-add-book-tab'>
            <></>
          </div>

          <div className='tab-pane fade show active' id='nav-quantity' role='tabpanel' aria-labelledby='nav-quantity-tab'>
            {newFeature && <BookReservations />}

          </div>
        </div>
      </div>
    </div>
  )
}
