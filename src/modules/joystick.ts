import { JoyStick } from "./joy";

interface Joy {
  GetX(): number;
  GetY(): number;
  Recolor(color: string): void;
}

export let joyL: Joy;
export let joyR: Joy;
export const drawJoys = (color: string) => {
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

export const recolorJoys = (color: string) => {
  joyL.Recolor(color);
  joyR.Recolor(color);
};
