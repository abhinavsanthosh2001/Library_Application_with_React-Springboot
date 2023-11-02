class CheckoutResponse{
    bookId?: number;
    title?: string;
    author?: string;
    email?: string;
    reservationDate?: string
    img?: string;
    collectionDate?: string

    constructor(bookId: number , title: string,author: string,img: string, email:string,
        reservationDate: string, collectionDate: string){
        this.bookId = bookId;
        this.title = title;
        this.author = author;
        this.reservationDate = reservationDate;
        this.email = email;
        this.img = img;
        this.collectionDate= collectionDate
    }
}

export default CheckoutResponse;