# Canopy Values

Web app that interfaces with the Servants of the Secret Fire LED Canopy.

## Development

A Create React App (CRA) Typescript app renders a React frontend, and proxies through any API requests to a Flask app. The Flask app uses a SQLite DB as a datastore. That canopy Unity app polls the Flask app for data.

### Setup

Install Javascript dependencies:
`npm install`

Install Python dependencies:
`cd flaskapp && pip3 install -r requirements.txt`

### Run

Run the frontend React server:
`npm start`

Run the backend Flask server:
`npm run server`

React frontend: http://localhost:3000/

Flask/datgui frontend: http://localhost:5000/
