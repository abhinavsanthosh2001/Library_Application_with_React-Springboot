import { useOktaAuth } from '@okta/okta-react';
import React, { useEffect, useState } from 'react'
import CheckoutResponse from '../../../models/CheckoutResponse';
import BookCheckout from '../../../models/BookCheckout';
import { CheckoutBook } from './CheckoutBook';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';
import 'react-toastify/dist/ReactToastify.css'; // import first
import { ToastContainer, toast } from 'react-toastify';
import Toasts from '../Toasts';





export const CheckoutBooks:React.FC<{initialRender:boolean, setInitialRender:any, numberOfCheckedBook: number, checkedOut:any,newFeature:any,setNumberOfCheckedBook:any, setDisplayCard: any, search: string, setSearch: any, flag: boolean, setFlag: any, userFlag: boolean, setUserFlag: any, changeFlag: any, warn: boolean, setWarn: any }>= (props) =>{
    const { authState } = useOktaAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [books, setBooks] = useState<BookCheckout[]>([]);
    const [httpError, sethttpError] = useState(null);
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(-1);
    const [render, setRender] = useState(false)
    const [firstRender,setFirstRender] = useState(true);
    const [isMorethanOneBook,setIsMorethanOneBook] = useState(false);
    
    
    function notify1(){
        console.log("commng here too.. for toast")
        toast.success('Renewed Succesfully.');

    }
    async function returnBook(bookId: number) {

        const url = `http://localhost:8080/api/admin/secure/return/?bookId=${bookId}&userEmail=${props.search}`;
                const requestOptions = {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const response = await fetch(url, requestOptions);
                if (!response.ok) {
                    throw new Error("Something Went Wrong!!")
                }
                setRender(!render)
                props.setUserFlag(!props.userFlag) 
    }

    async function renew(bookId: number) {
        console.log("commng here too renew")
        const url = `http://localhost:8080/api/admin/secure/renew/loan/?bookId=${bookId}&userEmail=${props.search}`;
                const requestOptions = {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const response = await fetch(url, requestOptions);
                if (!response.ok) {
                    throw new Error("Something Went Wrong!!")
                }
               

                props.setUserFlag(!props.userFlag) 
                setRender(!render)  
    }
    useEffect(() => {
        if (props.initialRender) {
            props.setInitialRender(false)
        }
        else{
            if (props.search != "") {
                const fetchBooks = async () => {
                    setIsLoading(true)
                    const url: string = `http://localhost:8080/api/admin/secure/getCheckouts?userEmail=${props.search}`;

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

                        setTotalAmountOfBooks(Object.keys(responseData).length)

                        const loadedBooks: BookCheckout[] = [];
                        for (const key in responseData) {
                            loadedBooks.push({
                                bookId: responseData[key].bookId,
                                title: responseData[key].title,
                                author: responseData[key].author,
                                img: responseData[key].img,
                                email: responseData[key].userEmail,
                                checkOutDate: responseData[key].reservationDate,
                                returnDate:responseData[key].returnDate,
                            })
                        }
                        if (loadedBooks.length > 0) {
                            setIsMorethanOneBook(true)
                            props.setDisplayCard(true)
                        }else{
                            props.setDisplayCard(false)

                        }
                        setBooks(loadedBooks);
                    }

                    setIsLoading(false);
                    props.setWarn(false)
                };

                fetchBooks().catch((error: any) => {
                    setIsLoading(false);
                    sethttpError(error.message);
                })
            }
            else {
                props.setWarn(true)
                setTotalAmountOfBooks(-1)
            }
        
        }

    },[render,props.newFeature,props.checkedOut,props.flag] );
    if (isLoading) {
        return (
            <SpinnerLoading></SpinnerLoading>
        );
    }
    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        );
    }
  return (
    <>
    <div className='mt-3'>
                 {isMorethanOneBook ? <h5>Number of CheckedBooks: ({totalAmountOfBooks})</h5>:
                 <div className='m-5'><h3>No Books found are linked with this email.</h3></div>}
                </div>

    {books.map(book => (
        
                        <CheckoutBook notify={notify1}  book={book} key={book.bookId} returnBook={returnBook} renew={renew}/>
                    ))}
                    <ToastContainer />
    </>
  )
}
