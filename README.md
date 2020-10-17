# REST Using Node

This is a Node based app to create REST API and swagger documentation. The app uses MariaDB and AWS Lambda function for backend.

## Setup
 - Install MariaDB: [Download Link](https://downloads.mariadb.com/MariaDB/mariadb-10.5.6/winx64-packages/mariadb-10.5.6-winx64.msi)
 - Open Console and navigate to the bin folder of MariaDB installation
 - Execute below commands:
   ```
   $ curl https://www.w3resource.com/sql/sample-database-of-sql-in-mysql-format.txt --output db.sql
   $ mysql -u root -p
   $ CREATE DATABASE sample;
   $ exit;
   $ mysql -u root -p sample < db.sql
   ```
 - Clone the repo
 - Execute below command to install node packages:
	```$ npm install```
 
## Starting Server
#### Starting Maria DB server
 - Open Console and navigate to the bin folder of MariaDB installation
 - Execute below command to start Maria DB server
    ```$ mysql -u root -p sample```
 
#### Starting Node server
 - Open Console and navigate to local repo
 - Execute below command to start Node server
    ```$ node server.js```
 
## Testing the REST APIs
Once the Node server has started use this [Swagger Link](http://localhost:3000/docs/) to test.
