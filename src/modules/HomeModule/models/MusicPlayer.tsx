import { useContext, useState, useRef, useEffect, useLayoutEffect } from 'react';
import { MusicPlayerContext, typeMusicPlayerContext } from '@/modules/ContextApi/MusicPlayerContext';
import { BsFillPlayFill } from 'react-icons/bs';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';
import { BiPause } from 'react-icons/bi';
import './MusicPlayer.scss';

function MusicPlayer() {
	const {
		isPlaying,
		setIsPlaying,
		currentTrack,
		setAudioElement,
		progress,
		handleProgressChange,
		handleNextTrack,
		volume,
		setVolume,
		handlePreviousTrack,
		handleVolumeChange,
	} = useContext(MusicPlayerContext) as typeMusicPlayerContext;

	const progressRef = useRef<HTMLInputElement>(null);
	const volumeRef = useRef<HTMLInputElement>(null);
	const [textMaxWidth, setTextMaxWidth] = useState(100);
	const [marquee, setMarquee] = useState(false);
	const container: any = useRef(null);

	// helper function that displays the data and image of a given song on the locked screen of the phone / as in spotify

	function setMediaMetadata(title: string, artist: string, artworkUrl: string) {
		if ('mediaSession' in navigator) {
			navigator.mediaSession.metadata = new MediaMetadata({
				title: title,
				artist: artist,
				artwork: [{ src: artworkUrl, sizes: '64x64', type: 'image/jpeg' }],
			});
		}
	}

	const handleResize = () => {
		if (window.innerWidth >= 800) {
			setTextMaxWidth(250);
		} else {
			setTextMaxWidth(100);
		}
	};
	useEffect(() => {
		handleResize();
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	// uselayout runs synchronously with other effects and is guaranteed to execute before the DOM update

	useLayoutEffect(() => {
		if (currentTrack) {
			setMediaMetadata(currentTrack.name, currentTrack?.artists[0]?.name, currentTrack?.album.images[2].url as string);
		}
		if (container.current) {
			const textWidth = container.current.scrollWidth;
			if (textWidth > textMaxWidth) {
				setMarquee(true);
			} else {
				setMarquee(false);
			}
		}
	}, [currentTrack, textMaxWidth]);

	return (
		<div className='audio-player'>
			<audio
				autoPlay
				src={currentTrack?.preview_url}
				onLoadedMetadata={e => setAudioElement(e.currentTarget as HTMLAudioElement)}
				onEnded={handleNextTrack}
			/>
			<div className='audio-player-item'>
				<img className='audio-player-item__image' src={currentTrack?.album?.images[2]?.url} />
				<span ref={container} className='audio-player-item__now-playing'>
					<div className={`audio-player-item__artist ${marquee ? 'marquee' : ''}`}>
						{currentTrack?.name}
						<br />
						<p className='audio-player-item__artist--name'>{currentTrack?.artists[0]?.name}</p>
					</div>
				</span>
			</div>
			<div className='audio-player-item__console'>
				<div>
					<button
						className='audio-player-item__play-button audio-player-item__play-button--prev'
						onClick={handlePreviousTrack}>
						Prev
					</button>
					<button className='audio-player-item__play-button' onClick={() => setIsPlaying(!isPlaying)}>
						{isPlaying ? <BiPause size={34} /> : <BsFillPlayFill size={34} />}
					</button>

					<button
						className='audio-player-item__play-button audio-player-item__play-button--next'
						onClick={handleNextTrack}>
						Next
					</button>
				</div>
				<div className='audio-player-item__progress'>
					<input type='range' ref={progressRef} value={progress} onChange={handleProgressChange} min={0} max={100} />
				</div>
			</div>
			<div className='audio-player-item__volume'>
				{volume ? (
					<FiVolume2
						size={44}
						onClick={() => {
							setVolume(0);
						}}
					/>
				) : (
					<FiVolumeX size={44} />
				)}
				<input type='range' ref={volumeRef} value={volume * 100} onChange={handleVolumeChange} min={0} max={100} />
			</div>
		</div>
	);
}

export default MusicPlayer;
