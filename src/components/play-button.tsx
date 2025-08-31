import { makeAudio } from "@solid-primitives/audio"


const SOUND_FILE = "/moo.wav"

export function PlayButton() {

	const player = makeAudio(SOUND_FILE)

	const handleClick = async () => {
		await player.play()
	}

	return (
		<button type="button" class="bg-gray-500 text-4xl px-4 py-2" onclick={handleClick}>
			Запустить
		</button>
	)
}
