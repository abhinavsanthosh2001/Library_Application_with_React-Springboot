import { useOktaAuth } from '@okta/okta-react';
import { useEffect, useState } from "react";
import MessageModel from '../../../models/MessageModel';
import { error } from 'console';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';
import { Pagination } from '../../Utils/Pagination';

export const Messages = () => {
    const { authState } = useOktaAuth();
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [httpError, sethttpError] = useState(null);
    const [messages, setMessages] = useState<MessageModel[]>([])

    const [messagesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);


    useEffect(() => {
        const fetchUserMessages = async () => {
            if(authState && authState.isAuthenticated){
                const url = `http://localhost:8080/api/messages/search/findByUserEmail/?userEmail=${authState.accessToken?.claims.sub}&page=${currentPage-1}&size=${messagesPerPage}`
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
                const response = await fetch(url, requestOptions)
                if(!response.ok){
                    throw new Error("Something went wrong")
                }
                const jsondata = await response.json()
                setMessages(jsondata._embedded.messages)
                setTotalPages(jsondata.page.totalPages)
            }
            setIsLoadingMessages(false)

        }
        fetchUserMessages().catch((error: any) => {
            setIsLoadingMessages(false);
            sethttpError(error.message)
        }
        )
        window.scrollTo(0,0)
    },[authState,currentPage])
    if (isLoadingMessages) {
        return (
            <SpinnerLoading />
        )
    }
    if (httpError) {<div></div>
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        )
    }
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className='mt-2'>
            {messages.length > 0 ? 
            <>
                <h5>Current Q/A: </h5>
                {messages.map(message => (
                    <div key={message.id}>
                        <div className='card mt-2 shadow p-3 bg-body rounded'>
                            <h5>
                                Case #{message.id}: {message.title}
                            </h5>
                            <h6>
                                {message.userEmail}
                            </h6>
                            <p>{message.question}</p>
                            <hr />
                            <div>
                                <h5>Response: </h5>
                                {message.response && message.adminEmail ?
                            <>
                                <h6>{message.adminEmail} (admin)</h6>
                                <p>{message.response}</p>
                            </>    :
                            <p><i>Pending Response: Please be patient</i></p>
                            }
                            </div>
                        </div>
                    </div>
                ))}
            </>:  
            <h5>All Questions will be shown here, Currently there are no messages asked by you</h5>

        }
        {totalPages>1&&<Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}

        </div>
    )
}


