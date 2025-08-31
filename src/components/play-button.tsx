import { makeAudio } from "@solid-primitives/audio"
import { startSequence } from "../lib"
import { Effect } from "effect"

const SOUND_FILE = "/moo.wav"

export function PlayButton() {

	const player = makeAudio(SOUND_FILE)

	const handleClick = async () => {
		await Promise.all([
			player.play(),
			Effect.runPromise(startSequence)
		])
	}

	return (
		<button type="button" class="bg-gray-500 text-4xl px-4 py-2" onclick={handleClick}>
			Запустить
		</button>
	)
}
