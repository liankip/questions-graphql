# questions-graphql

Database Structure
---------------
In my case, i use mongodb in nodejs using mongoose. Name collections db_question
- db_question
  - questions
  - users

File Structure
---------------
- Index.js (root or index file)
  - server (folder schema and models)
    - models (models get data from mongodb)
      - question.js
      - user.js
    - schema (schema data, mutation and root query)
      - schema.js

Models
---------------
- question.js
  - get questions data and model from mongoDB

- user.js
  - get users data and model from mongoDB

Schema
---------------
- schema.js
  - graphql
  - dateStr (return date format like 11-29-2020 13:58:06 in query CreatedAt and UpdatedAt )
  - User (Get data user from model)
  - Question (Get data questions from model)
  - PaginationArgType (input paginate for api)
  - PaginatedListType (return data paginate after input)
  - QuestionType (relations to Usertype)
  - UserType (relations to QuestionType)
  - RootQuery (Root query for return list data after paginate)
  - Mutation (Add, Update Delete For question)

Get API
---------------

using http://localhost:4000/graphql

List Questions
```json
{
  questions(pagination: {offset: 0, limit: 4}) {
    count
    items {
      id
      question
      user {
        name
      }
    }
  }
}
```

Return Question
```json
{
  "data": {
    "questions": {
      "count": 17,
      "items": [
        {
          "id": "5fc0563539de6b10752ffae5",
          "question": "Where i find deadric bow on skyrim V",
          "user": {
            "name": "unknown"
          }
        },
        {
          "id": "5fc0562139de6b10752ffae4",
          "question": "Select one, play Cyberpunk 2077 or COD Black Ops Cold War",
          "user": {
            "name": "unknown"
          }
        },
        {
          "id": "5fc0560739de6b10752ffae3",
          "question": "Why anakin become to darkside",
          "user": {
            "name": "yoda"
          }
        },
        {
          "id": "5fc055f839de6b10752ffae2",
          "question": "How to secure my APIs",
          "user": {
            "name": "Haikal"
          }
        }
      ]
    }
  }
}
```

Add Questions
```json
mutation {
  addQuestion(uuid:"5fc04ee839de6b10752ffad3" question:"Add Question")  {
    id
    question
  }
}
```
note: uuid can get id from user collection on local mongodb

Return Add Question
```json
{
  "data": {
    "addQuestion": {
      "id": "5fc5cc81ef3b27398a8d745b",
      "question": "Add Question"
    }
  }
} 
```

Return Add Question if uuid not exists
```json
{
  "errors": [
    {
      "message": "Not Authorized",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": [
        "addQuestion"
      ]
    }
  ],
  "data": {
    "addQuestion": null
  }
}
```

Update Questions
```json
mutation {
  updateQuestion(id:"5fc5cc81ef3b27398a8d745b", 
    uuid: "5fc04ee839de6b10752ffad3", question:"Add Question") 
  {
    id
    question
  }
}
```

Return Update Questions
```json
{
  "data": {
    "updateQuestion": {
      "id": "5fc5cc81ef3b27398a8d745b",
      "question": "Update Question"
    }
  }
}
```

Return Update Question if uuid not exists
```json
{
  "errors": [
    {
      "message": "Not Authorized",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": [
        "updateQuestion"
      ]
    }
  ],
  "data": {
    "updateQuestion": null
  }
}
```

Delete Questions
```json
mutation {
  deleteQuestion(id:"5fc5cc81ef3b27398a8d745b") 
  {
    id
    question
  }
}
```

Return Delete Questions
```json
{
  "data": {
    "deleteQuestion": {
      "id": "5fc5cc81ef3b27398a8d745b",
      "question": "Add Question"
    }
  }
}
```

Return delete Questions if uuid not exists
```json
{
  "errors": [
    {
      "message": "Not Authorized",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": [
        "deleteQuestion"
      ]
    }
  ],
  "data": {
    "deleteQuestion": null
  }
}
```