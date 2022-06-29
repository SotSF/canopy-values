import { JoyStick } from "./joy";

interface Joy {
  GetX(): number;
  GetY(): number;
}

export let joyL: Joy;
export let joyR: Joy;
export const redrawJoys = (color: string) => {
  document.getElementById("joystickLCanvas")?.remove();
  document.getElementById("joystickRCanvas")?.remove();

  const defaultOptions = {
    internalFillColor: color,
    internalStrokeColor: color,
    externalStrokeColor: color,
  };
  joyL = new JoyStick(
    "joystickL",
    {
      title: "joystickLCanvas",
      ...defaultOptions,
    },
    null!,
  );
  joyR = new JoyStick(
    "joystickR",
    {
      title: "joystickRCanvas",
      ...defaultOptions,
    },
    null!,
  );
};
