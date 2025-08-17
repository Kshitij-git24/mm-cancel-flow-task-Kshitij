# mm-cancel-flow-task-Kshitij
Migrate Mate assessment 
To run this project you will have to follow the steps below:

1. Clone the repository
2. run the command “npm install”
3. run the command “supabase start”
4. create a .env file as suggested in the .env.example file and from the console add your supabase keys and API URL ro the NEXT_PUBLIC_SUPABASE_URL.
5. run the command “psql -h localhost -p 54322 -U postgres -d postgres -f seed.sql”
6. Now inside the createUser.js in the root directory paste the service_role key in the given variable and run that file using command “node createUser.js”
7. open the link from the terminal that says DB URL.
If not visible in the terminal anymore you can easiy access all the keys and DB url by running the command “supabase status”.
8. run the command “npm run dev” and the web app is ready for testing. You can track the data being changed and persisted in the DB URL where you will see the entries belonging to the testuser changing as you interact with the app.
