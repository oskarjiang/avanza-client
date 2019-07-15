# Avanza Scraper
This app supports interraction with Avanza's API. Authentication is supported through BankID. Purpose is to scrape the data from the API and store it in a NoSQL database.

## Installation
### Using Docker
1. Create folder named *credentials* in project root
2. Create file named *credentials.ts* in the *credentials* folder with following content:
```javascript
  module.exports = {
      identificationNumber:"{YOUR_IDENTIFICATIONNUMBER}"
  }
```
3. In *src/data/PositionsDalc.ts* change address to the address of the mongodb container in Docker
4. Run `docker build --tag=avanza-scraper.` in root folder
5. Run `docker run -d -p 8080:8080 avanza-scraper`

## Usage
GET request to *localhost:8080* triggers scraping. Check logs (`docker logs -f {CONTAINER_NAME`) for authentication status

## Requirements
Docker installed with mongodb container running `docker run --name mongo -d mongo`
