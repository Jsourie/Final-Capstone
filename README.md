The application is a reservation system for a restaurant, providing functionalities for creating, managing, and editing reservations, as well as seating and freeing up tables. It involves various user stories (US) that address different aspects of the reservation and seating process. 

Frontend:

React is used for building the frontend components.
Forms are created for reservation creation and editing.
Display pages for reservations, tables, and search results.

Backend:

Node.js with Express is likely used for building the backend server.
RESTful API for handling reservations, tables, and search functionality.
Database (likely PostgreSQL) for storing reservation and table data.
Database:

Reservations and tables tables in the database.
Foreign key references for associating reservations with tables.
Validation:

Backend validation for ensuring data integrity and adherence to business rules.
Frontend validation for providing a seamless user experience.

Testing:

Unit tests for backend API endpoints and functions.
End-to-end tests to validate the entire reservation flow.
User Interface:

Bootstrap or a similar framework for a responsive and visually appealing UI.
Error Handling:

Proper error handling and display of error messages to users.

Date and Time Handling:

Special attention to parsing and handling dates and times to prevent issues.


Navigation:
Allows user to interact with the different locations in the application:

![Final-Capstone Screenshot](Final-Capstone/Screenshot%202024-01-13%20at%202.24.42%20PM.png)



Create and Dashboard:

Creation of reservations through a form with required fields.
Display of reservation details on the dashboard, sortable by date and time.
Navigation through different dates with next, previous, and today buttons.
Validation checks for creating reservations on working days and in the future.
Error messages displayed on the /reservations/new page for validation failures.
Additional validation checks for creating reservations during business hours.
Error messages displayed on the /reservations/new page for validation failures.


![New Screenshot](Final-Capstone/Screenshot%202024-01-13%20at%202.28.30%20PM.png)


![Alt text](<img width="757" alt="Screenshot 2024-01-13 at 2 36 12 PM" src="https://github.com/Jsourie/Final-Capstone/assets/135664388/6749d85b-c55e-4306-a411-a233a98b1305">)




Seat reservation and create table:

Creation of tables with required fields.
Assigning a table to an existing reservation based on availability and capacity requirements.


![Alt text](<img width="757" alt="Screenshot 2024-01-13 at 2 31 03 PM" src="https://github.com/Jsourie/Final-Capstone/assets/135664388/ed5ed70a-f214-40b1-9d8c-c6444ef098fc">)



![Alt text](<img width="757" alt="Screenshot 2024-01-13 at 2 33 57 PM" src="https://github.com/Jsourie/Final-Capstone/assets/135664388/31b5c67e-a06e-42e8-826d-25e8e7dd62e4">)


Search

Allows user to search reservations by phone number.
Ability to edit, seat, or cancel based on search results.


![Alt text](<img width="757" alt="Screenshot 2024-01-13 at 2 37 58 PM" src="https://github.com/Jsourie/Final-Capstone/assets/135664388/2c8f80c6-5c00-491b-8d6f-514792447014">)




