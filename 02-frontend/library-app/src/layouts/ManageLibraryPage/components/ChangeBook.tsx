import { Link } from "react-router-dom";
import BookModel from "../../../models/BookModel"

export const ChangeBook: React.FC<{ book: BookModel ,deleteBook: any,changeQuantity:any}> = (props) => {
    console.log(props.book.id)
    return (
        <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
            <div className='row g-0'>
                <div className='col-md-2'>
                    <div className='d-none d-lg-block'>
                        {props.book.img ?
                            <img src={props.book.img} width='123' height='196' alt='Book' />
                            :
                            <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
                                width='123' height='196' alt='Default' />
                        
                        }
                    </div>
                    <div className='d-lg-none d-flex justify-content-center 
                        align-items-center'>
                        {props.book.img ?
                            <img src={props.book.img} width='123' height='196' alt='Book' />
                            :
                            <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
                                width='123' height='196' alt='Default' />
                        }

                    </div>
                </div>
                <div className='col-md-6'>
                    <div className='card-body'>
                        <h5 className='card-title'>
                            {props.book.author}
                            
                        </h5>
                        <h4>
                            {props.book.title}
                        </h4>
                        <p className='card-text'>
                            {props.book.description}
                        </p>

                    </div>
                </div>
                <div className='col-md-4 mt-5'>
                    <div className="row justify-content-md-center">
                        <div className="col-md-auto ml-3"><p>Total Quantity : <b>{props.book.copies}</b></p></div>
                    </div>
                    <div className="row justify-content-md-center">
                        <div className="col-md-auto"><p>Books Available : <b>{props.book.copiesAvailable}</b></p></div>
                    </div>
                </div>

            </div>
            <div className="row mt-2">
                <div className="col ">
                    <button className="btn btn-danger" type="button" onClick={()=> props.deleteBook(props.book.id)}>Delete</button>
                </div>
            </div>
            <div className="d-grid mt-2">

                <button className="btn btn-primary" type="button" onClick={()=> props.changeQuantity(props.book.id, true)}>Add Quantity</button>
        {props.book.copiesAvailable! >0 ? <button className="btn btn-warning" type="button" onClick={()=> props.changeQuantity(props.book.id, false)}>Decrease Quantity</button>:<button className="btn btn-warning " disabled type="button" onClick={()=> props.changeQuantity(props.book.id, false)}>Decrease Quantity</button>}
                    
        
            </div>

        </div>
    );

}