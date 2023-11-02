import { useOktaAuth } from '@okta/okta-react'
import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { BookReservations } from './Components/BookReservations'
import UserCardModel from '../../models/UserCardModel'
import { UserCard } from './Components/UserCard'
import { CheckoutBooks } from './ManageLoans/CheckoutBooks'



export const ManageReserves = () => {
  const { authState } = useOktaAuth()
  const [newFeature, setNewFeature] = useState(true)
  const [checkout, setCheckout] = useState(true)

  const [search, setSearch] = useState("");
  const [flag, setFlag] = useState(false);
  const [warn, setWarn] = useState(false)
  const [userFlag, setUserFlag] = useState(false)
  const [userData, setUserData] = useState<UserCardModel>()
  const [httpError, sethttpError] = useState(null);
  const [displayCard, setDisplayCard] = useState(false)
  const [numberOfCheckedBook,setNumberOfCheckedBook] = useState(0)  
  useEffect(() => {

    if (search!="") {
      const fetchBooks = async () => {
        const url: string = `http://localhost:8080/api/admin/secure/getUserData?userEmail=${search}`;

        if (authState && authState?.isAuthenticated) {

          const options = {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authState.accessToken?.accessToken}`,
              'Content-Type': 'application/json'
            }
          };
          const response = await fetch(url, options);
          if (!response.ok) {
            throw new Error("Something went wrong");
          }
          const responseData = await response.json();
          const loadedBook: UserCardModel = {
            userEmail: responseData.userEmail,
            checkedoutBooks: responseData.checkedoutBooks,
            historyCount: responseData.historyCount,
            reservedBooks: responseData.reservedBooks
          }
          setNumberOfCheckedBook(responseData.checkedoutBooks)
          setUserData(loadedBook);

        }
        setWarn(false)
      };
      fetchBooks().catch((error: any) => {
        sethttpError(error.message);
      })
    }

  }, [userFlag,newFeature,checkout,]);

  function checkoutFunction() {
    setNewFeature(false)
    setCheckout(true)
  }
  function returnsAndLoansFunction() {
    setNewFeature(true)
    setCheckout(false)
  }

  function changeFlag() {
    setFlag(!flag);
    setUserFlag(!userFlag)

    if (search==""){
      setDisplayCard(false)
    }
  }

  if (httpError) {
    return (
      <div className='contsiner m-5'>
        <p>{httpError}</p>
      </div>
    );
  }

  if (authState?.accessToken?.claims.userType == undefined) {
    return <Redirect to='/home' />
  }
  return (
    <div className='container'>
      <div className='mt-4'>
        <div className='row mt-5'>
          {
            warn &&
            <div className='alert alert-danger' role='alert'>
              Please Enter User Email to get data.
            </div>

          }

        </div>
        <div className='row'>
          <div className='col-6'>
            <div className='row'>
              <h2>Manage Library</h2>
            </div>
            <div className='row'>
              <div className='d-flex'>

                <input className='form-control me-2' type='search'

                  placeholder='Search' aria-labelledby='Search'
                  required onChange={e => setSearch(e.target.value)}
                  value={search}
                />
                <button className='btn btn-outline-success'
                  onClick={() => changeFlag()}>
                  Search
                </button>
              </div>
            </div>
          </div>

          {displayCard && 
          <div className="col-4 offset-2">
            <UserCard userDeatils={userData}></UserCard>
          </div>}
        </div>


        <nav className='mt-3'>

          <div className='nav nav-tabs' id='nav-tab' role='tablist'>
            <button onClick={() => checkoutFunction()} className='nav-link active' id='nav-quantity-tab' data-bs-toggle="tab" data-bs-target="#nav-quantity" type='button' role='tab' aria-controls='nav-quantity' aria-selected="false">
              Manage Reservations
            </button>
            <button onClick={() => returnsAndLoansFunction()} className='nav-link ' id='nav-add-book-tab' data-bs-toggle="tab" data-bs-target="#nav-add-book" type='button' role='tab' aria-controls='nav-add-book' aria-selected="false">
              Manage Return books
            </button>

          </div>

        </nav>
        <div className='tab-content' id='nav-tabContent'>
          <div className='tab-pane fade ' id='nav-add-book' role='tabpanel' aria-labelledby='nav-add-book-tab'>
           {newFeature && <CheckoutBooks numberOfCheckedBook={numberOfCheckedBook} checkedOut={checkout} newFeature={newFeature} setNumberOfCheckedBook={setNumberOfCheckedBook} setDisplayCard={setDisplayCard} warn={warn} setWarn={setWarn} flag={flag} search={search} setSearch={setSearch} setFlag={setFlag} userFlag={userFlag} setUserFlag={setUserFlag} changeFlag={changeFlag} initialRender={false} setInitialRender={undefined} />}
          </div>

          <div className='tab-pane fade show active' id='nav-quantity' role='tabpanel' aria-labelledby='nav-quantity-tab'>
            {checkout && <BookReservations numberOfCheckedBook={numberOfCheckedBook} checkedOut={checkout} newFeature={newFeature} setNumberOfCheckedBook={setNumberOfCheckedBook} setDisplayCard={setDisplayCard} warn={warn} setWarn={setWarn} flag={flag} search={search} setSearch={setSearch} setFlag={setFlag} userFlag={userFlag} setUserFlag={setUserFlag} changeFlag={changeFlag} />}
            
          </div>
        </div>
      </div>
    </div>
  )
}
