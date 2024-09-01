### Authentication System

The `auth.js` file contains the authentication and user management logic for the backend of the application. Below is a detailed explanation of the key functionalities provided by this file:

### Controllers

- **[Signup](#signup)**: `signup(req, res)`
- **[Verify Email](#verify-email)**: `verifyEmail(req, res)`
- **[Login](#login)**: `login(req, res)`
- **[Forgot Password](#forgot-password)**: `forgotPassword(req, res)`
- **[Reset Password](#reset-password)**: `resetPassword(req, res)`
- **[Check Auth](#check-auth)**: `checkAuth(req, res)`
- **[Logout](#logout)**: `logout(req, res)`
- **[Change Username](#change-username)**: `changeUsername(req, res)`
- **[Change Email](#change-email)**: `changeEmail(req, res)`
- **[Delete Account](#delete-account)**: `deleteAccount(req, res)`

#### Signup
Registers a new user, hashes their password, generates a verification token, and sends a verification email.
- **Route**: `POST /signup`
- **Request Body**: `{ email, password, username }`
- **Response**: `{ success, message, user }`

#### Verify Email
Verifies the user's email using a token sent to their email address.
- **Route**: `POST /verify-email`
- **Request Body**: `{ code }`
- **Response**: `{ success, message, user }`

#### Login
Authenticates a user by checking their email and password, and generates a JWT token.
- **Route**: `POST /login`
- **Request Body**: `{ email, password }`
- **Response**: `{ success, message, user }`

#### Forgot Password
Generates a password reset token and sends it to the user's email.
- **Route**: `POST /forgot-password`
- **Request Body**: `{ email }`
- **Response**: `{ success, message }`

#### Reset Password
Resets the user's password using the token sent to their email.
- **Route**: `POST /reset-password/:token`
- **Request Body**: `{ password }`
- **Response**: `{ success, message }`

#### Check Auth
Checks if the user is authenticated by verifying their JWT token.
- **Route**: `GET /check-auth`
- **Response**: `{ success, user }`

#### Logout
Logs the user out by clearing the JWT token cookie.
- **Route**: `POST /logout`
- **Response**: `{ success, message }`

#### Change Username
Allows the user to change their username.
- **Route**: `POST /change-username`
- **Request Body**: `{ newUsername }`
- **Response**: `{ success, message, user }`

#### Change Email
Allows the user to change their email and re-verifies the new email.
- **Route**: `POST /change-email`
- **Request Body**: `{ newEmail }`
- **Response**: `{ success, message, user }`

#### Delete Account
Deletes the user's account and their monitored websites.
- **Route**: `DELETE /delete-account`
- **Response**: `{ success, message }`

### Schema

The `auth.js` file in the models directory defines the schema for the `User` model, which is used to store information about the users. The schema includes the following fields:

- **email**: The email address of the user. This field is required and must be unique.
- **password**: The hashed password of the user. This field is required.
- **username**: The username of the user. This field is required and must be unique.
- **isVerified**: A boolean indicating whether the user's email has been verified. This field defaults to `false`.
- **createdAt**: The date and time when the user was created. This field defaults to the current date and time.
- **domains**: An array of references to the `Website` model, indicating the websites monitored by the user.
- **resetPasswordToken**: A token used for resetting the user's password.
- **resetPasswordExpires**: The expiry date and time for the password reset token.
- **verificationToken**: A token used for verifying the user's email.
- **verificationTokenExpires**: The expiry date and time for the verification token.