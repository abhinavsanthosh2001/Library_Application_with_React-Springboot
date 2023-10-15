import React, { useEffect, useState } from 'react'
import BookModel from '../../models/BookModel'
import { Link } from 'react-router-dom'
import { useOktaAuth } from '@okta/okta-react'
import { LeaveAReview } from '../Utils/LeaveAReview'

const CheckoutAndReviewBox: React.FC<{submitReview:any ,book: BookModel | undefined, mobile: boolean, currentLoansCount: number, isAutheticated: any, isCheckedOut: boolean, checkoutBook: any, isReviewLeft: boolean}> = (props) => {
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
            if(!props.isCheckedOut && props.currentLoansCount < 5){
                return (<button type='button' className="btn btn-success btn-lg" onClick={() => props.checkoutBook()}>CheckOut</button>)

            }
            else if(props.isCheckedOut){
               return (<p><b>Book checked Out!!</b></p>)
            }
            else if(!props.isCheckedOut){
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
                        <b>{props.book?.copiesAvailable} / </b>
                        <b>{props.book?.copies} </b>
                        copies available
                    </p>


                </div>
                {buttonRender()}
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

