import React, { useState, useEffect } from 'react';
import { useSpotify } from '../../../CustomHooks/useSpotify';
import './HomePage.scss';
import CategoryDetails from './CategoryDetails';
import { BsFillPlayFill } from 'react-icons/bs';
import Header from '../../models/Header';

type Category = {
	id: number;
	name: string;
	icons: {
		url: string;
	}[];
	href: string;
};

export const HomePage: React.FC = () => {
	const [categories, setCategories] = useState<Category[]>([]);
	const [nextCategoriesUrl, setNextCategoriesUrl] = useState<string | null>(null);
	const { getCategories, isLoading } = useSpotify();
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [categoryBackground, setCategoryBackground] = useState<string | null>(null);

	useEffect(() => {
		if (!isLoading) {
			const fetchCategories = async () => {
				const fetchedCategories = await getCategories();
				setCategories(fetchedCategories?.items);
				setNextCategoriesUrl(fetchedCategories?.next);
			};

			fetchCategories();
		}
	}, [isLoading]);

	const handleCategoryClick = (categoryId: number, backgroundImage: string) => {
		setSelectedCategory(categoryId.toString());
		setCategoryBackground(backgroundImage);
	};

	const loadMoreCategories = async () => {
		if (nextCategoriesUrl) {
			const fetchedData = await getCategories(nextCategoriesUrl);
			setCategories(prevCategories => [...prevCategories, ...fetchedData.items]);
			setNextCategoriesUrl(fetchedData?.next);
		}
	};

	const containerStyle = {
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		backgroundImage: categoryBackground ? `url(${categoryBackground})` : '',
	};

	return (
		<>
			<Header />
			<div style={containerStyle} className='home-page'>
				<div className='home-page-header'>
					<h2 className='home-page-header__title'>Your favorite categories</h2>
				</div>
				<div className='category-list'>
					{categories?.map(category => (
						<div
							className='category-list__item'
							key={category?.id}
							onClick={() => handleCategoryClick(category?.id, category?.icons[0].url)}>
							<img
								className='category-list__item__image'
								src={category?.icons[0].url}
								alt={`Icon for ${category?.name}`}
							/>
							<h3>{category?.name}</h3>
							<div className='category-list__item__playicon'>
								<BsFillPlayFill size={32} />
							</div>
						</div>
					))}
				</div>
				<button className='home-page__load-more' disabled={!nextCategoriesUrl} onClick={loadMoreCategories}>
					Load more category
				</button>
				{selectedCategory && <CategoryDetails categoryId={selectedCategory} />}
			</div>
		</>
	);
};
