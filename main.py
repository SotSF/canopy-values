from flask import Flask, jsonify, request, abort, render_template
from flask_sqlalchemy import SQLAlchemy
import argparse

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///stuff.db'
db = SQLAlchemy(app)

class Value(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    value = db.Column(db.Integer)

    def json(self):
        return {"name": self.name, "value": self.value}

@app.route("/api/values", methods=["GET"])
def listValues():
    a = Value.query.all()
    print(a)
    return jsonify({"values": [v.json() for v in a]})

@app.route("/api/values", methods=["POST"])
def writeValue():
    val = request.json
    i = Value(name=val['name'], value=val['value'])
    db.session.add(i)
    db.session.commit()
    return jsonify(i.json())

@app.route("/api/values/<name>", methods=["PUT"])
def update(name):
    v = Value.query.filter_by(name=name).first()
    if v is None:
        return {"error": "not found", "code": 404}, 404
    val = request.json
    v.value = val['value']
    db.session.add(v)
    db.session.commit()
    return jsonify(v.json())

@app.route("/api/values/<name>")
def getValue(name):
    v = Value.query.filter_by(name=name).first()
    if v is None:
        return {"error": "not found", "code": 404}, 404
    return jsonify(v.json())

@app.route("/")
@app.route("/values")
def valuesIndex():
    return render_template("values/index.html")

if __name__ == '__main__':
    # create the db if it doesn't exist
    db.create_all()
    db.session.commit()

    parser = argparse.ArgumentParser()
    parser.add_argument("--public", action='store_true')
    args = parser.parse_args()

    host=""
    debug=True
    if args.public:
        host = '0.0.0.0'
        debug=False
    app.run(host=host, debug=True)