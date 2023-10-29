import React from 'react'
import BookModel from '../../models/BookModel'
import { Link } from 'react-router-dom'
import { LeaveAReview } from '../Utils/LeaveAReview'
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip'

const CheckoutAndReviewBox: React.FC<{ isReservedLimitExceeded: any, submitReview: any, isBlocked: boolean, collectionDate: string, book: BookModel | undefined, mobile: boolean, currentLoansCount: number, isAutheticated: any, isCheckedOut: boolean, reserveBook: any, isReviewLeft: boolean, isBooked: boolean }> = (props) => {
    function reviewRender() {
        if (props.isAutheticated && !props.isReviewLeft) {
            return (<p><LeaveAReview submitReview={props.submitReview} /></p>)
        } else if (props.isAutheticated && props.isReviewLeft) {
            return (<p><b>Thank you for your review. Your feedback matters to us.</b></p>)
        }
        return (<div><hr /><p>Sign In to leave a review</p></div>)
    }
    function buttonRender() {
        if (props.isAutheticated) {
            if (!props.isCheckedOut && props.currentLoansCount < 5 && !props.isBooked && !props.isBlocked && props.isReservedLimitExceeded<5) {
                return (<button type='button' className="btn btn-success btn-lg" onClick={() => props.reserveBook()}>Reserve Book</button>)

            }
            else if (props.isCheckedOut) {
                return (<p><b>Book checked Out!!</b></p>)
            }
            else if (props.isBlocked) {
                return (<h4 className='text-danger'>
                    <b>Blocked </b>
                    <a className="my-anchor-element" id='clickable'><svg xmlns="http://www.w3.org/2000/svg" color='red' width="16" height="16" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path>
                    </svg></a>
                    <Tooltip anchorSelect="#clickable" clickable place="right">
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span>Once you reserve a book, </span>
                            <span>please come and collect it.</span>
                            <span>On failing to do so, you</span>
                            <span>  won't be able to reserve</span>
                            <span> the book for a week. </span>
                            <span>For any queries, </span>
                            <span>please contact us by clicking <Link to={"/messages"}>here</Link></span>
                        </div>
                    </Tooltip>


                </h4>)
            }
            else if (props.isBooked) {
                return (<p><b>Book Reserved. Collect the book before {props.collectionDate}</b></p>)
            }
            else if (!props.isCheckedOut && !props.isBooked && props.currentLoansCount >= 5) {
                return (<p className='text-danger'>Checkout limit exceeded</p>)
            }
            else if (props.isReservedLimitExceeded >= 5) {
                return (<p className='text-danger'>Reserve limit exceeded</p>)
            }
        }
        return (<Link to="/login" className="btn btn-success btn-lg">Sign In</Link>)
    }


    return (
        <div className={props.mobile ? 'card d-flex mt-5' : "card col-3 container d-flex mb-5"}>
            <div className='card-body container'>
                <div className='mt-3'>
                    <div className='row'>
                        <p>
                            books checked out
                            <b> {props.currentLoansCount}/5 </b>
                        </p>
                    </div>
                    <div className='row'>
                        <p>
                            reserve count
                            <b> {props.isReservedLimitExceeded}/5 </b>
                        </p>
                        
                    </div>

                    <hr />
                    {props.book && props.book.copiesAvailable && props.book.copiesAvailable > 0 ?
                        <h4 className='text-success'>Available</h4>
                        :
                        <h4 className='text-danger'>Wait List</h4>
                    }
                    <p className='col-12 lead'>
                        {props.book?.copiesAvailable == 0 ? <b> No Copies Available at the moment</b> :
                            <>
                                <b>{props.book?.copiesAvailable} / </b>
                                <b>{props.book?.copies} </b>
                                copies available
                            </>
                        }

                    </p>


                </div>
                {props.book && props.book.copiesAvailable && props.book.copiesAvailable > 0 ?
                    buttonRender() : <></>}
                <hr />
                <p className='mt-3'>
                    THis Number can change
                </p>
                {reviewRender()}

            </div>

        </div >
    )
}
export default CheckoutAndReviewBox

