import { useOktaAuth } from '@okta/okta-react'
import React, { useEffect, useState } from 'react'
import ShelfCurrentLoans from '../../../models/ShelfCurrentLoans'
import { SpinnerLoading } from '../../Utils/SpinnerLoading'
import { Link } from 'react-router-dom'
import { LoansModal } from './LoansModal'
import History from '../../../models/History'
import { HistoryCard } from './HistoryCard'
import { Pagination } from '../../Utils/Pagination'

export const AggregateHistory = () => {
    const { authState } = useOktaAuth()
    const [httpError, setHttpError] = useState(null)

    const [history, setHistory] = useState<History[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchUserCurrentLoans = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:8080/api/histories/search/findBooksByUserEmail/?userEmail=${authState.accessToken?.claims.sub}&page=${currentPage - 1}&size=5`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const historyResponse = await fetch(url, requestOptions);
                if (!historyResponse.ok) {
                    throw new Error("Something Went Wrong!!")
                }
                const responseJson = await historyResponse.json();
                const responseData = responseJson._embedded.histories;
                setHistory(responseData)
                setTotalPages(responseJson.page.totalPages);

            }
            setIsLoadingHistory(false)

        }
        fetchUserCurrentLoans().catch((error: any) => {
            setIsLoadingHistory(false)
            setHttpError(error.message)
        })
        window.scroll(0, 0)


    }, [authState, currentPage,])
    if (isLoadingHistory) {
        return (
            <SpinnerLoading />
        )
    }
    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        )
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div>
            {/* Desktop */}
            <div className='mt-2'>
                {history.length > 0 ?
                    <>
                        <h5>User Book History: </h5>


                        {history.map(history => (

                            <div key={history.id}>
                                <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
                                    <div className='row g-0'>

                                        <div className='col-md-2'>
                                            <div className='d-none d-lg-block'>
                                                {history.img ?
                                                    <img src={history.img} width='123' height='196' alt='Book' />
                                                    :
                                                    <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
                                                        width='123' height='196' alt='Default' />
                                                }
                                            </div>
                                            <div className='d-lg-none d-flex justify-content-center align-items-center'>
                                                {history.img ?
                                                    <img src={history.img} width='123' height='196' alt='Book' />
                                                    :
                                                    <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
                                                        width='123' height='196' alt='Default' />
                                                }
                                            </div>
                                        </div>
                                        <div className='col'>
                                            <div className='card-body'>
                                                <h5 className='card-title'> {history.author} </h5>
                                                <h4>{history.title}</h4>
                                                <p className='card-text'>{history.description}</p>
                                                <hr />
                                                <p className='card-text'> Checked out on: {history.checkoutDate}</p>
                                                <p className='card-text'> Returned on: {history.returnedDate}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                            </div>
                        ))}
                    </> :
                    <>
                        <h3 className='mt-3'>
                            Seems Like you are a new user!
                        </h3>
                        <Link className='btn btn-primary' to={`search`}>
                            Search for a new book
                        </Link>
                    </>
                }
            </div>
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}

            {/* Mobile */}

        </div>

    );
}
