from flask import jsonify, request

events = []

def setup_game_routes(app):
    @app.route("/api/events")
    def get_events():
        global events
        events_json = jsonify(events)
        events = []
        return events_json

    @app.route("/api/events", methods=["POST"])
    def new_event():
        event = request.json
        events.append(event)

        # drain the queue if it is getting too big
        # can make this larger later, keeping it small for debugging
        if len(events) > 5:
            events.pop(0)

        return jsonify(event)
