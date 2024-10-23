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
### Response
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
### Response
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

### Response
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

### Response
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

### Response
1. Success Response
```json
{
  "success": true
}
```
2. Failure Response
```json
{
  "error": "Password is invalid",
  "success": false
}
```

## Notifications
This API fetches the notifications for the user

- **Endpoint:** `/api//notifications`
- **Method:** `GET`

### Request

#### Headers
- **Authorization:** `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE3Mjk1ODQ3MjQsImV4cCI6MTcyOTU4ODMyNH0.XXfLpocizpCGNA_gRSJdagdi6Yf1v5I7llEBnN3cHpg`
- **Content-Type:** `application/json`

### Response
```json
{
  "result": [
      {
          "Message": "test2 test2 has bid 11 for adfadadfa"
      },
      {
          "Message": "test2 test2 has bid 11 for adfadadfa"
      }
  ],
  "success": true
}
```

## Get All Auctions
This API fetches all the available auctions specific to the user (that the user can be bid on) if the token is passed in the request or fetches all the auctions if the token is not passed

- **Endpoint:** `/api/auctions/all`
- **Method:** GET

### Request

#### Headers
- **Authorization (optional):** `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE3Mjk1ODQ3MjQsImV4cCI6MTcyOTU4ODMyNH0.XXfLpocizpCGNA_gRSJdagdi6Yf1v5I7llEBnN3cHpg`
- **Content-Type:** `application/json`

### Response
```json
{
  "result":
    [
      {
        "Code":2,
        "ProductName":"adfadadfa",
        "ProductDescription":"asdfds",
        "ProductImages":"",
        "CloseTime":"2024-10-30T18:30:00.000Z",
        "MinimumAmount":"213",
        "CreatedTime":"2024-10-21T13:52:09.316Z",
        "CurrentBid":"600"
      }
    ],
  "success":true
}
```

## Create Auction
This API allows user to create an auction for a product

- **Endpoint:** `/api/auctions`
- **Method:** POST

### Request

`Form Data is passed`

#### Headers
- **Authorization:** `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE3Mjk1ODQ3MjQsImV4cCI6MTcyOTU4ODMyNH0.XXfLpocizpCGNA_gRSJdagdi6Yf1v5I7llEBnN3cHpg`
- **Content-Type:** `multipart/form-data`

### Response
```json
{
  "result":{
    "Code":6,
    "ProductName":"Product 5",
    "ProductDescription":"Product 5 Description",
    "ProductImages":"",
    "CloseTime":"2024-10-26T18:30:00.000Z",
    "MinimumAmount":"100",
    "CreatedTime":"2024-10-23T18:03:04.067Z"
  },
  "success":true
}
```

## Get Auction Details
This API allows user to fetch the auction details for a product

- **Endpoint:** `/api/auctions/{auctionCode}`
- **Method:** GET

### Request

#### Headers
- **Authorization:** `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE3Mjk1ODQ3MjQsImV4cCI6MTcyOTU4ODMyNH0.XXfLpocizpCGNA_gRSJdagdi6Yf1v5I7llEBnN3cHpg`
- **Content-Type:** `application/json`

### Response
```json
{
  "result": {
    "Code":3,
    "ProductName":"Product 2",
    "ProductDescription":"Product 2 Description",
    "ProductImages":"",
    "CloseTime":"2024-10-30T19:30:00.000Z",
    "MinimumAmount":"500",
    "CreatedTime":"2024-10-23T17:39:46.396Z"
  },
  "success":true
}
```

## Update Auction Details
This API allows user to update the auction details for a product

- **Endpoint:** `/api/auctions/{auctionCode}`
- **Method:** PATCH

### Request
`Form Data is passed`

#### Headers
- **Authorization:** `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE3Mjk1ODQ3MjQsImV4cCI6MTcyOTU4ODMyNH0.XXfLpocizpCGNA_gRSJdagdi6Yf1v5I7llEBnN3cHpg`
- **Content-Type:** `multipart/form-data`

### Response
```json
{
  "result":{
    "Code":6,
    "ProductName":"Product 5",
    "ProductDescription":"Product 5 Description",
    "ProductImages":"",
    "CloseTime":"2024-10-26T18:30:00.000Z",
    "MinimumAmount":"100",
    "CreatedTime":"2024-10-23T18:03:04.067Z"
  },
  "success":true
}
```

