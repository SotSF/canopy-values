cube = { rotation: { x: 0, y: 0, z: 0 } };
camera = { position: { z: 0 } };

var values = {};
const gui = new dat.GUI({ autoPlace: false });
gui.domElement.id = "gui";
document.getElementById("main").appendChild(gui.domElement);

const folder = gui.addFolder("values");
folder.open();

async function postValue(name, value) {
  if (name) {
    await fetch(`/api/values`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, value }),
    });
    location.reload(true);
  }
}

var addFieldValue = {
  name: "",
  value: 50,
  butts: () => postValue(this.name, this.value),
  msg: "",
};

const addFieldFolder = gui.addFolder("new field");
addFieldFolder.open();
addFieldFolder.add(addFieldValue, "name");
addFieldFolder.add(addFieldValue, "value", 0, 100);
addFieldFolder.add(addFieldValue, "butts").name("SUBMIT");

function updateValue(name, value) {
  fetch(`/api/values/${name}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, value }),
  });
}

async function getValues() {
  const response = await fetch("/api/values");
  const data = await response.json();
  for (const val of data.values) {
    values[val.name] = val.value;
    controller = folder.add(values, val.name, 0, 100, 1);
    controller.onChange(() => updateValue(this.property, v));
  }
}

async function getValue(name) {
  const response = await fetch(`/api/values/${name}`);
  const data = await response.json();
  console.log(data);
}

getValues();
