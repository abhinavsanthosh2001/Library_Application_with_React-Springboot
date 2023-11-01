import BookModel from "./BookModel";

class ShelfCurrentLoans {
    book: BookModel;
    daysLeft: number;
    renewAllowed: boolean

    constructor(book: BookModel, daysLeft: number, renewAllowed: boolean) {
        this.book = book;
        this.daysLeft = daysLeft;
        this.renewAllowed = renewAllowed
    }
}

export default ShelfCurrentLoans;