import { useOktaAuth } from "@okta/okta-react";
import { useState, useEffect } from "react";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { BookReservation } from "./BookReservation";
import CheckoutResponse from "../../../models/CheckoutResponse";


export const BookReservations: React.FC<{ initialRender: boolean, setInitialRender: any, numberOfCheckedBook: number, checkedOut: any, newFeature: any, setNumberOfCheckedBook: any, setDisplayCard: any, search: string, setSearch: any, flag: boolean, setFlag: any, userFlag: boolean, setUserFlag: any, changeFlag: any, warn: boolean, setWarn: any }> = (props) => {
    const { authState } = useOktaAuth();
    const [books, setBooks] = useState<CheckoutResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [httpError, sethttpError] = useState(null);
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(-1);
    const [checkoutBooks, setCheckoutBooks] = useState<number[]>([])
    const [checkedSelectAll, setCheckedSelectAll] = useState(false)
    const [warnBooks, setWarnBooks] = useState(false)
    const [success, setSuccess] = useState(false)
    const [totalCount, setTotalCount] = useState(0)




    function handleCheck(bookId: number) {
        return checkoutBooks.includes(bookId)
    }

    function handleSelectAll(add: boolean) {
        setCheckedSelectAll(!checkedSelectAll)
        if (add) {
            let c: (number)[] = []
            books.map(book => {
                c.push(book.bookId!)
            })
            setCheckoutBooks(c)
            setTotalCount(props.numberOfCheckedBook + c.length)
        } else {
            setCheckoutBooks([])
            setTotalCount(props.numberOfCheckedBook)
        }
    }
    function addBookToCheckout(book: CheckoutResponse, checked: boolean) {

        setCheckedSelectAll(false)
        if (checked) {
            let c = checkoutBooks
            c.push(book.bookId!)
            setCheckoutBooks(c)
            setTotalCount(checkoutBooks.length + props.numberOfCheckedBook)
        } else {
            let c = checkoutBooks
            c.splice(c.indexOf(book.bookId!), 1)
            setCheckoutBooks(c)
            setTotalCount(checkoutBooks.length + props.numberOfCheckedBook)
            
        }

    }
    function removeIfChecked(bookid: number) {        
            let checkedBooksList = checkoutBooks
            const index = checkedBooksList.indexOf(bookid)
            if (index > -1) {
                checkedBooksList.splice(index, 1)
                setCheckoutBooks(checkedBooksList)
                setTotalCount(checkoutBooks.length + props.numberOfCheckedBook)
            }
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
                    {books.map(book => (
                        <BookReservation handleCheck={handleCheck} addBookToCheckout={addBookToCheckout} book={book} key={book.bookId} numberOfCheckedBooks={props.numberOfCheckedBook} checkout={checkout} deleteReserve={deleteReserve} />
                    ))}
                </>)
            }

        }

    }
    function method2() {

        if (totalAmountOfBooks > 0) {

            return (<>
                <div className='mt-3'>
                    <h5>Number of reservations: ({totalAmountOfBooks})</h5>
                </div>
                {
                    warnBooks &&
                    <div className='alert alert-danger' role='alert'>
                        Select at least one book
                    </div>

                }
                {
                    success &&
                    <div className='alert alert-success' role='alert'>
                        Success
                    </div>
                }
                <div className="p-2 m-1 align-self-center">
                    <div className="form-check checkbox-xl">
                        select all
                        <input
                            checked={checkedSelectAll} className="form-check-input" type="checkbox" id="selectAll" onChange={(e) => handleSelectAll(e.target.checked)} />
                    </div>
                </div>
                <div className="d-flex">
                    <div className="p-2">
                        {totalCount <= 5 ?
                            <button className='btn btn-success'
                                onClick={() => checkoutAll(checkoutBooks)}
                            >
                                Checkout book(s)
                            </button> :
                            <button className='btn btn-success'
                                onClick={() => checkoutAll(checkoutBooks)} disabled
                            >
                                Checkout book(s)
                            </button>
                        }

                    </div>
                </div>

            </>)
        }
        else if (totalAmountOfBooks == 0) {
            return (<div className="m-5">
                {
                    success &&
                    <div className='alert alert-success' role='alert'>
                        Success
                    </div>
                }
                <h3>
                    No reservations found are linked with this email.
                </h3>

            </div>)

        }

    }
    useEffect(() => {
        if (props.initialRender) {
            props.setInitialRender(false)
        }
        else {
            if (props.search != "") {
                const fetchBooks = async () => {
                    setIsLoading(true)
                    const url: string = `http://localhost:8080/api/admin/secure/getReserves?userEmail=${props.search}`;

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
        
        }

    }, [props.flag,props.checkedOut,props.newFeature]);

    async function checkout(bookId: number) {
        setIsLoading(true)
        setSuccess(false)
        if (authState && authState?.isAuthenticated) {
            const url = `http://localhost:8080/api/admin/secure/checkout?userEmail=${props.search}&bookId=${bookId}`
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
            props.setFlag(!props.flag);
            props.setUserFlag(!props.userFlag)
            setSuccess(true)
            setWarnBooks(false)
            removeIfChecked(bookId)
        }
        setIsLoading(false)
    }

    async function checkoutAll(bookIds: number[]) {

        setSuccess(false)
        setIsLoading(true)
        if (bookIds.length == 0) {
            setWarnBooks(true)
        }
        else {
            setWarnBooks(false)
            if (authState && authState?.isAuthenticated) {
                const url = `http://localhost:8080/api/admin/secure/checkout/bulk?userEmail=${props.search}`
                const options = {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bookIds)
                };

                const postMessage = await fetch(url, options);

                if (!postMessage.ok) {
                    throw new Error("Something went wrong");
                }
                setSuccess(true)
                props.setFlag(!props.flag);
                props.setUserFlag(!props.userFlag)
                setCheckoutBooks([])
            }

        }
        setIsLoading(false)
    }

    async function deleteReserve(bookId: number) {
        setIsLoading(true)
        setSuccess(false)

        if (authState && authState?.isAuthenticated) {
            const url = `http://localhost:8080/api/admin/secure/deleteReserve?userEmail=${props.search}&bookId=${bookId}`
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
            props.setFlag(!props.flag);
            props.setUserFlag(!props.userFlag)
            setWarnBooks(false)
            setSuccess(true)
            removeIfChecked(bookId)
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
            <div className='container m-5'>
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
