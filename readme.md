# Settings

## Firebase
- [Firebase Console](https://console.firebase.google.com)
- [Cloud Console - Functions](https://console.cloud.google.com/functions)

**Important:** Firebase Hosting supports Cloud Functions in us-central1 only (2020).

### Database
#### Add 
#### Rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
  	function isSignedIn() {
      return request.auth.uid != null;
    }
    function existingData() {
      return resource.data;
    }
    function incomingData() {
      return request.resource.data;
    }
    function validateData() {
      return incomingData().name is string && incomingData().name.size() > 2;
    }
    match /emails/{document=**} {
      allow read, delete, update: if isSignedIn();
      allow create: if validateData();
    }
  }
}
```

## GMail

### Common
[Check Gmail through other email platforms](https://support.google.com/mail/answer/7126229)

### Troubleshooting
* [Enable less secure app access](https://myaccount.google.com/lesssecureapps)
* [Unlock Captcha](https://accounts.google.com/b/0/displayunlockcaptcha)


# Production
## index.js
1. EMAIL_FIELD    'tvtqk' -> 'your-field'  
1. ALLOWED_ORIGIN '*'     -> 'your-domain'
## Deploy
```
> cd functions
> firebase login
> firebase deploy
```
after modifications
```
> firebase deploy --only functions
``` 

# To-Do
1. [ ] function isSpam        -> request.body.contans(<a /> || <script />)
1. [ ] js                     -> ts
1. [ ] then                   -> async/await  + try/catch

---
# Inspired by
- https://stackoverflow.com/questions/24098461/nodemailer-gmail-what-exactly-is-a-refresh-token-and-how-do-i-get-one/24123550
- https://masashi-k.blogspot.com/2013/06/sending-mail-with-gmail-using-xoauth2.html
- https://blog.mailtrap.io/nodemailer-gmail/

Database Rules

- https://fireship.io/snippets/firestore-rules-recipes/
- https://stackoverflow.com/questions/51916848/achieving-granular-data-validation-in-firestore-document?rq=1
- https://softauthor.com/firestore-security-rules