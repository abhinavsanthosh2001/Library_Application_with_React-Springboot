import React from 'react'
export const UserCard: React.FC<{ userDeatils: any }> = (props) => {
    return (
        <div className="card text-black  mb-3" style={{backgroundColor:"lightblue"}}>
            <div className="card-header"><b>{props.userDeatils.userEmail}</b></div>
            <div className="card-body">
                <p className="card-text">CheckedoutBooks: {props.userDeatils.checkedoutBooks}/5</p>
                <p className="card-text">Reserved Books: {props.userDeatils.reservedBooks}/5</p>
                <p className="card-text">Total Read Books: {props.userDeatils.historyCount}</p>
            </div>
        </div>
    )
}
