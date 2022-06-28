declare global {
  interface Window {
    JoyStick: any;
  }
}

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
  joyL = new window.JoyStick("joystickL", {
    title: "joystickLCanvas",
    ...defaultOptions,
  });
  joyR = new window.JoyStick("joystickR", {
    title: "joystickRCanvas",
    ...defaultOptions,
  });
};
