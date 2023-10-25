import { useOktaAuth } from "@okta/okta-react";
import { useState, useEffect } from "react";
import BookModel from "../../../models/BookModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { BookReservation } from "./BookReservation";
import CheckoutResponse from "../../../models/CheckoutResponse";


export const BookReservations = () => {
    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [httpError, sethttpError] = useState(null);
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(-1);
    const [search, setSearch] = useState("");
    const { authState } = useOktaAuth();
    const [flag, setFlag] = useState(false);
    const [initialRender, setInitialRender] = useState(true)

    function changeFlag() {
        setFlag(!flag);
    }

    function method() {
        if (totalAmountOfBooks == -1) {

            return (<div className="m-5">
                <h3>
                    To find reservations, search with email Id
                </h3>
            </div>)
        }
        else {
            if (totalAmountOfBooks > 0) {

                return (<>
                    <div className='mt-3'>
                        <h5>Number of results: ({totalAmountOfBooks})</h5>
                    </div>
                    {books.map(book => (

                        <BookReservation book={book} key={book.id} checkout={checkout} deleteReserve={deleteReserve} />
                    ))}
                </>)
            }
            else {
                return (<div className="m-5">
                    <h3>
                        No reservations found are linked with this email.
                    </h3>
                </div>)
            }
        }

    }
    useEffect(() => {
        if (initialRender) {
            setInitialRender(false)
        }
        else {

            const fetchBooks = async () => {
                setIsLoading(true)
                const url: string = `http://localhost:8080/api/admin/secure/getReserves?userEmail=${search}`;

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
                            email: responseData[key].userEmail,
                            reservationDate: responseData[key].reservationDate
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
        }

    }, [flag]);

    async function checkout(bookId: number) {
        setIsLoading(true)
        if (authState && authState?.isAuthenticated) {
            const url = `http://localhost:8080/api/admin/secure/checkout?userEmail=${search}&bookId=${bookId}`
            const options = {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                }
            };

            const postMessage = await fetch(url, options);

            if (!postMessage.ok) {
                throw new Error("Something went wrong");
            }
            setFlag(!flag);
        }
        setIsLoading(false)
    }

    async function deleteReserve(bookId: number) {
        setIsLoading(true)
        if (authState && authState?.isAuthenticated) {
            const url = `http://localhost:8080/api/admin/secure/deleteReserve?userEmail=${search}&bookId=${bookId}`
            const options = {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                }
            };

            const postMessage = await fetch(url, options);

            if (!postMessage.ok) {
                throw new Error("Something went wrong");
            }
            setFlag(!flag);
        }
        setIsLoading(false)
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
                    <div className='d-flex'>
                        <input className='form-control me-2' required type='search'
                            placeholder='Search' aria-labelledby='Search'
                            onChange={e => setSearch(e.target.value)}
                        />
                        <button className='btn btn-outline-success'
                            onClick={() => changeFlag()}>
                            Search
                        </button>
                    </div>
                </div>
            </div>
            {method()}

        </>
    )
}
