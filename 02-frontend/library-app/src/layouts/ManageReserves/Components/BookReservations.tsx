import { useOktaAuth } from "@okta/okta-react";
import { useState, useEffect } from "react";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { BookReservation } from "./BookReservation";
import CheckoutResponse from "../../../models/CheckoutResponse";
import { UserCard } from "./UserCard";
import UserCardModel from "../../../models/UserCardModel";
import { numbers } from "@material/tooltip";


export const BookReservations = () => {
    const { authState } = useOktaAuth();
    const [books, setBooks] = useState<CheckoutResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [httpError, sethttpError] = useState(null);
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(-1);
    const [search, setSearch] = useState("");
    const [flag, setFlag] = useState(false);
    const [initialRender, setInitialRender] = useState(true)
    const [warn, setWarn] = useState(false)
    const [checkoutBooks, setCheckoutBooks] = useState<number[]>([])
    const [checkedSelectAll, setCheckedSelectAll] = useState(false)
    const [warnBooks, setWarnBooks] = useState(false)
    const [success, setSuccess] = useState(false)
    const [userData, setUserData] = useState<UserCardModel>()
    const [userFlag, setUserFlag] = useState(false)
    const [numberOfCheckedBook,setNumberOfCheckedBook] = useState(0)
    const [totalCount,setTotalCount] = useState(0)
  
    


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
            setTotalCount(numberOfCheckedBook+c.length)
        } else {
            setCheckoutBooks([])
            setTotalCount(numberOfCheckedBook)
        }
    }
    function addBookToCheckout(book: CheckoutResponse, checked: boolean) {

        setCheckedSelectAll(false)
        if (checked) {
            let c = checkoutBooks
            c.push(book.bookId!)
            setCheckoutBooks(c)
            setTotalCount(checkoutBooks.length + numberOfCheckedBook)
        } else {
            let c = checkoutBooks
            c.splice(c.indexOf(book.bookId!), 1)
            setCheckoutBooks(c)
            setTotalCount(checkoutBooks.length + numberOfCheckedBook)
            
        }

    }
    function changeFlag() {
        setFlag(!flag);
        setUserFlag(!userFlag)
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
                        <BookReservation handleCheck={handleCheck} addBookToCheckout={addBookToCheckout} book={book} key={book.bookId} numberOfCheckedBooks={numberOfCheckedBook} checkout={checkout} deleteReserve={deleteReserve} />
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
                      {totalCount <=5 ?   
                      <button  className='btn btn-success'
                            onClick={() => checkoutAll(checkoutBooks)}
                        >
                            Checkout book(s)
                        </button>:
                        <button  className='btn btn-success'
                            onClick={() => checkoutAll(checkoutBooks) } disabled
                        >
                            Checkout book(s)
                        </button>
                        }

                    </div>
                </div>
               
            </>)
        }
        else if(totalAmountOfBooks==0) {
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
        if (initialRender) {
            setInitialRender(false)
        }
        else {
            if (search != "") {
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
                    setWarn(false)
                };
                fetchBooks().catch((error: any) => {
                    setIsLoading(false);
                    sethttpError(error.message);
                })
            }
            else {
                setWarn(true)
                setTotalAmountOfBooks(-1)
            }
        }

    }, [flag]);

    async function checkout(bookId: number) {

        
        setIsLoading(true)
        setSuccess(false)
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
            setSuccess(true)
            setWarnBooks(false)
            setUserFlag(!userFlag)
            
            
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
                const url = `http://localhost:8080/api/admin/secure/checkout/bulk?userEmail=${search}`
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
                setUserFlag(!userFlag)
                setFlag(!flag);
                setCheckoutBooks([])
            }

        }
        setIsLoading(false)
    }

    async function deleteReserve(bookId: number) {
        setIsLoading(true)
        setSuccess(false)

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
            setSuccess(true)
            setUserFlag(!userFlag)
            setWarnBooks(false)
        }
        setIsLoading(false)
    }

    useEffect(() => {

        if (search != "") {
            const fetchBooks = async () => {
                setIsLoading(true)
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
                setIsLoading(false);
                setWarn(false)
            };
            fetchBooks().catch((error: any) => {
                setIsLoading(false);
                sethttpError(error.message);
            })
        }

    }, [userFlag]);

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
                {
                    warn &&
                    <div className='alert alert-danger' role='alert'>
                        All fields must be filled out
                    </div>

                }
                <div className='col-6'>

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
                    {method2()}
                </div>
                {userData && <div className="col-4 offset-2">
                    <UserCard userDeatils={userData}></UserCard>
                </div>}

            </div>

            {method()}



        </>
    )
}
