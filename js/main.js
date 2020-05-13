'use strict';

window.addEventListener('DOMContentLoaded', () => {

	//GetData
	const getData = async url => {
		const response = await fetch(url);

		if (response.status !== 200) {
			throw new Error('Status network not 200');
		}

		return await response.json();
	};

	//ToggleCart
	const toggleMenuCart = () => {
		const buttonCart = document.querySelector("#cart-button"),
			modalCart = document.querySelector(".modal"),
			closeBtn = document.querySelector('.close');

		const toggleModalCard = () => {
			modalCart.classList.toggle("is-open");
		};

		buttonCart.addEventListener("click", toggleModalCard);
		closeBtn.addEventListener("click", toggleModalCard);
	};

	toggleMenuCart();

	//ToggleAuthorization
	const toggleMenuAuth = () => {
		const buttonAuth = document.querySelector('.button-auth'),
			modalAuth =  document.querySelector('.modal-auth'),
			buttonOut = document.querySelector('.button-out'),
			closeBtn = document.querySelector('.close-auth'),
			logInForm = document.getElementById('logInForm'),
			loginInput = document.getElementById('login'),
			userName = document.querySelector('.user-name'),
			containerPromo = document.querySelector('.container-promo'),
			restaurants = document.querySelector('.restaurants'),
			menu = document.querySelector('.menu');

		let login = localStorage.getItem('UserName');

		const valid = str => {
			const nameReg = /^[a-zA-ZА-Яа-я][a-zA-Z0-9А-Яа-я-_.]{1,20}$/;
			return nameReg.test(str);
		};
		valid();

		const toggleModalAuth = () => {
			modalAuth.classList.toggle('is-open');
		};

		const returnMain = () => {
			containerPromo.classList.remove('hide');
			restaurants.classList.remove('hide');
			menu.classList.add('hide');
		};

		const authorized = () => {
			console.log('Авторизован');
			const logOut = () => {
				login = null;
				localStorage.removeItem("UserName");
				buttonAuth.style.display = '';
				buttonOut.style.display = '';
				userName.style.display = '';
				buttonOut.removeEventListener('click', logOut);
				checkAuth();
				returnMain();
			};
			userName.textContent = login;
			buttonAuth.style.display = 'none';
			buttonOut.style.display = 'flex';
			userName.style.display = 'flex';
			buttonOut.addEventListener('click', logOut);

		};

		const statusMessage = document.createElement('div');
		statusMessage.textContent = 'Введите логин';
		statusMessage.classList.add('status-message');
		statusMessage.style.cssText = 'font-size: 1rem; z-index: 10; margin-bottom: 20px; color: #1890ff;';

		const removeStatusMessage = () => {
			const status = document.querySelector('.status-message');
			if (!status) return;
			setTimeout(() => {
				status.remove();
				loginInput.style.borderColor = '';
			}, 2000);
		};

		const notAuthorized = () => {
			console.log('Не авторизован');
			const logIn = event => {
				event.preventDefault();
				if (valid(loginInput.value.trim())) {
					login = loginInput.value;
					localStorage.setItem("UserName", login);
					toggleModalAuth();
					buttonAuth.removeEventListener('click', toggleModalAuth);
					closeBtn.removeEventListener('click', toggleModalAuth);
					logInForm.removeEventListener('submit', logIn);
					logInForm.reset();
					checkAuth();
				} else {
					loginInput.value = '';
					loginInput.style.borderColor = '#1890ff';
					loginInput.insertAdjacentElement('afterend', statusMessage);
					removeStatusMessage();
				}
			};

			buttonAuth.addEventListener('click', toggleModalAuth);
			closeBtn.addEventListener('click', toggleModalAuth);
			logInForm.addEventListener('submit', logIn);
		};

		function checkAuth() {
			if (login) {
				authorized();
			} else {
				notAuthorized();
			}
		}

		checkAuth();

	};

	toggleMenuAuth();

	//CreateCardGood
	const createCardGood = ({ description, image, name, price }) => {
		const card = document.createElement('section'),
			cardsMenu = document.querySelector('.cards-menu');
		card.className = 'card';

		card.insertAdjacentHTML('beforeend', `
			<img src="${image}" alt="image" class="card-image"/>
			<div class="card-text">
				<div class="card-heading">
					<h3 class="card-title card-title-reg">${name}</h3>
				</div>
				<div class="card-info">
					<div class="ingredients">${description}
					</div>
				</div>
				<div class="card-buttons">
					<button class="button button-primary button-add-cart">
						<span class="button-card-text">В корзину</span>
						<span class="button-cart-svg"></span>
					</button>
					<strong class="card-price-bold">${price} ₽</strong>
				</div>
			</div>
		`);

		cardsMenu.insertAdjacentElement('beforeend', card);
	};

	//OpenCardGoods
	const openGoods = event => {
		const target = event.target;
		const login = localStorage.getItem('UserName'),
			modalAuth =  document.querySelector('.modal-auth'),
			restaurants = document.querySelector('.restaurants'),
			cardsMenu = document.querySelector('.cards-menu'),
			containerPromo = document.querySelector('.container-promo'),
			menu = document.querySelector('.menu');


		if (login) {
			const restaurant = target.closest('.card-restaurant');

			if (restaurant) {
				cardsMenu.textContent = '';
				containerPromo.classList.add('hide');
				restaurants.classList.add('hide');
				menu.classList.remove('hide');
				getData(`./db/${restaurant.dataset.products}`)
					.then(data => data.forEach(createCardGood))
					.catch(() => console.error('Error'));
			}
		} else {
			modalAuth.classList.toggle('is-open');
		}
	};

	//RenderCards
	const renderCards = ({ image, kitchen, name, price,
		stars, products, time_of_delivery: timeOfDelivery }) => {
		const cardsRestaurants = document.querySelector('.cards-restaurants'),
			containerPromo = document.querySelector('.container-promo'),
			menu = document.querySelector('.menu'),
			logo = document.querySelector('.logo'),
			restaurants = document.querySelector('.restaurants');

		const card = `
			<a class="card card-restaurant" data-products="${products}">
				<img src="${image}" alt="image" class="card-image"/>
				<div class="card-text">
					<div class="card-heading">
						<h3 class="card-title">${name}</h3>
						<span class="card-tag tag">${timeOfDelivery} мин</span>
					</div>
					<div class="card-info">
						<div class="rating">
							${stars}
						</div>
						<div class="price">От ${price} ₽</div>
						<div class="category">${kitchen}</div>
					</div>
				</div>
			</a>
		`;

		cardsRestaurants.insertAdjacentHTML('beforeend', card);

		cardsRestaurants.addEventListener('click', openGoods);
		logo.addEventListener('click', () => {
			containerPromo.classList.remove('hide');
			restaurants.classList.remove('hide');
			menu.classList.add('hide');
		});

	};



	const init = () => {
		getData('./db/partners.json')
			.then(data => data.forEach(renderCards))
			.catch(() => console.error('Error'));

		new Swiper('.swiper-container', {
			loop: true,
			autoplay: true
		});
	};

	init();


});


