cube = {rotation: {x: 0, y: 0, z: 0}}
camera = {position: {z: 0}}

var values = {};
const gui = new dat.GUI();
const folder = gui.addFolder('values')
folder.open()

function postValue(name, value) {
    fetch(`/api/values`, {
        method: "POST",
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            name: name,
            value: value
        }
        )
    }).then(function() {location.reload(true)})
}

var addFieldValue = {
    name: "",
    value: 50,
    butts: function(a){
        postValue(this.name, this.value)
    },
    msg: ""
}

const addFieldFolder = gui.addFolder('new field')
addFieldFolder.open()
addFieldFolder.add(addFieldValue, 'name')
addFieldFolder.add(addFieldValue, 'value', 0, 100)
addFieldFolder.add(addFieldValue, 'butts').name("SUBMIT")


function updateValue(name, value) {
    fetch(`/api/values/${name}`, {
        method: "PUT",
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            name: name,
            value: value
        }
        )
    })
}

function getValues() {
    fetch('/api/values')
        .then(response => response.json())
        .then(function(vals) {
            for (const val of vals.values) {
                values[val.name] = val.value
                controller = folder.add(values, val.name, 0, 100, 1)
                controller.onChange(function(v) {
                    updateValue(this.property, v)
                })
            }
        })
}

function getValue(name) {
    fetch(`/api/values/${name}`)
        .then(response => response.json())
        .then(val => console.log(val))
}

getValues()
