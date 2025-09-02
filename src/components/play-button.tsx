import { makeAudio } from "@solid-primitives/audio";
import { startSequence } from "../lib";
import { Effect } from "effect";
import { createReconnectingWS, createWS } from "@solid-primitives/websocket";
import { createEventSignal } from "@solid-primitives/event-listener";
import { createEffect, createSignal } from "solid-js";

const SOUND_FILE = "/moo.wav";
const WS_URL = import.meta.env.WS_URL ?? "ws://192.168.50.12:3001";

export function PlayButton() {
  const [lastMessage, setLastMessage] = createSignal<string>("");
  const ws = createReconnectingWS(WS_URL);
  const messageEvent = createEventSignal(ws, "message");

  const player = makeAudio(SOUND_FILE);

  createEffect(() => {
    const readyState = ws.readyState;
    if (readyState === WebSocket.OPEN) {
      console.log("WebSocket connected");
    }
  });

  createEffect(() => {
    const message = messageEvent();
    if (message) {
      const data = message.data;
      console.log("Received WebSocket message:", data);
      setLastMessage(data);

      if (data === "start") {
        start();
      }
    }
  });

  const start = async () => {
    await Promise.all([player.play(), Effect.runPromise(startSequence)]);
  };

  const handleClick = async () => {
    ws.send("start");
    await start();
  };

  return (
    <div class="text-center space-y-4">
      <div class="text-sm text-gray-600">
        Last message: {lastMessage() || "None"}
      </div>
      <button
        type="button"
        class="bg-gray-500 text-4xl px-4 py-2"
        onclick={handleClick}
      >
        Запустить
      </button>
    </div>
  );
}
