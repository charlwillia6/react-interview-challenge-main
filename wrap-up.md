## Questions

### What issues, if any, did you find with the existing code?

There were some type safety issues and missing error handling in the transaction handlers. 

I ended up using the Account type from ui/Types/Account.ts in transactionRules.ts, which I ended up copying and adding to the API. I first tried to move the Acount.ts to a shared types directory, but then realized that the project would need further configuration in order to share between the API and UI. I felt that applying those changes would have been beyond the scope of the requested functionality.

I also made the "Account" type a little more strict.

No testing exists, even though the packages have been added. If testing had been implemented, it would have been easier to prove the functionality was working correctly. Adding testing also was not part of the requested changes to the project.

Error handling could be improved throughout the codebase to make it more robust.

### What issues, if any, did you find with the request to add functionality?

I did not find any issue with this task. It was pretty straightforward.  It took me longer to familiarize myself with the codebase than it did to apply the requests. I then went back and refactored the original changes I made to make them more optimized. I added two records to the init-db.sql to manually test the requested functionality. I also added a TESTING.md for explaining in detail how to manually test the new added requests since no testing has been applied yet to the project.

### Would you modify the structure of this project if you were to start it over? If so, how?

The structure is not that bad for a small project.  I would probably not use "utils" as a directory as it's not specific enough and could lead to a dumping ground for unrelated code. 

I would probably change the structure to be something like:

`api/src/accounts/`
`api/src/transactions/`
`api/src/rules/`

Overall, I think this would make the codebase more organized and easier to navigate. 

I would also add a central configuration or settings directory.

Instead of a components directory, I would group related functionality together in feature-based directories, in which you could add components, hooks, api calls, etc., as children. 

The structure should be domain and feature first, and have layering inside each feature, with clear separation of concerns between business logic, data access, and presentation layers.

I would also add a proper README.md with detailed documentation explaining the project structure, setup instructions, dependencies, and how to build, and run the application.

### Were there any pieces of this project that you were not able to complete that you'd like to mention?

No, everything was completed as requested.

### If you were to continue building this out, what would you like to add next?

The project is still small, so I would probably restructure and refactor the current codebase to improve scalability and maintainability.  Centralized error handling, logging, and configuration management would be added. Unit and integration tests would be added to ensure reliability and prevent regressions, which would need to be a priority.

### If you have any other comments or info you'd like the reviewers to know, please add  them below.

This was a good challenge and I appreciate that it was a take home project versus a proctored code interview challenge.  Thank you for this opportunity to showcase my skills.