# Movie Ticket Booking System

A **Movie Ticket Booking System** built with Express.Js, TypeScript, Kysely, Better-sqlite3, Zod, Lodash. The system will allow users to book tickets for movies and administrators to perform a few basic management tasks.

---

## Features

- **Movies**: get a list of movies with their title and year by providing a list of their IDs (e.g., /movies?id=1,2,3)
- **Screening**: Screenings includes session information (timestamp, number of tickets, number of tickets left) and movie: (title and year).
- **Ticket**: Create a booking (ticket) for movie screening that has some tickets left
- **User**: user, administrator
- **Storage**: Data are stored in Sqlite database.
- **Error Handling**: Displays error messages for invalid operations.

---

## Technologies Used

- **Express.js**: Fast, unopinionated, minimalist web framework for Node.js
- **TypeScript**: Strongly typed JavaScript for better code quality.
- **Kysely**: The type-safe SQL query builder for TypeScript.
- **Better-sqlite3**: Powerful, efficient, and easy-to-use SQLite library for Node.js
- **Zod**: TypeScript-first schema validation with static type inference.
- **Lodash**: A modern JavaScript utility library for working with arrays, numbers, objects, strings, etc
- **date-fns**: For date formatting and manipulation.

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/ho_proj_peer_prog.git
   cd ho_proj_peer_prog

   ```

2. Install dependencies:
   npm install

3. Run the development server:
   npm run serve

4. Open the app in your browser:
   http://localhost:3000

## Project Structure

## Key Files

## Usage

1. Create new screening:

   a) data inputs:

   - user id
   - movie id
   - screening time stamp as date and time
   - screening viewers capacity

   b) requirements/ validation:

   - user id (positive integer) has role = administrator
   - movie id (positive integer) existing in the Movies database table,
   - screening time stamp (date time as string convertible to ISO format), date must be from future
   - screening viewers capacity (positive integer)

   c) output:

   - id (screening)
   - movie: name and year
   - screening date and screening time
   - capacity
   - available free seats (as calculated value from bookings)

   d) Screening schema:

   - id (primary key, self increment, positive integer )
   - movie id (positive integer) referencing Movies database table
   - date (date as string)
   - time (time as string)
   - capacity (positive integer)

2. Get screening by ID:
   a) input data

   - id (screening)

   b) requirements/ validation:

   - id (screening)

   c) output:

   - id (screening)
   - movie: name and year
   - screening date and screening time
   - capacity
   - available free seats (as calculated value from bookings)

3. Get all screenings:
   a) input data

   - id (screening)

   b) requirements/ validation:

   - id (screening)

   c) output:

   - list of screenings with data:
     -- id (screening)
     -- movie: name and year
     -- screening date and screening time
     -- capacity
     -- available free seats (as calculated value from bookings)

4. Delete screening:

   a) data inputs:

   - user id
   - valid screening id (positive integer) existing in the Screening database table

   b) requirements/ validation:

   - user id (positive integer) has role = administrator
   - valid screening id (positive integer) existing in the Screening database table
     -- screening needs to be empty (no free seats) (calculated value from bookings)

   c) output (deleted report):

   - id (screening)
   - movie: name and year
   - screening date and screening time
   - capacity

5. Create a booking (ticket):

   a) data inputs:

   - user id
   - screening id
   - number of seats to be booked / e.g. number of tickets

   b) requirements/ validation:

   - user id (positive integer) has role = user
   - screening id (positive integer) existing in the screening database table,
     -- screening time stamp needs to be from future
     -- screening needs to have enough free seats
   - number of seats to be booked (positive integer)

   c) output:

   - id (ticket)
   - screening id
   - movie: name and year
   - screening date and screening time
   - number of booked seats

   d) Ticket schema:

   - id (primary key, self increment, positive integer )
   - screening id (positive integer) referencing Screening database table
   - booked seats (positive integer)

6. Get users list of bookings:
   a) input data

   - user id

   b) requirements/ validation:

   - user id (positive integer) has role = user

   c) output:

   - list of tickets (id (ticket), screening id, movie: name and year, screening date and screening time, number of booked seats)

7. Get list of movies:
   a) input data

   - list of movie id's

   b) requirements/ validation:

   - movie id (positive integer)

   c) output:

   - list of movies (id (movie), title, year)

8. Create a user:
   a) input data

   - user name
   - user role

   b) requirements/ validation:

   - movie id (positive integer)

   c) output:

   - id (user)
   - user name
   - user role

   d) User schema:

   - id (primary key, self increment, positive integer )
   - user name (string, not null)
   - user role (administrator or user)

9. Get user by ID:
   a) input data

   - id (user)

   b) requirements/ validation:

   - user name (string)
   - user role (administrator or user)

   c) output:

   - id (user)
   - user name
   - user role

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Setup

**Note:** For this exercise, we have provided an `.env` file with the database connection string. Normally, you would not commit this file to version control. We are doing it here for simplicity and given that we are using a local SQLite database.

## Migrations

Before running the migrations, we need to create a database. We can do this by running the following command:

```bash
npm run migrate:latest
```

## Running the server

In development mode:

```bash
npm run dev
```

In production mode:

```bash
npm run start
```

## Updating types

If you make changes to the database schema, you will need to update the types. You can do this by running the following command:

```bash
npm run generate-types
```
