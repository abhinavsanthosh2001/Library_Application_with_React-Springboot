import { useOktaAuth } from '@okta/okta-react';
import React, { useEffect, useState } from 'react'
import CheckoutResponse from '../../../models/CheckoutResponse';
import BookCheckout from '../../../models/BookCheckout';
import { CheckoutBook } from './CheckoutBook';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';



export const CheckoutBooks:React.FC<{numberOfCheckedBook: number, checkedOut:any,newFeature:any,setNumberOfCheckedBook:any, setDisplayCard: any, search: string, setSearch: any, flag: boolean, setFlag: any, userFlag: boolean, setUserFlag: any, changeFlag: any, warn: boolean, setWarn: any }>= (props) =>{
    const { authState } = useOktaAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [books, setBooks] = useState<BookCheckout[]>([]);
    const [httpError, sethttpError] = useState(null);
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(-1);
    const [render, setRender] = useState(false)

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
        console.log("commng here too..")
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
        


    },[render,props.newFeature,props.checkedOut] );
    if (isLoading) {
        return (
            <SpinnerLoading></SpinnerLoading>
        );
    }
    if (httpError) {
        return (
            <div className='contsiner m-5'>
                <p>{httpError}</p>
            </div>
        );
    }
  return (
    
    <>
    <div className='mt-3'>
                    <h5>Number of CheckedBooks: ({totalAmountOfBooks})</h5>
                </div>

    {books.map(book => (
                        <CheckoutBook book={book} key={book.bookId} returnBook={returnBook} renew={renew}/>
                    ))}
    </>
  )
}
