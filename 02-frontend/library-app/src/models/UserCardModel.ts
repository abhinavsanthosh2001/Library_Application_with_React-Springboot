class UserCardModel{
    userEmail?: string;
    checkedoutBooks?: number;
    reservedBooks?: number;
    historyCount?: number;
    

    constructor(userEmail: string , checkedoutBooks: number,reservedBooks: number,historyCount: number){
        this.userEmail = userEmail;
        this.checkedoutBooks = checkedoutBooks;
        this.reservedBooks = reservedBooks;
        this.historyCount = historyCount;
    }
}

export default UserCardModel;