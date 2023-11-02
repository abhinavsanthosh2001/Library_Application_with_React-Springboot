class BookCheckout{
    bookId?: number;
    title?: string;
    author?: string;
    email?: string;
    checkOutDate?: string
    returnDate?: string
    img?: string;
    constructor(returnDate:string ,bookId: number , title: string,author: string,img: string, email:string,
        checkOutDate: string, ){
        this.bookId = bookId;
        this.title = title;
        this.author = author;
        this.checkOutDate = checkOutDate;
        this.email = email;
        this.img = img;
        this.returnDate=returnDate;
    }
}
export default BookCheckout;