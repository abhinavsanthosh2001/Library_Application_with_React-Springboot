# React-SpringBoot Library Application

## Overview

The **React-SpringBoot Library Application** is a full-stack web application built using **React** for the front-end and **Spring Boot** for the back-end. This project is designed for managing a library system where users can search for books, reserve them, leave reviews, and manage check-outs and returns. It features a user-friendly UI, secure authentication, and automated notifications for overdue books and reservations.

## Features

### Front-End (React):
- **Responsive Design**: A clean and intuitive UI that works across devices.
- **React Router**: Client-side routing for navigating between pages seamlessly.
- **State Management**: Efficiently manage application state using React hooks.
- **Authentication**: Secure login and user management with **Okta**.
- **Book Management**: Users can search for books, leave reviews, and manage reservations.
- **Light/Dark Mode**: Toggle between light and dark modes for a better user experience.

### Back-End (Spring Boot):
- **RESTful APIs**: Robust back-end built with **Spring Boot**, exposing APIs for book management, user authentication, and more.
- **Spring Data JPA**: For seamless database operations, including handling book and user data.
- **MySQL Integration**: Persistent storage using MySQL.
- **Scheduled Tasks with @Scheduled**: Automate tasks such as sending notifications for overdue books or expiring reservations.
- **Concurrent Processing**: Ensures that bulk uploads and large-scale operations are handled efficiently using **Spring Batch**.
- **JWT Authentication**: For secure access and role-based authentication.

## Additional Features

- **Book Search**: Users can search for books based on various filters (title, author, genre, etc.).
- **Book Reviews**: Users can leave reviews and rate books, and reviews are displayed along with the book details.
- **Book Reservation**: Users can reserve books and receive notifications when reserved books are available or overdue.
- **Check-In/Check-Out**: Users can check out books online, and admins can manage book returns.
- **Admin Features**: Admins can manage books and user roles through a secure dashboard.
- **Notifications**: The system automatically sends notifications for overdue books, reservation expirations, and book availability.

## Screenshots

### Home Page
![Home Page](https://github.com/rakesh-u09/Screenshoots/blob/master/15.10.2023_11.21.30_REC.png?raw=true)

### Sign-in and Sign-up Page
![Sign-in Page](https://github.com/rakesh-u09/Screenshoots/blob/master/15.10.2023_11.36.57_REC.png?raw=true)

## Okta Authentication

- This application uses **Okta** for secure user authentication.
- Users must log in to access certain features like leaving reviews, reserving books, and managing their check-outs.
- The **JWT** token generated upon login ensures secure API requests and proper access control based on user roles (Admin/User).

## Cron Jobs with Spring Boot

The back-end uses **Spring's @Scheduled** annotation to run recurring tasks:
- **Overdue Book Notifications**: A scheduled task runs daily to check for overdue books and sends notification emails to users.
- **Reservation Expiry Notifications**: Notifications are sent to users when their reservations are about to expire.
- **Book Availability Alerts**: Notifies users when a reserved book becomes available.

## Data Security

- **AES Encryption**: Sensitive data such as user information and payment details are encrypted using AES to ensure confidentiality.
- **JWT Authentication**: Ensures secure user sessions, with tokens managed through Okta.

## Installation

1. Clone the repository:  
`git clone https://github.com/your-repo/library-application.git`  
`cd library-application`

2. **Front-End Setup:**  

Navigate to the `client` directory and install dependencies:  
`cd client`  
`npm install`

3. **Back-End Setup:**  

Navigate back to the root folder and install Maven dependencies:  
`cd ..`  
`./mvnw clean install`

4. **Database Configuration:**  
- Set up a MySQL (or your preferred relational) database.
- Update the database connection details (username, password, database name) in the `application.properties` file located in the `src/main/resources` directory of the back-end project.
- Example of `application.properties` configuration:  
`spring.datasource.url=jdbc:mysql://localhost:3306/library_db`  
`spring.datasource.username=root`  
`spring.datasource.password=password`  
`spring.jpa.hibernate.ddl-auto=update`

5. **Okta Authentication Setup:**  
- Set up an Okta developer account.
- Create an Okta application and obtain the **client ID** and **issuer**.
- Update the Okta credentials in the front-end and back-end `application.properties` or `application.yml` files:  
`okta.oauth2.client-id=your-client-id`  
`okta.oauth2.issuer=https://your-okta-domain/oauth2/default`

6. **Run the Back-End (Spring Boot):**  
In the project root, run the Spring Boot application:  
`./mvnw spring-boot:run`

7. **Run the Front-End (React):**  
Navigate to the `client` directory and start the React development server:  
`cd client`  
`npm start`

8. **Access the Application:**  
- The front-end will be running on `http://localhost:3000`.
- The back-end API will be available at `http://localhost:8080`.

Make sure the React app and Spring Boot server are running simultaneously.

### Optional: Build for Production

1. **Front-End Production Build:**  

To create a production-ready build of the React front-end:  
`npm run build`

2. **Deploy the Application:**  

Deploy the Spring Boot back-end and the front-end static files to your preferred server (Heroku, AWS, etc.).  
`./mvnw clean package`

## API Endpoints

- **GET /books**: Fetch all books from the library.
- **POST /books/reserve**: Reserve a book (authenticated users only).
- **POST /reviews**: Submit a review (authenticated users only).
- **GET /admin/books**: Admin functionality to manage the library collection.

## Deployment

1. **Front-End**:  
`npm run build`

2. **Back-End**: Deploy using your preferred method (e.g., Heroku, AWS).  
`./mvnw clean package`

3. **Run**:  
- Start both the front-end and back-end services and ensure they are connected properly.

## Conclusion

This Library Application provides a complete solution for managing a digital library, including book search, reservations, reviews, and admin management. With **Okta** for secure authentication and **Spring Boot**'s robust back-end capabilities, the system ensures scalability, security, and efficiency in managing both user and book data.
