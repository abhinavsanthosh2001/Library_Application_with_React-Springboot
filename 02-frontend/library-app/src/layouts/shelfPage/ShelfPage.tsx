import React, { useState } from 'react'
import { Loans } from './components/Loans'
import { AggregateHistory } from './components/AggregateHistory'
import { Reserves } from './components/Reserves'

export const ShelfPage = () => {
    const [historyClick,setHistoryClick] = useState(false)
    const [reserveClick,setreserveClick] = useState(false)
    const [loansClick,setloansClick] = useState(true)

    function history(){
        setHistoryClick(true)
        setloansClick(false)
        setreserveClick(false)
    }
    function reserves(){
        setHistoryClick(false)
        setloansClick(false)
        setreserveClick(true)
    }
    function loans(){
        setHistoryClick(false)
        setloansClick(true)
        setreserveClick(false)
    }



    return (
        <div className='container'>
            <div className='mt-3'>
                <nav>
                    <div className='nav nav-tabs' id='nav-tab' role='tablist'>
                        <button className='nav-link active' onClick={()=>loans()} id='nav-loans-tab' data-bs-toggle='tab' data-bs-target='#nav-loans' type='button' role='tab' aria-controls='nav-loans' aria-selected='true'>
                            Loans
                        </button>
                        <button className='nav-link'  onClick={()=>reserves()} id='nav-reserves-tab' data-bs-toggle='tab' data-bs-target='#nav-reserves' type='button' role='tab' aria-controls='nav-reserves' aria-selected='false'>
                            Reserves
                        </button>
                        <button className='nav-link'  onClick={()=>history()} id='nav-history-tab' data-bs-toggle='tab' data-bs-target='#nav-history' type='button' role='tab' aria-controls='nav-history' aria-selected='false'>
                            History
                        </button>
                    </div>
                </nav>
                <div className='tab-content' id='nav-tabContent'>
                    <div className='tab-pane fade show active' id='nav-loans' role='tabpanel'
                        aria-labelledby='nav-loans-tab'>
                        {loansClick &&<Loans/>}
                        
                    </div>
                    <div className='tab-pane fade' id='nav-reserves' role='tabpanel'
                        aria-labelledby='nav-reserves-tab'>
                        {reserveClick && <><Reserves></Reserves></>}
                    </div>
                    <div className='tab-pane fade' id='nav-history' role='tabpanel'
                        aria-labelledby='nav-history-tab'>
                        {historyClick && <AggregateHistory />}
                    </div>

                </div>
            </div>
        </div>
    )
}
