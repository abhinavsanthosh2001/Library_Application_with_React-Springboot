import React, { useState } from 'react'
import { PostMessage } from './compnents/PostMessage'
import { Messages } from './compnents/Messages'

export const MessagesPage = () => {
    const [messageClick, setMessageCLick] = useState(false)
    

  return (
    <div className='container'>
        <div className='mt-3 mb-2'>
            <nav>
                <div className='nav nav-tabs' id='nav-tab' role='tablist'>
                    <button onClick={()=>setMessageCLick(false)} className='nav-link active' id='nav-send-message-tab' data-bs-toggle="tab" data-bs-target="#nav-send-message" type='button' role='tab' aria-controls='nav-send-message' aria-selected="true">
                        Submit question
                    </button>
                    <button onClick={()=>setMessageCLick(true)} className='nav-link' id='nav-message-tab' data-bs-toggle="tab" data-bs-target="#nav-message" type='button' role='tab' aria-controls='nav-message' aria-selected="false">
                         View Responses
                    </button>
                    

                </div>

            </nav>
            <div className='tab-content' id='nav-tabContent'>
                <div className='tab-pane fade show active' id='nav-send-message' role='tabpanel' aria-labelledby='nav-send-message-tab'>
                    <p>
                        Post new Message
                    </p>
                    <PostMessage/>

                </div>
                <div className='tab-pane fade' id='nav-message' role='tabpanel' aria-labelledby='nav-message-tab'>
                    {messageClick? <Messages/>:<></>}
                </div>

            </div>

        </div>


    </div>
  )
}
