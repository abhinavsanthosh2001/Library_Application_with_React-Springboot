import React, { useEffect, useState } from 'react'
import ReviewModel from '../../models/ReviewModel'
import { SpinnerLoading } from '../Utils/SpinnerLoading';
import { Review } from '../Utils/Review';
import { Pagination } from '../Utils/Pagination';

export const ReviewListPage = () => {
    const [reviews,setReviews] = useState<ReviewModel[]>([]);
    const [isLoading,setIsLoading] = useState(true);
    const [httpError,setHttpError] = useState(null);
    //Pagination
    const [currentPage,setCurrentPage] = useState(1);
    const [reviewPerPage] = useState(5);
    const [ totalAmountOfReviews,setTotalAmountOfReviews] = useState(0);
    const [totalPages,setTotalPages] = useState(0)
    const bookId = (window.location.pathname).split('/')[2]
    useEffect(() => {
       
        const fetchBookReviews = async () => {
            const reviewUrl: string = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}&page=${currentPage-1}&size=${reviewPerPage}`;
            const responseReview = await fetch(reviewUrl);
            if (!responseReview.ok) {
                throw new Error("Something went wrong");
            }
            const responseJson = await responseReview.json();
            const responseData = responseJson._embedded.reviews;
            setTotalAmountOfReviews(responseJson.page.totalElements);
            setTotalPages(responseJson.page.totalPages);

            const loadedReviews: ReviewModel[] = [];

            for (const key in responseData) {
                loadedReviews.push({
                    id: responseData[key].id,
                    userEmail: responseData[key].userEmail,
                    date: responseData[key].date,
                    rating: responseData[key].rating,
                    book_id: responseData[key].bookId,
                    reviewDescription: responseData[key].reviewDescription
                });
            }
 
            setReviews(loadedReviews);
            setIsLoading(false);
        };
        fetchBookReviews().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message)
        })
    }, [currentPage]);
    if(isLoading){
        return (<SpinnerLoading/>)
    }
    if(httpError){
        <div className='container m-5'>
            <p>{httpError}</p>
        </div>
        
    }
     const indexOfLAstReview : number = currentPage * reviewPerPage;
     const indexOfFirstReview : number = indexOfLAstReview - reviewPerPage;
     let lastItem = reviewPerPage * currentPage <= totalAmountOfReviews ? reviewPerPage * currentPage : totalAmountOfReviews;
     const paginate = (pageNumber:number) => setCurrentPage(pageNumber);

  return (
    <div className='container m-5'>
        <div>
            <h3>
                Comments : ({reviews.length})
            </h3>
        </div>
        <p>
            {indexOfFirstReview+1} to {lastItem} of {totalAmountOfReviews} reviews
        </p>
        <div className='row'>
            {
                reviews.map(review => (
                   <Review review = {review} key = {review.id}/> 
                ))
            }

        </div>
        {totalPages>1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}
    </div>
  )
}


