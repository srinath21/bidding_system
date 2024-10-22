# Bidding System

## Setup

### React
1. Installing necessary dependencies:
   Switch to bidding-application-frontend: `cd bidding-application-frontend`
   Install the Dependencies: `npm install`
2. Running the local development server
   Start the application: `npm run dev`
   Application will be available at the default Vite port 5173
3. Open the application in the browser at the url: `http://localhost:5173`

### NodeJS with Express and Prisma (ORM)
1. Installing necessary dependencies:
   Switch to bidding-application-backend: `cd bidding-application-backend` 
   Install the Dependencies: `npm install`
2. Setting up the DB connection:
   - Open the `schema.prisma` file under `prisma` folder
   - The DB connection details will be under the section `datasource` in the below format
     ```
     datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
     }
     ```
     The provider property corresponds to the Database Server being used, in this project's case, it is `postgres`, hence the appropriate provider is configured
     The url property is the Database Connection String, which is generally of the format `postgresql://{username}:{password}@localhost:5432/{DatabaseName}?schema=public`
     The url can be placed directly in this file or as part the environment variables
3. Migrating DB Schema from Prisma to the database:
   - Ensure the database provided in the connection string is present in the appropriate database server instance
   - Run the command `npx prisma db push` to apply the schema changes to your database.
4. Run the backend server by executing the command: `npm start`
   - This starts the express server at port `3000`
  

```
Note: The REST API URLs are hardcoded in the React App as of now, and not part of a configuration file
```
