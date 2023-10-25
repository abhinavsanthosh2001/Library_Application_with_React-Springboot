class CheckoutResponse{
    bookId?: number;
    title?: string;
    author?: string;
    email?: string;
    reservationDate?: string
    img?: string;

    constructor(bookId: number , title: string,author: string,img: string, email:string,
        reservationDate: string){
        this.bookId = bookId;
        this.title = title;
        this.author = author;
        this.reservationDate = reservationDate;
        this.email = email;
        this.img = img;
    }
}

export default CheckoutResponse;