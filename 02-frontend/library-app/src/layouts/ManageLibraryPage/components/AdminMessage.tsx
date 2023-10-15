import React, { useState } from 'react'
import MessageModel from '../../../models/MessageModel'
import { disconnect } from 'process';

export const AdminMessage:React.FC<{message: MessageModel,submitResponseToQuestion:any}> = (props, key) => {
    const [response, setResponse] = useState("")
    const [displayWarning, setDisplayWarning] = useState(false);
    function submitBtn(){
        
        if(props.message.id != null && response!==''){
            console.log(response)
            props.submitResponseToQuestion(props.message.id,response);
            setDisplayWarning(false)
        }
        else{
            setDisplayWarning(true)
        }
    }
  return (
    <div key={props.message.id}>
        <div className='card mt-2 shadow p-3 bg-body rounded'>
            <h5>Case #{props.message.id}: {props.message.title}</h5>
            <h6>{props.message.userEmail}</h6>
            <p>{props.message.question}</p>
            <hr />
            <div>
                <h5>Response: </h5>
                <form action="PUT">
                    {displayWarning &&
                    <div className='alert alert-danger' role='alert'>
                        All fields must be filled before sumbitting. 
                    </div>
                    }
                    <div className='col-md-12 mb-3'>
                        <label className='form-label'>Description</label>
                        <textarea className="form-control" id="exampleFormControlTextarea1" rows={3} onChange={e => setResponse(e.target.value)} value={response}></textarea>
                    </div>
                    <div>
                        <button type='button' onClick={submitBtn} className='btn btn-primary mt-3'>Submit Response</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}
