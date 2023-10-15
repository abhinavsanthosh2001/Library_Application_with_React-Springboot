import React from 'react'
import ReviewModel from '../../models/ReviewModel'
import { StarReview } from './StarReview';

export const Review: React.FC<{ review: ReviewModel }> = (props) => {
    const date = new Date(props.review.date!);
    const longmonth = date.toLocaleString('en-us', { month: 'long' });
    const dateDay = date.getDate();
    const dateYear = date.getFullYear();
    const dateRender = longmonth + ' ' + dateDay + ', ' + dateYear;
    return (
        <div>
            <div className='col-sm-8 col-md-8'>
                <h5>{props.review.userEmail}</h5>
                <div className='row'>
                    <div className='col'>
                        {dateRender}
                    </div>
                    <div className='col'>
                        <StarReview Rating={props.review.rating!} size={16} />
                    </div>
                </div>
                <div className='mt-2'>
                    <p>
                        {props.review.reviewDescription}
                    </p>
                </div>
            </div>
            <hr/>
        </div>
    )
}
