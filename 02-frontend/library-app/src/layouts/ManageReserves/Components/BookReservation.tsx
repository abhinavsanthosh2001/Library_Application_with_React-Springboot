import BookModel from "../../../models/BookModel";
import CheckoutResponse from "../../../models/CheckoutResponse";


export const BookReservation: React.FC<{ book: CheckoutResponse, checkout: any, deleteReserve: any }> = (props) => {
    return (
        <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
            <div className='d-none d-lg-block'>
                <div className='d-flex  bd-highlight mb-3'>
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
                        <div className='p-2 '>
                            <button className="btn btn-danger" type="button" onClick={() => props.deleteReserve(props.book.bookId)}>Delete Reserve</button>
                        </div>

                        <div className="p-2 flex-grow-1 ">
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
                                User Name: username@gmail.com
                            </h5>
                        </div>
                        <div>
                            <h5>
                                Reserve Date: 19/10/2023
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
