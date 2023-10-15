import { useOktaAuth } from '@okta/okta-react'
import React, { useState } from 'react'
import AddBookRequest from '../../../models/AddBookRequest';


export const AddNewBook = () => {
    const { authState } = useOktaAuth();

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState("")
    const [copies, setCopies] = useState(0);
    const [category, setCategory] = useState("Select Category")
    const [selectedImg, setSelectedImg] = useState<any>(null);


    const [displayWarning, setDisplayWarning] = useState(false)
    const [displaySuccess, setDisplaySuccess] = useState(false)

    function categoryField(value: string) {
        setCategory(value);
    }
    async function base64Convert(e: any) {
        console.log(e)
        if (e.target.files[0]) {
            getBase64(e.target.files[0]);
        }
    }
    function getBase64(file: any) {
        let reader = new FileReader();
        reader.readAsDataURL(file)
        reader.onload = function () {
            setSelectedImg(reader.result)
        }
        reader.onerror = function (error) {
            console.log("Error", error);
        }
    }

    async function submitBookRequest() {
        const url = `http://localhost:8080/api/admin/secure/add/book`
        if (authState && authState.isAuthenticated && title !== "" && author !== "" && category !== "Select Category" && description !== "" && copies > 0) {
            const book: AddBookRequest = new AddBookRequest(title, author, description, copies, category)
            book.img = selectedImg
            const options = {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(book)
            };
            const response = await fetch(url, options);
            if (!response) {
                throw new Error('Something went wrong')
            }
            setTitle("")
            setDescription("")
            setCopies(0)
            setSelectedImg(null)
            setAuthor("")
            setCategory("Select Category")
            setDisplayWarning(false)
            setDisplaySuccess(true)
        }
        else {
            setDisplayWarning(true)
            setDisplaySuccess(false)
        }
    }

    return (
        <div className='container mt-5 mb-5'>
            {displaySuccess &&
                <div className='alert alert-success' role='alert'>
                    Book Added Successfully
                </div>
            }
            {
                displayWarning &&
                <div className='alert alert-danger' role='alert'>
                    All fields must be filled out
                </div>

            }
            <div className='card'>
                <div className='card-header'>
                    Add New Book
                </div>
                <div className='card-body'>
                    <form method="POST">
                        <div className='row'>
                            <div className='col-md-6 mb-3'>
                                <label className='form-label'>Title</label>
                                <input type="text" className='form-control' name='title' required onChange={e => setTitle(e.target.value)} value={title} />
                            </div>
                            <div className='col-md-3 mb-3'>
                                <label className='form-label'>Author</label>
                                <input type="text" className='form-control' name='author' required onChange={e => setAuthor(e.target.value)} value={author} />
                            </div>
                            <div className='col-md-3 mb-3'>
                                <label className='form-label'>Category</label>
                                <button className='form-control btn btn-primary dropdown-toggle' type='button' id='dropdownMenuButton1' data-bs-toggle="dropdown" aria-expanded="false">
                                    {category}
                                </button>
                                <ul id='addNewBook' className='dropdown-menu' aria-labelledby='dropdownMenuButton1' >
                                    <li>
                                        <a onClick={() => categoryField("FE")} className='dropdown-item'>FrontEnd</a>
                                    </li>
                                    <li>
                                        <a onClick={() => categoryField("BE")} className='dropdown-item'>BackEnd</a>
                                    </li>
                                    <li>
                                        <a onClick={() => categoryField("DATA")} className='dropdown-item'>Data</a>
                                    </li>
                                    <li>
                                        <a onClick={() => categoryField("DevOps")} className='dropdown-item'>DevOps</a>
                                    </li>

                                </ul>
                            </div>

                        </div>
                        <div className='col-md-12 mb-3'>
                            <label className='form-label'>Description</label>
                            <textarea className="form-control" id="exampleFormControlTextarea1" rows={3} onChange={e => setDescription(e.target.value)} value={description}></textarea>
                        </div>
                        <div className='col-md-3 mb-3'>
                            <label className='form-label'>Copies</label>
                            <input type="text" className='form-control' name='copies' required onChange={e => setCopies(Number(e.target.value))} value={copies} />


                        </div>
                        <input type="file" onChange={e => base64Convert(e)} />
                        <div>
                            <button type='button' className='btn btn-primary mt-3' onClick={submitBookRequest}>
                                Add Book
                            </button>
                        </div>
                    </form>

                </div>

            </div>

        </div>
    )
}
