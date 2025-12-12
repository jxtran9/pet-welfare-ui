# Pet Welfare UI (React + Vite)

This is the React frontend for the Pet Health & Welfare Database project.
It connects to the FastAPI backend and displays live data from the MySQL database.

## How to Run Locally

1. Install dependencies:
   npm install

2. Start the UI:
   npm run dev

3. Open the app in the browser:
   http://localhost:5173

## Features

- View animals (GET /animals-simple)
- Add new animal (POST /add-animal)
- Delete animal (DELETE /delete-animal/{animal_id})
- View species counts (GET /animal-stats)
- UI updates automatically after add or delete

## Configuration

If the backend URL changes, update the API_BASE value in App.jsx.

## Deployment

- UI is deployed on Vercel.
- Fetches data from the FastAPI backend hosted on Railway.

## Notes

- Backend must be running before the UI can fetch data locally.
- All backend endpoints used by the UI are documented in the backend README.