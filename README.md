# Avanza Scraper
This app supports interraction with Avanza's API. Authentication is supported through BankID. Purpose is to scrape the data from the API and store it in a NoSQL database.

## Installation

1. Clone repository
2. Create folder named *credentials* in project root
3. Create file named *credentials.ts* in the *credentials* folder with following content:
```javascript
  module.exports = {
      identificationNumber:"{YOUR_IDENTIFICATIONNUMBER}"
  }
```
4. Execute `npm install` in root folder
5. Compile *.ts* files using `tsc` command in root folder
6. Execute `npm start` in root folder

## Requirements
Typescript installed globally (*npm i -g typescript*)
