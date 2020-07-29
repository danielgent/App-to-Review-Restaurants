## Demo full-stack application for reviewing restaurants

### Functionality
Three types of user roles:
  * Normal User: Can rate and leave a comment once for any restaurant
  * Restaurant Owner: Can create restaurants, and reply to comments for own restaurants
  * Admin: Can CRUD everything

Users can sign up and then login. An email is sent first to verify the email account, but also Google sign-on is supported
Different user roles will see different home pages.
Normal users will see a list of all the restaurants which they can then filter by average rating
Restaurant owners will see a list of their restaurants and also reviews that they haven't replied to

There's some moderate brute force protection (after 3 failed logins, only the admin can unblock an account)

A user can upload their profile picture, and this is pulled from Google initially if they sign in this way.

It's also possible to interact with the backend API directly
    
### Technology
React on the front-end (using create-react-app), Mongo on the backend.
Chakra-ui and some material-ui components
Mongo and Mongoose for persistence
Express for API server
Send-grid for sending confirmation emails
Multer for uploading images with Express


### Tests
* Almost full test coverage for API using supertest
* Cypress e2e tests for user, admin, and owner flows
* some unit tests.  None of the components are very complex so I just put some unit tests in there.

### Demo
https://www.loom.com/share/c8d5f758d5b249c3a6b7ff2854561516

### Configuration
Copy .env.sample to .env and enter correct values
DEMO_MODE: prefills the database so it's ready to demo
EXTENDED_DEMO_MODE: adds even more fixtures!



### Areas I could improve
* there's obviously lots, but in terms of security, this site isn't secure.
It has protection against CSRF because it doesn't use cookies and only uses JWT
But it doesn't have protection against malicious JavaScript (XSS) because the JWT is stored in local storage and thus could be read by anything off that page (e.g. Chrome extensions, compromised NPM packages)
As a solution I'd want to use HTTP only cookies but the API can also be connected to with postman (see tests) so I'd have to think about this




Rest of CRA readme has been moved to cra-readme.md
Rename readme.md => cra-readme.md.  


