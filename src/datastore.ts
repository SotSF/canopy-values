export type KeyValue = {
  name: string;
  value: number;
};

export let dataStore: Record<string, number> = {};
export const fetchValues = async () => {
  const response = await fetch("/api/values");
  const values = (await response.json()).values as KeyValue[];
  for (const { name, value } of values) {
    dataStore[name] = value;
  }
  return dataStore;
};

export const updateValue = async (name: string, value: number) => {
  dataStore[name] = value;
  await fetch(`/api/values/${name}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, value }),
  });
};

export const updateValueDelta = (name: string, delta: number) =>
  updateValue(name, dataStore[name] + delta);
