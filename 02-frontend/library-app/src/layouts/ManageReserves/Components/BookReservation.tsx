import CheckoutResponse from "../../../models/CheckoutResponse";


export const BookReservation: React.FC<{handleCheck: any, addBookToCheckout: any, book: CheckoutResponse, checkout: any, deleteReserve: any }> = (props) => {
    
    return (
        <div className='mt-1 shadow p-3 mb-1 bg-body'>
            <div className='d-none d-lg-block'>
                <div onClick={props.handleCheck}className='d-flex  bd-highlight '>
                    <div className="p-2 m-1 align-self-center">
                        <div className="form-check checkbox-xl">
                            <input checked={props.handleCheck(props.book.bookId!)} onChange={(e) => props.addBookToCheckout(props.book, e.target.checked)} className="form-check-input" type="checkbox" id={props.book.bookId?.toString()} />
                        </div>
                    </div>
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
                                User Name: {props.book.email}
                            </h5>
                        </div>
                        <div>
                            <h5>
                                Reserve Date: {props.book.reservationDate}
                            </h5>
                        </div>

                    </div>


                    <div className="p-2 m-1 ">
                        <div className="d-grid gap-2">

                            <button className="btn btn-danger" type="button" onClick={() => props.deleteReserve(props.book.bookId)}>Delete Reserve</button>


                            <button className="btn btn-primary" type="button" onClick={() => props.checkout(props.book.bookId)}>Checkout</button>


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
                                User Name: {props.book.email}
                            </h5>
                        </div>
                        <div>
                            <h5>
                                Reserve Date: {props.book.reservationDate}
                            </h5>
                        </div>

                    </div>


                    <div className="p-2 ">
                        <div className="d-grid mt-2">
                            <button className="btn btn-danger" type="button" onClick={() => props.deleteReserve(props.book.bookId)}>Delete Reserve</button>
                            <button className="btn btn-primary" type="button" onClick={() => props.checkout(props.book.bookId)}>Checkout</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
