# Consensus

Consensus is a game that involves ranking 4 options and comparing your opinion against the worldwide average. After submitting the user can see their ranking, the worldwide average, and a similarity score representing how similar the user's response was to the average. Each day there is a new category and new options. Users can view past games, their submissions, and the consensus for that day through the archive, and they can submit new ideas for future categories and options by going through the profile page. The links are as follows:

Production: https://consensus-game.vercel.app

Staging: https://consensus-dev.vercel.app  --> Please use this link for doing any admin testing. The production version is live and being played by WPI students every day. To avoid disrupting their experience, it would be best to do testing here on the development database. 

## Admin Instructions 
Please post your Gmail in the Slack channel or DM it to Ari so we can whitelist you for admin access. Once that has been done, visit https://consensus-dev.vercel.app/admin either through the profile page or directly to that URL and you should be able to see the admin page. 

## Tech Stack
For our technology stack, we kept things rather simple. We used Next.js for the frontend, with TailwindCSS for styling, Framer Motion for animation and the Next API as our backend. For our database, we used MongoDB and deployed it on Mongo Atlas. The Next app was deployed on Vercel.

## Challenges

General Auth/Deployment challenges: Definitely faced/are facing some interesting challenges with expanding our authentication and securing our deployment but we have a good base and a plan to move forwards.

Archive Page: When designing the archive page, it needed to have a very detailed route to retrieve all the necessary information about the user. A big challenge was ensuring that the colors and their word association were preserved along with the order of their ranking. After many tweaks, the API response sends a well-structured object to the frontend which correctly displays consensus submissions in the archive. 

## Contributions

Ariel Schechter: Set up NextAuth Authentication system including Google OAuth sign in and anonymous sessions. Built out all authentiaction logic, loading states, data retrieval for game logic. Managed dev and prod MongoDB instances on Atlas and deployed Consensus to Vercel with a staging environment and a production environment. Reviewed all PRs, ran SCRUM meetings and managed repositories. 

Steve Stardellis: Implented the entirety of the archive page, which stores information about the user and each consensus. Users are able to see their submission for each consensus as well as see the overall consensus for that day. The user can filter by date or by text to search the database for records. If the user did not submit a consensus for a day, it still shows the overall consensus.

James Walden: Developed a number of backend routes for a variety of functionalities and implimented the datalayer and many of its included functions. Created the user suggestion page as well as the admin dashboard, including the approval or denial of user suggestions. Implimented the AI generated Consensus framework to generate random consensus options or for a specific category and then apporve or deny them.

Gustave Montana: Designed and implemented the entire front-end user interface for the play, profile, and landing pages. Built game logic for the play page. Built all components like toasts, modals, buttons, etc.

John Thompson: Developed routes and frontend for submitting new Consensus categories and options to the database and to view the queue of upcoming games.

## Project Video
https://youtu.be/5Fn6AFAqMM0

## To run the app:

npm install

npm run dev