## Delete Auction Details
This API allows user to delete the auction details for a product

- **Endpoint:** `/api/auctions/{auctionCode}`
- **Method:** DELETE

### Request

#### Headers
- **Authorization:** `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE3Mjk1ODQ3MjQsImV4cCI6MTcyOTU4ODMyNH0.XXfLpocizpCGNA_gRSJdagdi6Yf1v5I7llEBnN3cHpg`
- **Content-Type:** `application/json`

### Response
```json
{
  "result":{
    "Code":6,
    "ProductName":"Product 5",
    "ProductDescription":"Product 5 Description",
    "ProductImages":"",
    "CloseTime":"2024-10-26T18:30:00.000Z",
    "MinimumAmount":"100",
    "CreatedTime":"2024-10-23T18:03:04.067Z"
  },
  "success":true
}
```

## Bid
This API allows user to place a bid for an auction

- **Endpoint:** `/api/bids`
- **Method:** POST

### Request
```json
{
  "AuctionCode":"2",
  "StraightBidAmount":100,
  "MaximumBidAmount":100
}
```

#### Headers
- **Authorization:** `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE3Mjk1ODQ3MjQsImV4cCI6MTcyOTU4ODMyNH0.XXfLpocizpCGNA_gRSJdagdi6Yf1v5I7llEBnN3cHpg`
- **Content-Type:** `application/json`

### Response
```json
{
  "result": {
    "Code": 12,
    "AuctionCode": 2,
    "StraightBidAmount": "100",
    "MaximumBidAmount": "100",
    "CreatedTime": "2024-10-23T18:16:07.424Z"
  },
  "success":true
}
```

## Get All Bids
This API fetches all the bids placed by the user

- **Endpoint:** `/api/bids/all`
- **Method:** GET

### Request

#### Headers
- **Authorization:** `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE3Mjk1ODQ3MjQsImV4cCI6MTcyOTU4ODMyNH0.XXfLpocizpCGNA_gRSJdagdi6Yf1v5I7llEBnN3cHpg`
- **Content-Type:** `application/json`

### Response
```json
{
  "result": [
    {
      "StraightBidAmount": "100",
      "MaximumBidAmount": "100",
      "Auction": {
        "Code": 2,
        "ProductName": "adfadadfa",
        "ProductDescription": "asdfds",
        "ProductImages": "",
        "MinimumAmount": "213",
        "CloseTime": "2024-10-30T18:30:00.000Z"
      }
    },
    {
      "StraightBidAmount": "500",
      "MaximumBidAmount": "500",
      "Auction": {
        "Code": 2,
        "ProductName": "adfadadfa",
        "ProductDescription": "asdfds",
        "ProductImages": "",
        "MinimumAmount": "213",
        "CloseTime": "2024-10-30T18:30:00.000Z"
      }
    }
  ],
  "success": true
}
```

## Get All Bids for an Auction
This API fetches all the bids placed for an Auction

- **Endpoint:** `api/bids/auction/{auctionCode}`
- **Method:** GET 

### Request

#### Headers
- **Authorization:** `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE3Mjk1ODQ3MjQsImV4cCI6MTcyOTU4ODMyNH0.XXfLpocizpCGNA_gRSJdagdi6Yf1v5I7llEBnN3cHpg`
- **Content-Type:** `application/json`

### Response
```json
{
  "result": [
    {
      "AuctionCode": 2,
      "StraightBidAmount": "123",
      "MaximumBidAmount": "1231",
      "User": {
        "FirstName": "test2",
        "LastName": "test2",
        "IsCurrentUser": false
      }
    },
    {
      "AuctionCode": 2,
      "StraightBidAmount": "123",
      "MaximumBidAmount": "1231",
      "User": {
        "FirstName": "test2",
        "LastName": "test2",
        "IsCurrentUser": false
      }
    },
    {
      "AuctionCode": 2,
      "StraightBidAmount": "55",
      "MaximumBidAmount": "132",
      "User": {
        "FirstName": "test1",
        "LastName": "test1",
        "IsCurrentUser": true
      }
    }
  ],
  "success": true
}
```