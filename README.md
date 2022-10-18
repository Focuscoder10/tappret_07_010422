# Groupomania
## Requirements
```
node version 16
Database MariaDB ou MySQL
```
## Project Setup
```
git clone https://github.com/Focuscoder10/tappret_07_010422.git
cd tappret_07_010422
```
## Setup backend
```
cd backend
cp .env.example .env
npm i
```
### In .env
Fill in the connection information to the database\
Generate a secret key to secure the JWT

### Init database
Warning: this command resets your database
```
npm run reset
```
### Then start the server
```
npm run start
```
### Use the seeder
If you need to fill the database with dummy data
```
npm run seed
```
## Setup frontend
```
cd frontend
npm i
npm run start
```
