import { useOktaAuth } from '@okta/okta-react'
import React, { useCallback, useEffect, useState } from 'react'
import MessageModel from '../../../models/MessageModel';
import { error } from 'console';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';
import { Pagination } from '../../Utils/Pagination';
import { AdminMessage } from './AdminMessage';
import AdminMessageRequest from '../../../models/AdminMessageRequest';

export const AdminMessages = () => {

    const {authState} = useOktaAuth();

    const [isLoadingMessages, setIsloadingMessages] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [messages, setMessages] = useState<MessageModel[]>([]);
    const [mpp] = useState(5)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const [btnSubmit,setBtnSubmit] = useState(false);


    useEffect(()=> {
        const fetchMessages = async() =>{
            if(authState && authState.isAuthenticated){
                const url = `http://localhost:8080/api/messages/search/findByClosed/?closed=false&page=${currentPage-1}&size=${mpp}`
                const options = {
                    method: "GET",
                    headers:{
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const response = await fetch(url, options);
                if (!response){
                    throw new Error('Something went wrong')
                }
                const responseJson = await response.json();
                setMessages(responseJson._embedded.messages);
                setTotalPages(responseJson.page.totalPages);
                setIsloadingMessages(false)

            }

        }
        fetchMessages().catch((error: any)=> {
            setIsloadingMessages(false)
            setHttpError(error.message);
        })
        window.scrollTo(0,0)
    },[authState,currentPage,btnSubmit])

    if(isLoadingMessages){
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

    async function submitResponse(id:number,response:string){
        const url =`http://localhost:8080/api/messages/secure/admin/message`;
        if(authState && authState?.isAuthenticated && id != null && response!==''){
            const messageAdminRequestModel:AdminMessageRequest=new AdminMessageRequest(id,response);
            const options = {
                method: "PUT",
                headers:{
                    Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(messageAdminRequestModel)
            };

            const postMessage = await fetch(url,options);

            if(!postMessage.ok){
                throw new Error("Something went wrong");
            }
            setBtnSubmit(!btnSubmit);

        }
    }
    

    const paginate = (pageNumber: number)=>setCurrentPage(pageNumber);
  return (
    <div className='mt-3'>
         {messages.length>0?
        <>
        <h5>Pending Q/A:</h5>
        {
            messages.map(message => (
                <AdminMessage message={message} submitResponseToQuestion={submitResponse} key={message.id}></AdminMessage>
            ))
        }
        </> 
        :
        <h5>No Pending Questions</h5>
        }
        {totalPages>1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}></Pagination>}
    </div>
  )
}
