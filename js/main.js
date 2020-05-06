'use strict';

window.addEventListener('DOMContentLoaded', () => {

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
			userName = document.querySelector('.user-name');

		let login = localStorage.getItem('UserName');

		const toggleModalAuth = () => {
			modalAuth.classList.toggle('is-open');
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
				if (loginInput.value.trim()) {
					login = loginInput.value;
					localStorage.setItem("UserName", login);
					toggleModalAuth();
					buttonAuth.removeEventListener('click', toggleModalAuth);
					closeBtn.removeEventListener('click', toggleModalAuth);
					logInForm.removeEventListener('submit', logIn);
					logInForm.reset();
					checkAuth();
				} else {
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

	const renderCards = () => {
		const cardsRestaurants = document.querySelector('.cards-restaurants'),
			containerPromo = document.querySelector('.container-promo'),
			restaurants = document.querySelector('.restaurants'),
			menu = document.querySelector('.menu'),
			logo = document.querySelector('.logo'),
			cardsMenu = document.querySelector('.cards-menu');

		const card = `
			<a class="card card-restaurant">
				<img src="img/pizza-plus/preview.jpg" alt="image" class="card-image"/>
				<div class="card-text">
					<div class="card-heading">
						<h3 class="card-title">Пицца плюс</h3>
						<span class="card-tag tag">50 мин</span>
					</div>
					<div class="card-info">
						<div class="rating">
							4.5
						</div>
						<div class="price">От 900 ₽</div>
						<div class="category">Пицца</div>
					</div>
				</div>
			</a>
		`;

		cardsRestaurants.insertAdjacentHTML('beforeend', card);

		const createCardGood = () => {
			const card = document.createElement('section');
			card.className = 'card';

			card.insertAdjacentHTML('beforeend', `
				<img src="img/pizza-plus/pizza-girls.jpg" alt="image" class="card-image"/>
				<div class="card-text">
					<div class="card-heading">
						<h3 class="card-title card-title-reg">Пицца Девичник</h3>
					</div>
					<div class="card-info">
						<div class="ingredients">Соус томатный, постное тесто, нежирный сыр, кукуруза, лук, маслины,
							грибы, помидоры, болгарский перец.
						</div>
					</div>
					<div class="card-buttons">
						<button class="button button-primary button-add-cart">
							<span class="button-card-text">В корзину</span>
							<span class="button-cart-svg"></span>
						</button>
						<strong class="card-price-bold">450 ₽</strong>
					</div>
				</div>
			`);

			cardsMenu.insertAdjacentElement('beforeend', card);
		};

		const openGoods = event => {
			const target = event.target;
			const login = localStorage.getItem('UserName'),
				modalAuth =  document.querySelector('.modal-auth');

			const restaurant = target.closest('.card-restaurant');

			if (restaurant && login) {
				cardsMenu.textContent = '';
				containerPromo.classList.add('hide');
				restaurants.classList.add('hide');
				menu.classList.remove('hide');

				createCardGood();
			} else {
				modalAuth.classList.toggle('is-open');
			}

		};

		cardsRestaurants.addEventListener('click', openGoods);
		logo.addEventListener('click', () => {
			containerPromo.classList.remove('hide');
			restaurants.classList.remove('hide');
			menu.classList.add('hide');
		});

	};

	renderCards();

});


