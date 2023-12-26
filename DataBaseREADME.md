# AWS MySQL Database

## Introduction

The database for our project has transitioned from a local file to a remote AWS RDS MySQL database. This document provides instructions on setting up and working with the AWS MySQL database.

## Changes

- We have switched from SQLite to MySQL.
- The base server handling main queries has changed. Be mindful of using MySQL correctly when adding new functions.

## Installation

1. Install the MySQL package:

    ```bash
    npm install mysql
    ```

2. Obtain the `.env` file from a team member. This file contains sensitive information for connecting to the database. Copy it to the `Server` folder.

3. Install MySQL Workbench from the Ubuntu Software.

4. Running the Server:

   Ensure the server runs successfully and can retrieve data from the AWS MySQL database. Test the server's functionality for proper integration.

## Connecting to the Database in MySQL Workbench

1. **Open MySQL Workbench:**
   Launch MySQL Workbench on your system.

2. **Create a New Connection:**
   Click the **"+"** icon beside **"MySQL Connections"** on the home screen.

3. **Fill in Connection Details:**
   - **Connection Name:** Enter a descriptive name (e.g., "AWS RDS Database").
   - **Hostname:** Provide the AWS RDS MySQL database instance's endpoint.
   - **Port:** Use the default port **3306**.
   - **Username:** Enter the RDS instance's database username.
   - **Password:** Enter the corresponding password.

4. **Test Connection:**
   Click **"Test Connection"** to verify connectivity.

5. **Save Connection:**
   Click **"OK"** to save the connection details.

6. **Access the Database:**
   Double-click the saved connection to establish a connection to your AWS RDS MySQL database.

7. **Use the Database:**
   Once connected, explore and interact with the database using MySQL Workbench features, such as running SQL queries, managing tables and data, creating/editing database objects, and visualizing data models. To see table content, right-click on the table and select "Select Rows."
