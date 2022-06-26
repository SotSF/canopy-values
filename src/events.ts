interface PlayerEvent {
  evt: "connect" | "update" | "fire" | "disconnect";
  player: string;
  data: Record<string, any>;
}

export const fireEvent = async (event: PlayerEvent) =>
  fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
