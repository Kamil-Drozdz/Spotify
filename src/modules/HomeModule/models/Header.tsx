import { useContext, useState } from 'react';
import { VscHome } from 'react-icons/vsc';
import { HiSearch } from 'react-icons/hi';
import { BiLibrary } from 'react-icons/bi';
import { AiOutlineUser } from 'react-icons/ai';
import { TbBrandSpotify } from 'react-icons/tb';
import './Header.scss';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '@/modules/ContextApi/Auth';
import { auth } from '@/modules/firebase';

type Auth = {
	user?: {
		displayName: string;
	};
};
function Header() {
	const navigate = useNavigate();
	const location = useLocation();
	const { user } = useContext<Auth>(AuthContext);
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const handleLogout = async () => {
		try {
			await auth.signOut();
			navigate('/');
		} catch (error) {
			console.error(error);
		}
	};
	return (
		<header className='header'>
			<button
				className='header-logo'
				onClick={() => {
					navigate('/homepage');
				}}>
				<TbBrandSpotify size={30} />
				<p>Spotify</p>
			</button>
			<div className='header-buttons'>
				<button
					onClick={() => {
						navigate('/homepage');
					}}
					className={`header-buttons--home ${location.pathname === '/homepage' ? 'active' : ''}`}>
					<VscHome size={30} />
					<p>Home</p>
				</button>
				<button
					onClick={() => {
						navigate('/music-search');
					}}
					className={`header-buttons--search ${location.pathname === '/music-search' ? 'active' : ''}`}>
					<HiSearch size={30} />
					<p>Search</p>
				</button>
				<button
					onClick={() => {
						navigate('/liblary');
					}}
					className={`header-buttons--liblary ${location.pathname === '/liblary' ? 'active' : ''}`}>
					<BiLibrary size={30} />
					<p>Liblary</p>
				</button>
				<button
					className='header-buttons--user'
					onClick={() => {
						setDropdownOpen(!dropdownOpen);
					}}>
					<AiOutlineUser title={user?.displayName} size={30} className='header-buttons--user-icon' />
					<p className='header-buttons--user-displayName'>{user?.displayName}</p>
				</button>
				{dropdownOpen && (
					<div className='header-buttons--user-dropdown'>
						<button>Settings</button>
						<button onClick={handleLogout}>Logout</button>
					</div>
				)}
			</div>
		</header>
	);
}

export default Header;
