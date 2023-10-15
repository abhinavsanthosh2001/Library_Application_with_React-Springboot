import { useOktaAuth } from '@okta/okta-react'
import React, { useState } from 'react'
import MessageModel from '../../../models/MessageModel'
export const PostMessage = () => {
    const { authState } = useOktaAuth();
    const [title, setTitle] = useState("")
    const [question, setQuestion] = useState("")
    const [displayWarning, setDisplayWarning] = useState(false)
    const [displaySUccess, setDisplaySUccess] = useState(false)
    async function submitQuestion() {
        const url = `http://localhost:8080/api/messages/secure/add/message`;
        if (authState?.isAuthenticated && title !== '' && question !== '') {
            const messageRequestModel: MessageModel = new MessageModel(title, question);
            const requestOptions = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageRequestModel)
            };
            const submitNewQuestionResponse = await fetch(url, requestOptions);
            if (!submitNewQuestionResponse.ok) {
                throw new Error('Something Went Wrong');
            }
            setTitle('')
            setQuestion('')
            setDisplayWarning(false)
            setDisplaySUccess(true)
        }
        else {
            setDisplayWarning(true)
            setDisplaySUccess(false)
        }
    }
    return (
        <div className='card mt-3'>
            {displaySUccess && <div className='alert alert-success' role='alert'>
                question added

            </div>}
            <div className='card-header'>
                Ask Question to admin

            </div>
            <div className='card-body'>
                <form method='Post'>
                    {displayWarning &&
                        <div className='alert alert-danger' role='alert'>
                            All fields must be filled
                        </div>
                    }
                    <div className='mb-3'>
                        <label className='form-lable'>
                            Title
                        </label>
                        <input type="text" className='form-control' required={true} id='exampleFormControlInput1'
                            placeholder='Title' onChange={e => setTitle(e.target.value)} value={title} />

                    </div>
                    <div className='mb-3'>
                        <label className='form-lable'>
                            Question
                        </label>
                        <textarea className='form-control' id='exampleFormControlTextarea1' rows={3}
                            onChange={e => setQuestion(e.target.value)} value={question} />

                    </div>
                    <div>
                        <button type='button' onClick={submitQuestion} className='btn btn-primary mt-3 '>
                            Submit Question
                        </button>
                    </div>
                </form>

            </div>

        </div>
    )
}
