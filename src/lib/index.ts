import { Effect, Console, Data, Duration } from "effect";
import { left, right, front, back } from "./sequences";

const devices = {
  front: "192.168.1.50",
  right: "192.168.1.51",
  left: "192.168.1.52",
  back: "192.168.1.53",
} as const satisfies Readonly<Record<string, string>>;

class UnknownError extends Data.TaggedError("UnknownError")<{
  cause?: unknown;
  message: string;
}> {}

function toggleHttp(ip: string) {
  return Effect.gen(function* () {
    const json = yield* Effect.tryPromise({
      try: () =>
        fetch(`http://${ip}/rpc/Switch.Toggle?id=0`).then((x) => x.json()),
      catch: (error) => null,
    });
    yield* Console.log(json);

    yield* Console.log("Running", ip);
  });
}

function runSequence(ip: string, sequence: number[]) {
  return Effect.gen(function* () {
    for (let step of sequence) {
      yield* Effect.sleep(Duration.seconds(step));
      yield* toggleHttp(ip);
    }
  });
}

export const startSequence = Effect.gen(function* () {
  console.log({
    front,
    back,
    left,
    right,
  });

  yield* Effect.all(
    [
      runSequence(devices.front, front),
      runSequence(devices.back, back),
      runSequence(devices.left, left),
      runSequence(devices.right, right),
    ],
    { concurrency: "unbounded", mode: "either" },
  );
});
