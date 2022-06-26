# Canopy Values

Web app that interfaces with the Servants of the Secret Fire LED Canopy.

## Development

A Create React App (CRA) Typescript app renders a React frontend, and proxies through any API
requests to a Flask app. The Flask app uses a SQLite DB as a datastore. The canopy Unity app polls
the Flask app for data.

There is also a DatGUI frontend served by the flask app, which allows setting and changing values.

### Setup

Ensure you have a recent version of Node (10 doesn't work, 16 does).

Install Javascript dependencies:
`npm install`

Install Python dependencies:
`cd flaskapp && pip3 install -r requirements.txt`

### Run

Run the React server:
`npm start`

Run the Flask server:
`npm run server`

React frontend: http://localhost:3000/

Flask/DatGUI frontend: http://localhost:5000/

## To do

- enforce color uniqueness, on startup and on picking a new color
- drop a player after a certain amount of time, which should free up their color
- animate color change
- allow picking an arbitrary color
- add violence for Kevin
- do stuff with gyroscope/accelerometer data
