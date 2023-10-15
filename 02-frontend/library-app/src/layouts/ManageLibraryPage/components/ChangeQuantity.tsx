import React, { useEffect, useState } from 'react'
import BookModel from '../../../models/BookModel';
import { useOktaAuth } from '@okta/okta-react';
import { Pagination } from '../../Utils/Pagination';
import { ChangeBook } from './ChangeBook';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';
import { Link } from 'react-router-dom';
import { ManageLibraryPage } from '../ManageLibraryPage';

export const ChangeQuantity = () => {

    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, sethttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(5);
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState("");
    const [searchUrl, setSearchUrl] = useState("");
    const [category, setCategory] = useState("Book category");
    const { authState } = useOktaAuth();
    const [flag,setFlag] = useState(false); 

    useEffect(() => {
        window.scrollTo(0, 0);
    },[currentPage])

    useEffect(() => {
        const fetchBooks = async () => {
            const baseUrl: string = "http://localhost:8080/api/books";

            let url: string = "";

            if (searchUrl === "") {
                url = `${baseUrl}?page=${currentPage - 1}&size=${booksPerPage}`;
            }
            else {
                let searchWithPage = searchUrl.replace('<pageNumber>', `${currentPage - 1}`)
                url = baseUrl + searchWithPage
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Something went wrong");
            }
            const responseJson = await response.json();
            const responseData = responseJson._embedded.books;

            setTotalAmountOfBooks(responseJson.page.totalElements)
            setTotalPages(responseJson.page.totalPages)

            const loadedBooks: BookModel[] = [];
            for (const key in responseData) {
                loadedBooks.push({
                    id: responseData[key].id,
                    title: responseData[key].title,
                    author: responseData[key].author,
                    description: responseData[key].description,
                    copies: responseData[key].copies,
                    copiesAvailable: responseData[key].copiesAvailable,
                    category: responseData[key].category,
                    img: responseData[key].img,
                })
            }
            setBooks(loadedBooks);
            setIsLoading(false);
        };
        fetchBooks().catch((error: any) => {
            setIsLoading(false);
            sethttpError(error.message);
        })
        
    }, [currentPage, authState, searchUrl,flag]);
    const searchHandleChange = () => {
        setCurrentPage(1)
        if (search === "") {
            setSearchUrl("");
        } else {
            setSearchUrl(`/search/findByTitleContaining?title=${search}&page=<pageNumber>&size=${booksPerPage}`);
        }
    }
    async function deleteBook(id:number){
        setIsLoading(true)
        if(authState && authState?.isAuthenticated && id != null ){
            const url =`http://localhost:8080/api/admin/secure/delete/book?bookId=${id}`
            const options = {
                method: "DELETE",
                headers:{
                    Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                }
            };

            const postMessage = await fetch(url,options);

            if(!postMessage.ok){
                throw new Error("Something went wrong");
            }
            setFlag(!flag);
        }
        setIsLoading(false)
    }

    async function changeQuantity(id:number, add:boolean){
        if(authState && authState?.isAuthenticated && id != null ){
            const url =`http://localhost:8080/api/admin/secure/changeQuantity/book?bookId=${id}&add=${add}`
            const options = {
                method: "PUT",
                headers:{
                    Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                }
            };

            const postMessage = await fetch(url,options);

            if(!postMessage.ok){
                throw new Error("Something went wrong");
            }
            setFlag(!flag);
        }
    }

    const indexOfLastBook: number = currentPage * booksPerPage;
    const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
    let lastItem = booksPerPage * currentPage <= totalAmountOfBooks ? booksPerPage * currentPage : totalAmountOfBooks;
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    if(isLoading){
        return(
            <SpinnerLoading></SpinnerLoading>
        );
    }
    if(httpError){
        return (
            <div className='contsiner m-5'>
                <p>{httpError}</p>
            </div>
        );
    }
    return (
        <>
            <div className='row mt-5'>
                <div className='col-6'>
                    <div className='d-flex'>
                        <input className='form-control me-2' type='search'
                            placeholder='Search' aria-labelledby='Search'
                            onChange={e => setSearch(e.target.value)}
                        />
                        <button className='btn btn-outline-success'
                            onClick={() => searchHandleChange()}>
                            Search
                        </button>
                    </div>
                </div>
            </div>
            {totalAmountOfBooks > 0 ?

                <>
                    <div className='mt-3'>
                        <h5>Number of results: ({totalAmountOfBooks})</h5>
                    </div>
                    <p>
                        {indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks} items:
                    </p>
                    {books.map(book => (
                        
                        <ChangeBook book={book} key={book.id} deleteBook={deleteBook} changeQuantity={changeQuantity}/>
                    ))}
                </>
                :
                <div className="m-5">
                    <h3>
                        No Books present. Want to add a new book?
                    </h3>
                    <Link type="button" className="btn main-color btn-md px-4 me-md-2 fw-bold text-white" to={"/admin"} >Add Book</Link>
                </div>}
            {totalPages > 1 &&
                <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
            }
        </>
    )
} 
