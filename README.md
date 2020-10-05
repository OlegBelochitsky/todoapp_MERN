<h1 align="center"> ✨ ToDo List App Backend✨ </h1>

> My first api ❤️

**note** This project was made for me to practice simple staff with MERN stack.

### Introduction

This API mannage tree structure todo's (each todo can have sub todo which are also  
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

Used for testing and development:

- Jest.js
- Supertest
- nodemon

##### Main features:

- Each todo can have a list of many todos.
- Todos are stored normalized.
- Support all methods (GET, POST, PUT, PATCH, DELETE).

### install & usage

##### dependencies:

Make sure you have node.js installed with npm.  
Have a url to your mongodb database.

##### install:

1.  Download the folder
2.  create .env file inside the folder.  
    example for .env file:

```bash
MONGODB_URL=mongodb://localhost/db
MONGODB_URL_TEST=mongodb://localhost/testdb
PORT=3000
PORT_TEST=3000
HOST=localhost
```

3. Make init_and_start.sh executable by running `chmod +x init_and_start.sh` from the folder.
4. Run `npm install` from inside your app directory.

##### usage:

To run tests: `npm run test`  
To run dev ( to run server with nodemon ): `npm run dev`

##### examples for requests:

###### example for todo JSON

```json
{
  "description": "A Todo List",
  "isRoot": true,
  "done":false,
  "subTodos": [
    {
      "description": "small todo",
      "done":true,
      "subTodos": []
    },
    {
      "description": "biger todo",
      "subTodos": [
        {
          "description": "sub todo",
          "subTodos": []
        },
        {
          "description": "another sub todo",
          "subTodos": [
            {
              "description": "sub sub todo",
              "done":true,
              "subTodos": []
            },
            {
              "description": "another sub sub todo",
              "subTodos": []
            }
          ]
        }
      ]
    }
  ]
}
```

###### GET
**note** the | json_pp is for pretty json.
```sh
curl -X GET 'http://localhost:3000/todo' | json_pp
# and for if u want to GET todo by id: 
# for example id is: df32e917015fdc9c1fb8
curl -X GET 'http://localhost:3000/todo/5f7adf32e917015fdc9c1fb8' | json_pp
```

###### POST

```sh
curl -d "@todo.json" -H "Content-Type: application/json" -X POST 'http://localhost:3000/todo' | json_pp
```

###### PUT
** not working properly yet
```sh 
curl -d "@todo.json" -H "Content-Type: application/json/" -X PUT 'http://localhost:3000/todo/5f7adf32e917015fdc9c1fb8' | json_pp
```

###### PATCH
** not working properly yet
```sh
curl -d "@todo.json" -H "Content-Type: application/json" -X PATCH 'http://localhost:3000/todo/5f7adf32e917015fdc9c1fb8' | json_pp
```

###### DELETE

```sh
curl -X DELETE 'http://localhost:3000/todo/5f7adf32e917015fdc9c1fb8' | json_pp
```
