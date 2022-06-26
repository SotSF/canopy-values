declare global {
  interface Window {
    JoyStick: any;
  }
}

interface Joy {
  GetX(): number;
  GetY(): number;
}

export let joy: Joy;
export const redrawJoy = (color: string) => {
  document.getElementById("joystick")?.remove();
  joy = new window.JoyStick("joy", {
    internalFillColor: color,
    internalStrokeColor: color,
    externalStrokeColor: color,
  });
};
