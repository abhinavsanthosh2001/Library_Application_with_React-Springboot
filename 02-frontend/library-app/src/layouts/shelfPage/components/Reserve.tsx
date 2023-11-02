import React from 'react'
import CheckoutResponse from '../../../models/CheckoutResponse'

export const Reserve: React.FC<{ book: CheckoutResponse }> = (props) => {
    return (
        <div className='mt-1 shadow p-3 mb-1 bg-body '>
            <div className='d-none d-lg-block'>
                <div className='d-flex  bd-highlight '>
                    
                    <div className='p-2 m-1'>
                        {props.book.img ?
                            <img src={props.book.img} width='65' height='95' alt='Book' />
                            :
                            <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
                                width='123' height='196' alt='Default' />
                        }
                    </div>
                    <div className='p2 m-1 mt-3'>
                        <h5>
                            Book: {props.book.title}
                        </h5>
                        <h5>
                            Author: {props.book.author}
                        </h5>

                    </div>
                    <div className='p2 m-1 ms-auto mt-3'>
                        <div>
                            <h5>
                                Collection Date: {props.book.collectionDate}
                            </h5>
                        </div>
                    </div>
                </div>
            </div>
            <div className='d-lg-none'>
                <div className='d-flex flex-column bd-highlight mb-3'>
                    <div className="d-flex justify-content-center">
                        <div className='p-2 m-1 '>
                            {props.book.img ?
                                <img src={props.book.img} width='100' height='150' alt='Book' />
                                :
                                <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
                                    width='123' height='196' alt='Default' />
                            }
                        </div>
                    </div>
                    <div className='p2 m-2'>
                        <div>
                            <h5>
                                Book: {props.book.title}
                            </h5>
                        </div>
                        <div>
                            <h5>
                                Author: {props.book.author}
                            </h5>
                        </div>
                    </div>
                    <div className='p2 m-2'>
                        <div>
                            <h5>
                                Collection Date: {props.book.collectionDate}
                            </h5>
                        </div>
                        
                    </div>
                </div>
            </div>

        </div>
    )
}
