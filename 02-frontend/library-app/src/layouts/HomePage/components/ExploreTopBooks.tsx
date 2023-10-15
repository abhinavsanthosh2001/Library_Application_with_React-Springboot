import { Link } from "react-router-dom";

export const ExploreTopBooks =()=>{
    return (
        <div className="p-5 bg-light header">
            <div className="container-fluid py-5 text-white d-flex justify-content-center align-items-cent">
            <div  style={{marginTop:25}}>
                <h1 className="display-5 fw-bold">Find your next Adventure</h1>
                <Link className="btn btn-lg" style={{backgroundColor: "lightblue",marginTop:15}} to={"/search"} role="button">Explore</Link>
            </div>

            </div>
        
      </div>

    );
}