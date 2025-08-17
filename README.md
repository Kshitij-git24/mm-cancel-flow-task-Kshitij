# mm-cancel-flow-task-Kshitij
Migrate Mate assessment 
To run this project you will have to follow the steps below:

1. Clone the repository
2. run the command “npm install”
3. run the command “supabase start”
4. create a .env file as suggested in the .env.example file and from the console add your supabase keys and API URL ro the NEXT_PUBLIC_SUPABASE_URL.
5. run the command “psql -h localhost -p 54322 -U postgres -d postgres -f seed.sql”
6. It will ask you for password, enter your postgres password (mine was postgres itself).
7. Now inside the createUser.js in the root directory paste the service_role key in the given variable and run that file using command “node createUser.js”
8. open the link from the terminal that says Studio URL.
If not visible in the terminal anymore you can easiy access all the keys and DB url by running the command “supabase status”.
9. run the command “npm run dev” and the web app is ready for testing. You can track the data being changed and persisted in the DB URL where you will see the entries belonging to the testuser changing as you interact with the app.

VIDEO LINK TO THE ENTIRE PROCESS:
https://www.loom.com/share/ec0d2f6aca994752b26380f673ede4e7?sid=0fa3f1db-21b9-4e22-b6de-4e5af198f095
(it's me following the above steps for you to see ;) )

Further aspects kept in mind while coding:
Use of Context

I used React Context (CancellationContext) to maintain a centralized state for the cancellation flow across different steps. Instead of passing props down multiple components, I stored user responses (selected options, text input, etc.) inside the context provider. This ensured consistency in data as the user navigated forward and backward between steps, and it also allowed me to persist partial progress if needed without losing state when components unmount/remount.

Use of Row Level Security (RLS) Policies

On the backend, I set up Supabase Row Level Security (RLS) policies to make sure that only the authenticated user can access or modify their own cancellation records. This prevents unauthorized access — for example, one user cannot view or update another user’s feedback. With RLS enabled, all database operations (inserts, updates, reads) are scoped to the currently logged-in user’s session, giving me a strong layer of security without manually writing complex role-based checks.

Data Persistence in Database

Once a user selects an option and provides their follow-up response, the data is written to Supabase and persisted in a Postgres database. Each cancellation record is tied to the user’s unique ID, ensuring traceability and relational integrity. By persisting the cancellation flow data, we can later analyze reasons for cancellation, measure trends (e.g., cost vs. platform usefulness), and potentially improve the product. The persisted data also makes it possible to resume or review a user’s cancellation flow later if needed.
