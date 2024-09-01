### Website Management System

The `website.js` file contains the logic for managing websites in the backend of the application. Below is a detailed explanation of the key functionalities provided by this file:

### Controllers

- **[Add Website](#add-website)**: `addWebsite(req, res)`
- **[Get User Websites](#get-user-websites)**: `getUserWebsites(req, res)`
- **[Update User Websites](#update-user-websites)**: `updateUserWebsites(req, res)`
- **[Get Latest Website Updates](#get-latest-website-updates)**: `getLatestWebsiteUpdates(req, res)`
- **[Delete Website](#delete-website)**: `deleteWebsite(req, res)`
- **[Get Website Status](#get-website-status)**: `getWebsiteStatus(req, res)`

#### Add Website
Adds a new website to the user's monitored list.
- **Route**: `POST /websites`
- **Request Body**: `{ domainName }`
- **Response**: `{ success, message, website }`

#### Get User Websites
Retrieves the list of websites monitored by the user.
- **Route**: `GET /websites`
- **Response**: `{ success, websites }`

#### Update User Websites
Updates the status of all websites monitored by the user.
- **Route**: `PUT /websites`
- **Response**: `{ success, message }`

#### Get Latest Website Updates
Retrieves the latest updates for the websites monitored by the user.
- **Route**: `GET /websites/updates`
- **Response**: `{ success, websites }`

#### Delete Website
Deletes a website from the user's monitored list.
- **Route**: `DELETE /websites/:websiteId`
- **Response**: `{ success, message }`

#### Get Website Status
Checks and retrieves the current status of a specific website.
- **Route**: `GET /websites/:websiteId/status`
- **Response**: `{ success, website }`

### Schema

The `website.js` file in the models directory defines the schema for the `Website` model, which is used to store information about the websites being monitored. The schema includes the following fields:

- **domainName**: The domain name of the website being monitored. This field is required.
- **sslStatus**: The SSL status of the website, with a default value of 'Unknown'.
- **expiryDate**: The expiry date of the website's SSL certificate.
- **lastChecked**: The date and time when the website was last checked. This field defaults to the current date and time.
- **isAvailable**: A boolean indicating whether the website is currently available. This field defaults to `true`.
- **user**: A reference to the `User` model, indicating the user who is monitoring the website. This field is required.