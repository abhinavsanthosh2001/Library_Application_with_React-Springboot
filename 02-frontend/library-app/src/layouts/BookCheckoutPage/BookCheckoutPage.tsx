import React, { useEffect, useState } from 'react'
import BookModel from '../../models/BookModel';
import { SpinnerLoading } from '../Utils/SpinnerLoading';
import { StarReview } from '../Utils/StarReview';

import ReviewModel from '../../models/ReviewModel';
import { LatestReviews } from './LatestReviews';
import { useOktaAuth } from '@okta/okta-react';
import CheckoutAndReviewBox from './CheckoutAndReviewBox';
import ReviewRequestModel from '../../models/ReviewRequestModel';

const BookCheckoutPage = () => {
    const { authState } = useOktaAuth();
    const [book, setBook] = useState<BookModel>();
    const [isLoadingBook, setIsLoadingBook] = useState(true);
    const [httpError, sethttpError] = useState(null);
    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadindReview] = useState(true);
    const bookId = (window.location.pathname).split('/')[2];
    const [currentLoansCount, setCurrentLoansCount] = useState(0);
    const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] = useState(true);
    const [isCheckedOut, setIsCheckedOut] = useState(false)
    const [isLoadingCheckedOut, setIsLoadingCheckedOut] = useState(true)
    const [isReviewLeft, setIsReviewLeft] = useState(false);
    const [isLoadingUserReview, setIsloadingUserReview] = useState(true)

    const [isBooked, setIsBooked] = useState(false);
    const [isLoadingBooked, setIsLoadingBooked] = useState(true)
    const [collectionDate, setCollectionDate] = useState("")
    const [isLoadingCollectionDate, setIsLoadingCollectionDate] = useState(true)
    useEffect(() => {
        const fetchUserReviewBook = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:8080/api/reviews/secure/user/book?bookId=${bookId}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const userReview = await fetch(url, requestOptions);
                if (!userReview.ok) {
                    throw new Error('Something went wrong');
                }
                const userReviewResponseJson = await userReview.json();
                setIsReviewLeft(userReviewResponseJson);
            }
            setIsloadingUserReview(false);
        }
        fetchUserReviewBook().catch((error: any) => {
            setIsloadingUserReview(false);
            sethttpError(error.message);
        })
    }, [authState]);
    useEffect(() => {
        const fetchUserCheckedOut = async ()=>{
            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:8080/api/books/secure/ischeckedout/byuser?bookId=${bookId}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        "Content-Type": 'application/json'
                    }
                };
                const bookCheckedOut = await fetch(url, requestOptions);
                if (!bookCheckedOut.ok) {
                    throw new Error('Something went wrong!!!')
                }
                const currentLoansCountJson = await bookCheckedOut.json();
                setIsCheckedOut(currentLoansCountJson);

            }
            setIsLoadingCheckedOut(false)
        }
        fetchUserCheckedOut().catch((error:any)=> {
            setIsLoadingCheckedOut(false)
            sethttpError(error.message)
        })
    },[authState])


    useEffect(() => {
        const fetchIsBooked = async ()=>{
            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:8080/api/books/secure/isBooked/byUser?bookId=${bookId}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        "Content-Type": 'application/json'
                    }
                };
                const booked = await fetch(url, requestOptions);
                if (!booked.ok) {
                    throw new Error('Something went wrong!!!')
                }
                const bookedJson = await booked.json();
                setIsBooked(bookedJson);

            }
            setIsLoadingBooked(false)
        }
        fetchIsBooked().catch((error:any)=> {
            setIsLoadingBooked(false)
            sethttpError(error.message)
        })
    },[authState])
    useEffect(() => {
        const fetchCollectionDate = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:8080/api/books/secure/collectionDate?bookId=${bookId}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        "Content-Type": 'application/json'
                    }
                };
                const collectionDateResponse = await fetch(url, requestOptions);
                if (!collectionDateResponse.ok) {
                    throw new Error('Something went wrong!!!')
                }
                const collectionDateJson = await collectionDateResponse.json();
                console.log(collectionDateJson)
                setCollectionDate(collectionDateJson.collectionDate);

            }
            setIsLoadingCollectionDate(false)

        }
        fetchCollectionDate().catch((error: any) => {
            setIsLoadingCollectionDate(false);
            sethttpError(error.message);
        })


    }, [authState, isBooked])

    useEffect(() => {
        const fetUserCurrentLoansCount = async () => {
            if (authState && authState.isAuthenticated) {
                const url = "http://localhost:8080/api/books/secure/currentloans/count";
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        "Content-Type": 'application/json'
                    }
                };
                const currentLoansCountResponse = await fetch(url, requestOptions);
                if (!currentLoansCountResponse.ok) {
                    throw new Error('Something went wrong!!!')
                }
                const currentLoansCountJson = await currentLoansCountResponse.json();
                setCurrentLoansCount(currentLoansCountJson);

            }
            setIsLoadingCurrentLoansCount(false)

        }
        fetUserCurrentLoansCount().catch((error: any) => {
            setIsLoadingCurrentLoansCount(false);
            sethttpError(error.message);
        })


    }, [authState, isCheckedOut])

    useEffect(() => {
        const fetchBook = async () => {
            const baseUrl: string = `http://localhost:8080/api/books/${bookId}`;
            const response = await fetch(baseUrl);
            if (!response.ok) {
                throw new Error("Something went wrong");
            }
            const responseData = await response.json();
            const loadedBook: BookModel = {

                id: responseData.id,
                title: responseData.title,
                author: responseData.author,
                description: responseData.description,
                copies: responseData.copies,
                copiesAvailable: responseData.copiesAvailable,
                category: responseData.category,
                img: responseData.img,
            }
            setBook(loadedBook);
            setIsLoadingBook(false);
        };

        fetchBook().catch((error: any) => {
            setIsLoadingBook(false);
            sethttpError(error.message);
        })
    }, [isCheckedOut]);
    useEffect(() => {
        const fetchBookReviews = async () => {
            const reviewUrl: string = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}`;
            const responseReview = await fetch(reviewUrl);
            if (!responseReview.ok) {
                throw new Error("Something went wrong");
            }
            const responseJson = await responseReview.json();
            const responseData = responseJson._embedded.reviews;
            const loadedReviews: ReviewModel[] = [];
            let weightedStarReviews: number = 0;
            for (const key in responseData) {
                loadedReviews.push({
                    id: responseData[key].id,
                    userEmail: responseData[key].userEmail,
                    date: responseData[key].date,
                    rating: responseData[key].rating,
                    book_id: responseData[key].bookId,
                    reviewDescription: responseData[key].reviewDescription
                });
                weightedStarReviews += responseData[key].rating;
            }
            if (loadedReviews) {
                const round = (Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2).toFixed(1);
                setTotalStars(Number(round));
            }
            setReviews(loadedReviews);
            setIsLoadindReview(false);
        };
        fetchBookReviews().catch((error: any) => {
            setIsLoadindReview(false);
            sethttpError(error.message)
        })
    }, [isReviewLeft]);

    if (isLoadingBook || isLoadingReview || isLoadingCurrentLoansCount || isLoadingCheckedOut|| isLoadingUserReview ) {
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
    async function submitReview(starInput:number,reviewDescription:string) {
        let bookId :number=0;
        if(book?.id){
            bookId =book.id;
        }
        const reviewRequestModel = new ReviewRequestModel(starInput,bookId,reviewDescription);
        console.log(reviewRequestModel)
        const url = `http://localhost:8080/api/reviews/secure`;
        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewRequestModel),
        };
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error('Something went wrong!');
        }
        setIsReviewLeft(true);
    }

    async function checkout() {
        const url = `http://localhost:8080/api/books/secure/checkout/?bookId=${book?.id}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };
        const checkoutResponse = await fetch(url, requestOptions);
        if (!checkoutResponse.ok) {
            throw new Error('Something went wrong!');
        }
        setIsCheckedOut(true);
        
    }
    async function reserveBook() {
        const url = `http://localhost:8080/api/books/secure/Reserve?bookId=${bookId}`;
        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };
        const reserveBookResponse = await fetch(url, requestOptions);
        if (!reserveBookResponse.ok) {
            throw new Error('Something went wrong!');
        }
        setIsBooked(true);
        
    }
   


    return (
        <div>
            <div className='container d-none d-lg-block'>
                <div className='row mt-5'>
                    <div className='col-sm-2 col-md-2'>
                        {book?.img ? <img src={book?.img} width='226' height='349' alt='Book' />
                            :
                            <img
                                src={`https://cdn.codegym.cc/images/article/bbcda54e-3cd0-4dac-a77a-447484b8b487/512.jpeg`}
                                width='226'
                                height='349'
                                alt="book"
                            />}
                    </div>
                    <div className='col-4 col-md-4 container'>
                        <div className='ml-2'>
                            <h2>{book?.title}</h2>
                            <h5 className='text-primary'>{book?.author}</h5>
                            <p className='lead'>{book?.description}</p>
                            <StarReview Rating={totalStars} size={32} />
                        </div>
                    </div>

                    <CheckoutAndReviewBox collectionDate={collectionDate}  submitReview={submitReview} book={book} mobile={false} currentLoansCount={currentLoansCount} isAutheticated={authState?.isAuthenticated} isCheckedOut={isCheckedOut} reserveBook={reserveBook} isReviewLeft={isReviewLeft} isBooked={isBooked}/>
                </div>
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />

            </div>
            <div className='container d-lg-none mt-5'>
                <div className='d-flex justify-content-center align-items-center'>
                    {book?.img ? <img src={book?.img} width='226' height='349' alt='Book' />
                        :
                        <img
                            src={`https://cdn.codegym.cc/images/article/bbcda54e-3cd0-4dac-a77a-447484b8b487/512.jpeg`}
                            width='226'
                            height='349'
                            alt="book"
                        />}
                </div>
                <div className='mt-4'>
                    <div className='ml-2'>
                        <h2>{book?.title}</h2>
                        <h5 className='text-primary'>{book?.author}</h5>
                        <p className='lead'>{book?.description}</p>
                        <StarReview Rating={totalStars} size={32} />

                    </div>
                </div>
                <CheckoutAndReviewBox collectionDate={collectionDate} submitReview={submitReview} book={book} mobile={true} currentLoansCount={currentLoansCount} isAutheticated={authState?.isAuthenticated} isCheckedOut={isCheckedOut} reserveBook={reserveBook} isBooked={isBooked} isReviewLeft={isReviewLeft}/>

                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={true} />
            </div>

        </div>
    )
}

export default BookCheckoutPage
