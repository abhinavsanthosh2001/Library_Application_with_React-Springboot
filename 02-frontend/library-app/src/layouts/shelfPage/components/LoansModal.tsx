import ShelfCurrentLoans from "../../../models/ShelfCurrentLoans";

export const LoansModal: React.FC<{
    setSuccess: any, shelfCurrentLoan: ShelfCurrentLoans, mobile: boolean, returnBook: any,
    renewLoan: any
}> = (props) => {
    return (
        <div className='modal fade' id={props.mobile ? `mobilemodal${props.shelfCurrentLoan.book.id}` :
            `modal${props.shelfCurrentLoan.book.id}`} data-bs-backdrop='static' data-bs-keyboard='false'
            aria-labelledby='staticBackdropLabel' aria-hidden='true' key={props.shelfCurrentLoan.book.id}>
            <div className='modal-dialog'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <h5 className='modal-title' id='staticBackdropLabel'>
                            Loan Options
                        </h5>
                        <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'>
                        </button>
                    </div>
                    <div className='modal-body'>
                        <div className='container'>
                            <div className='mt-3'>
                                <div className='row'>
                                    <div className='col-2'>
                                        {props.shelfCurrentLoan.book?.img ?
                                            <img src={props.shelfCurrentLoan.book?.img}
                                                width='56' height='87' alt='Book' />
                                            :
                                            <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
                                                width='56' height='87' alt='Book' />
                                        }
                                    </div>
                                    <div className='col-10'>
                                        <h6>{props.shelfCurrentLoan.book.author}</h6>
                                        <h4>{props.shelfCurrentLoan.book.title}</h4>
                                        {props.shelfCurrentLoan.daysLeft > 0 &&
                                            <p className='text-secondary'>
                                                Due in {props.shelfCurrentLoan.daysLeft} days.
                                            </p>
                                        }
                                        {props.shelfCurrentLoan.daysLeft === 0 &&
                                            <p className='text-success'>
                                                Due Today.
                                            </p>
                                        }
                                        {props.shelfCurrentLoan.daysLeft < 0 &&
                                            <p className='text-danger'>
                                                Past due by {props.shelfCurrentLoan.daysLeft} days.
                                            </p>
                                        }
                                    </div>
                                </div>
                                <hr />

                                <div className='list-group mt-3'>

                                {props.shelfCurrentLoan.renewAllowed ?
                                <p>Are you sure to renew the book ?</p>:
                                <>
                                <p className='text-danger'>Renew Limit Exceeded.</p><p>Kindly return the book before the due date</p>
                                 </>
                                }

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='modal-footer'>
                        {props.shelfCurrentLoan.renewAllowed &&
                        <button onClick={()=>props.renewLoan(props.shelfCurrentLoan.book.id)} type='button' className='btn btn-primary' data-bs-dismiss='modal'>
                            Renew
                        </button>}
                        <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>
                            Close
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
}