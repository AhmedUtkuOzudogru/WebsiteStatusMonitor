# Website Monitoring and User Management System

This project is a web application designed for monitoring website statuses. It includes features for user authentication, website monitoring, and automated tasks for data maintenance.

## Key Features
- **User Authentication**: Signup, login, password reset, email change, username change, and account deletion.
- **Website Monitoring**: Add websites, retrieve monitored websites, update website statuses, delete websites, and get real-time status updates.
- **Scheduled Tasks**: Automatic cleanup of unverified users and scheduled updates of website statuses.
- **Security**: Password hashing, JWT for authentication, and email verification for account changes.

## Technologies Used
- **Backend**: Node.js, Express
- **Database**: MongoDB (using Mongoose ORM)
- **Authentication**: JWT
- **Email**: Nodemailer
- **Website Status Monitoring**: SSL-checker
- **Other**: CORS, dotenv

## How to Run
1. **Clone the repository**:
   ```sh
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
### Install dependencies:  
```sh 
npm install
```
Set up environment variables: Create a .env file in the root directory and add the necessary environment variables. 
Example:  
```sh 
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
NODE_ENV=production
CLIENT_URL=http://localhost:5173
API_URL=http://localhost:5000
```
Build the application:  
```sh
npm run build
```
Start the server:  
```sh
npm run start
```
The server will start running, and you can access the application through the specified port.
# Website Status Monitor
This project is a MERN stack web application designed for monitoring website statuses. It includes features for user authentication, 
website monitoring, and automated tasks for website maintenance.

## Key Features
- **User Authentication**: Signup, login, password reset, email change, username change, and account deletion.
- **Website Monitoring**: Add websites, retrieve monitored websites, update website statuses, delete websites, and get real-time status updates.
- **Scheduled Tasks**: Automatic cleanup of unverified users and scheduled updates of website statuses.
- **Security**: Password hashing, JWT for authentication, and email verification for account changes.

## Technologies Used
- **Backend**: Node.js, Express
- **Database**: MongoDB (using Mongoose ODM)
- **Authentication**: JWT
- **Email**: Nodemailer
- **Website Status Monitoring**: SSL-checker API
- **Other**: CORS, dotenv

## How to Run
1. **Clone the repository**:
   ```sh
   git clone https://github.com/AhmedUtkuOzudogru/WebsiteStatusMonitor.git
   cd WebsiteStatusMonitor
### Install dependencies:  
```sh 
npm install
```
Set up environment variables: Create a .env file in the root directory and add the necessary environment variables. 
Example:  
```sh 
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
NODE_ENV=production
CLIENT_URL=http://localhost:5173
API_URL=http://localhost:5000
```
Build the application:  
```sh
npm run build
```
Start the server:  
```sh
npm run start
```
The server will start running, and you can access the application through the specified port.