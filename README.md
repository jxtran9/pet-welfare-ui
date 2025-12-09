# Pet Welfare UI (React + Vite)

This is the frontend for the Pet Health & Welfare Database project.  
It connects to our FastAPI backend and shows live data from the MySQL database.

## How to Run Locally

1. Install packages:
   npm install

2. Start the UI:
   npm run dev

3. Open the app in your browser:
   http://localhost:5173

## Features

- View animals (GET /animals-simple)
- Add a new animal (POST /add-animal)
- Delete an animal (DELETE /delete-animal/{AnimalID})
- Show species counts (GET /animal-stats)
- Filter animals by species (Dog / Cat / All)

## Notes

- The UI is deployed on Vercel.
- Update `API_BASE` in App.jsx if the backend URL changes.
