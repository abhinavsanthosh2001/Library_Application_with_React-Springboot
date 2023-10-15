import { Link } from "react-router-dom";

export const Footer = () => {
    return (
        <div className="mb=0" style={{backgroundColor:"lightblue"}}>
        <div className="container " >
            <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-1" >
                <p className="col-md-4 mb-0 text-muted">© 2023 Library, Inc</p>
                <ul className="nav col-md-4 justify-content-end">
                    <li className="nav-item"><Link to={"/home"} className="nav-link px-2 text-muted">Home</Link></li>
                    <li className="nav-item"><Link to={"/search"} className="nav-link px-2 text-muted">Search Books</Link></li> 
                </ul>
            </footer> 
        </div>
        </div>
    );
}