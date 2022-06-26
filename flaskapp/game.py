from flask import jsonify, request

events = []

def setup_game_routes(app):
    @app.route("/api/events")
    def get_events():
        events_json = jsonify(events)
        events = []
        return events_json

    @app.route("/api/events", methods=["POST"])
    def new_event():
        event = request.json
        events.append(event)
        return jsonify(event)
