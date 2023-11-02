import React, { useEffect, useState } from 'react'
import CheckoutResponse from '../../../models/CheckoutResponse';
import { BookReservation } from '../../ManageReserves/Components/BookReservation';
import { useOktaAuth } from "@okta/okta-react";
import { Reserve } from './Reserve';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';

export const Reserves = () => {
    const { authState } = useOktaAuth();
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
    const [books, setBooks] = useState<CheckoutResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [httpError, sethttpError] = useState(null);


    useEffect(() => {
        const fetchBooks = async () => {
            setIsLoading(true)
            const url: string = `http://localhost:8080/api/books/secure/getReserves`;

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

                const loadedBooks: CheckoutResponse[] = [];
                for (const key in responseData) {
                    loadedBooks.push({
                        bookId: responseData[key].bookId,
                        title: responseData[key].title,
                        author: responseData[key].author,
                        img: responseData[key].img,
                        reservationDate: responseData[key].reservationDate,
                        collectionDate: responseData[key].collectionDate
                    })
                }
                setBooks(loadedBooks);
            }
            setIsLoading(false);
        };

        fetchBooks().catch((error: any) => {
            setIsLoading(false);
            sethttpError(error.message);
        })

    }, [authState]);

    function method() {
        if (totalAmountOfBooks > 0) {
            return (<>
                {books.map(book => (
                    <Reserve book={book}  />
                ))}
            </>)
        }
    }
    function method2() {

        if (totalAmountOfBooks > 0) {

            return (<>
                <div className='mt-3'>
                    <h5>Number of reservations: ({totalAmountOfBooks})</h5>
                </div>

            </>)
        }
        else if (totalAmountOfBooks == 0) {
            return (<div className="m-5">

                <h3>
                    You have not reserved any Book
                </h3>

            </div>)

        }

    }
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
            <div className='row mt-5'>
                <div className='col-6'>
                    {method2()}
                </div>
            </div>
            {method()}
        </>
    )
}
