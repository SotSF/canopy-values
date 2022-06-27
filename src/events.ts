export type EventType = "connect" | "update" | "fire" | "disconnect";

export interface PlayerEvent {
  evt: EventType;
  player: string;
  data: Record<string, any>;
}

export const fireEvent = async (event: PlayerEvent) =>
  fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
