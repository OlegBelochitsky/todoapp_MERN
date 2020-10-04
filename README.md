<h1 align="center"> ✨ ToDo List App Backend✨ </h1>

> My first api ❤️

### Introduction
This API mannage tree structure todo's (each todo can have subTodo which are also   
a todo) in MongoDB where each todo stored in normalized form.

This is the Backend part of the todo app MERN stack project  

##### MERN stack:  
Backend:
- node 
- Expess
- MongoDB and Mongoose 

Client:
- React 
> Link to Client: 🙂 [Coming soon ]()🙂

For testing and Development:
- Jest.js
- Supertest
- nodemon


##### Main features:

- Each todo can be a list of many todos.
- Todos are stored normalized.
- Support all mthods (GET, POST, PUT, PATCH, DELETE).
- request and respond with JSON.

![screenshot](https://)

### install & usage

##### dependencies:
Make sure you have node.js installed with npm.  
Have a url to your mongodb database.

##### install:  
 1) Download the folder 
 2) create .env file inside the folder  
example for .env file: 
```bash
MONGODB_URL=mongodb://localhost/db
MONGODB_URL_TEST=mongodb://localhost/testdb
PORT=3000
PORT_TEST=3000
HOST=localhost
```
3) Make init_and_start.sh executive by running `chmod +x init_and_start.sh` from the folder.
4) Run `npm install` from inside your app directory.

##### usage:

To run tests `npm run test`  
To run dev `npm run dev` 


















