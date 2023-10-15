import { Link } from "react-router-dom";
import History from "../../../models/History";

export const HistoryCard: React.FC<{history:History}> = (props) =>{
    console.log(props.history.author)
    console.log(props.history.returnedDate);
    return (
        <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
            <div className='row g-0'>
                <div className='col-md-2'>
                    <div className='d-none d-lg-block'>
                        {props.history.img ?
                            <img src={props.history.img}
                                width='165'
                                height='250'
                                alt='Book'
                            />
                            :
                            <img src={require('../../../Images/BooksImages/book-luv2code-1000.png')}
                                width='123'
                                height='196'
                                alt='Book'
                            />
                        }
                    </div>
                    <div className='d-lg-none d-flex justify-content-center 
                        align-items-center'>
                        {props.history.img ?
                            <img src={props.history.img}
                                width='123'
                                height='196'
                                alt='Book'
                            />
                            :
                            <img src={require('../../../Images/BooksImages/book-luv2code-1000.png')}
                                width='123'
                                height='196'
                                alt='Book'
                            />
                        }
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className='card-body'>
                        <h5 className='card-title'>
                            {props.history.author}
                        </h5>
                        <h4>
                            {props.history.title}
                        </h4>
                        <p className="card-text lead">
                            Returned Date: {props.history.description}
                        </p>

                    </div>
                </div>
            </div>
        </div>

    );

}