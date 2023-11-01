import { Link, NavLink } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import LoginWidget from "../../Auth/LoginWidget";

export const Navbar = () => {
  const { oktaAuth, authState } = useOktaAuth();
  if (!authState) {
    return <SpinnerLoading />
  }
  const handleLogout = async () => oktaAuth.signOut();
  console.log(authState);
  return (
    <nav className="navbar navbar-expand-sm navbar-light " style={{ backgroundColor: "lightblue" }}>
      <div className="container-fluid">
        <a className="navbar-brand" href="#">Dashboard</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to={"/home"}>Home</NavLink>
            </li>
            {authState.isAuthenticated && authState.accessToken?.claims.userType !== "admin" && <li className="nav-item">
              <NavLink className="nav-link" to={"/search"}>Search</NavLink>
            </li>}
            {authState.isAuthenticated && authState.accessToken?.claims.userType !== "admin" && <li className="nav-item">
              <NavLink className="nav-link" to={"/shelf"}>Shelf</NavLink>
            </li>}
            {authState.accessToken?.claims.userType === "admin" && <li className="nav-item">
              <NavLink className="nav-link" to={"/admin/ml"}>Manage Books</NavLink>
            </li>}
            {authState.accessToken?.claims.userType === "admin" && <li className="nav-item">
              <NavLink className="nav-link" to={"/admin/mrl"}>Issue/Return Books</NavLink>
            </li>}
           

          </ul>
          <ul className='navbar-nav ms-auto'>

            {!authState.isAuthenticated ?
              <li >
                <Link type="button" className="btn btn-success" to='/login'>Sign In</Link>
              </li> :
              <>
               {authState.isAuthenticated && <li className="nav-item">
                <div className="container">
                <p className="lead"><b>{authState.accessToken?.claims.sub }</b></p>
                </div>
              
             </li>}

              <li >
                <button type="button" className="btn btn-success" onClick={handleLogout}>Logout</button>
              </li></>
            }
          </ul>

        </div>
      </div>
    </nav>
  );

}