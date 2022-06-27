from flask import jsonify, request

valid_colors = [
  "ff0000",
  "ff5600",
  "ff7e00",
  "ffa000",
  "ffbc00",
  "ffd800",
  "fff500",
  "cbe500",
  "81bd00",
  "399500",
  "00813d",
  "007bc0",
  "0066ff",
  "2900f0",
  "4700c7",
  "4d00a0",
  "540887",
  "8833a9",
  "bb5acb",
  "ee82ee"
]

player_colors = []

events = []

def setup_game_routes(app):
    @app.route("/api/colors")
    def get_colors():
        return jsonify({"valid_colors": valid_colors, "player_colors":player_colors})

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
