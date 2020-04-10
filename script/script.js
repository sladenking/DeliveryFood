'use strict';

const cardButton = document.querySelector('#card-button');
const modal = document.querySelector('.modal');
const closeButton = document.querySelector('.modal-close');

function toggleModal(){
    modal.classList.toggle('modal-active');
}

cardButton.addEventListener('click', toggleModal);

closeButton.addEventListener('click', toggleModal);

new WOW().init();