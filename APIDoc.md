# API Documentation

## Create User

This endpoint allows you to create a new user.

- **Endpoint:** `/api/users/`
- **Method:** `POST`

### Request

#### Headers
- **Content-Type:** `application/json`

#### Request Body
```json
{
  "FirstName": "Test3",
  "LastName": "Test3",
  "EmailID": "test3@test.com",
  "Password": "Password@1",
  "EmailSubscription": false
}
```
#### Response
1. Success Response
```json
{
  "result": {
    "FirstName": "Test3",
    "LastName": "Test3",
    "EmailID": "test3@test.com",
    "EmailSubscription": false,
    "CreatedTime": "2024-10-22T08:02:12.238Z"
  },
  "success": true
}
```
2. Failure Response
```json
{
  "success": false,
  "error": "EmailID already exists"
}
```

## User Login

This endpoint allows a user to login to the application.

- **Endpoint:** `/api/users/login`
- **Method:** `POST`

### Request

#### Headers
- **Content-Type:** `application/json`

#### Request Body
```json
{
  "EmailID":"test@test.com",
  "Password":"Password@1"
}
```
#### Response
1. Success Response
```json
{
    "success": true,
    "result": {
        "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE3Mjk1ODQ1MTgsImV4cCI6MTcyOTU4ODExOH0.ih8ZzBcHcDiWshDkuuDY1fue2RkB0op8cxYB6J_v45o",
        "emailID": "test@test.com",
        "firstName": "test",
        "lastName": "test"
    }
}
```
2. Failure Response
```json
{
    "error": "Invalid credentials",
    "success": false
}
```

## User Profile Details

This endpoint allows user to get the details of the account.

- **Endpoint:** `/api/users/`
- **Method:** `GET`

### Request

#### Headers
- **Authorization:** `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE3Mjk1ODQ3MjQsImV4cCI6MTcyOTU4ODMyNH0.XXfLpocizpCGNA_gRSJdagdi6Yf1v5I7llEBnN3cHpg`
- **Content-Type:** `application/json`

#### Response
```json
{
    "result": {
        "FirstName": "test",
        "LastName": "test",
        "EmailID": "test@test.com",
        "EmailSubscription": false,
        "CreatedTime": "2024-10-20T14:43:30.112Z"
    },
    "success": true
}
```

## User Profile Update

This endpoint allows user to change the account password.

- **Endpoint:** `/api/users/`
- **Method:** `PATCH`

### Request
```json
{
    "FirstName": "test1",
    "LastName": "test1",
    "EmailID": "test@test.com"
}
```

#### Headers
- **Authorization:** `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE3Mjk1ODQ3MjQsImV4cCI6MTcyOTU4ODMyNH0.XXfLpocizpCGNA_gRSJdagdi6Yf1v5I7llEBnN3cHpg`
- **Content-Type:** `application/json`

#### Response
```json
{
    "result": {
        "FirstName": "test1",
        "LastName": "test1",
        "EmailID": "test@test.com",
        "EmailSubscription": false,
        "CreatedTime": "2024-10-20T14:43:30.112Z"
    },
    "success": true
}
```

## Change Password

This endpoint allows you to create a new user.

- **Endpoint:** `/api/users/changepassword`
- **Method:** `POST`

### Request
```json
{
    "OldPassword": "Password@1",
    "UpdatedPassword": "Password@2"
}
```

#### Headers
- **Authorization:** `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE3Mjk1ODQ3MjQsImV4cCI6MTcyOTU4ODMyNH0.XXfLpocizpCGNA_gRSJdagdi6Yf1v5I7llEBnN3cHpg`
- **Content-Type:** `application/json`

#### Response
```json
{
    "success": true
}
```
