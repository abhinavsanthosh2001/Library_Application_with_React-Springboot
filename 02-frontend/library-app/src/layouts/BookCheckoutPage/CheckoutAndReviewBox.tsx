import React, { useEffect, useState } from 'react'
import BookModel from '../../models/BookModel'
import { Link } from 'react-router-dom'
import { useOktaAuth } from '@okta/okta-react'
import { LeaveAReview } from '../Utils/LeaveAReview'

const CheckoutAndReviewBox: React.FC<{submitReview:any, collectionDate: string ,book: BookModel | undefined, mobile: boolean, currentLoansCount: number, isAutheticated: any, isCheckedOut: boolean, reserveBook: any, isReviewLeft: boolean, isBooked: boolean}> = (props) => {
    function reviewRender(){
        if(props.isAutheticated && !props.isReviewLeft){
            return(<p><LeaveAReview submitReview={props.submitReview}/></p>)
        }else if(props.isAutheticated && props.isReviewLeft){
            return(<p><b>Thank you for your review. Your feedback matters to us.</b></p>)
        }
        return (<div><hr /><p>Sign In to leave a review</p></div>)
    }
    function buttonRender(){
        if(props.isAutheticated){
            if(!props.isCheckedOut && props.currentLoansCount < 5 && !props.isBooked){
                return (<button type='button' className="btn btn-success btn-lg" onClick={() => props.reserveBook()}>Reserve Book</button>)

            }
            else if(props.isCheckedOut){
               return (<p><b>Book checked Out!!</b></p>)
            }
            else if(props.isBooked){
                return (<p><b>Book Reserved. Collect the book before {props.collectionDate}</b></p>)
             }
            else if(!props.isCheckedOut && !props.isBooked){
                return (<p className='text-danger'>Checkout limit exceeded</p>)
            }
        }
        return(<Link to="/login" className="btn btn-success btn-lg">Sign In</Link>)
    }
    

    return (
        <div className={props.mobile ? 'card d-flex mt-5' : "card col-3 container d-flex mb-5"}>
            <div className='card-body container'>
                <div className='mt-3'>
                    <p>
                        <b>{props.currentLoansCount}/5 </b>
                        books checked out
                    </p>
                    <hr />
                    {props.book && props.book.copiesAvailable && props.book.copiesAvailable > 0 ?
                        <h4 className='text-success'>Available</h4>
                        :
                        <h4 className='text-danger'>Wait List</h4>
                    }
                    <p className='col-12 lead'>
                        {props.book?.copiesAvailable==0?<b> No Copies Available at the moment</b>:
                        <>
                        <b>{props.book?.copiesAvailable} / </b>
                        <b>{props.book?.copies} </b>
                        copies available
                        </>
                        }
                        
                    </p>


                </div>
                {props.book && props.book.copiesAvailable && props.book.copiesAvailable > 0 ?
                buttonRender():<></>}
                <hr />
                <p className='mt-3'>
                    THis Number can change
                </p>
                {reviewRender()}

            </div>

        </div>
    )
}
export default CheckoutAndReviewBox

