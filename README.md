# AAD-shopping-list-db

## Installation

Ensure that you have the LTS version (18.12.1) [Node.js](https://nodejs.org/en/) installed.

- Clone the repository
- Install dependencies
```
npm install
```
- Run the app
```
npm start
```

- Create "default.ts" file under config/
```
export default {
  dbUri: 'mongodb://127.0.0.1:27017/shopping-list',
};
```
- Connect to a MongoDB deployment "mongodb://localhost:27017/shopping-list"

## Security

Generate and encode keys for verification
- [Generate RSA keys](https://travistidwell.com/jsencrypt/demo/)
- [Encode into base64](https://www.base64encode.org/)

Place encoded keys into .env file, refer to .env.sample
