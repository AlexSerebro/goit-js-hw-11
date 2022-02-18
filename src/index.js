import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import getRefs from './js/refs';
import imgCard from './template/renderCard.hbs';
// import { getColection } from './js/pixabayAPI';

import 'simplelightbox/dist/simple-lightbox.min.css';
import './sass/main.scss';
const axios = require('axios').default;

const refs = getRefs();

const URL = 'https://pixabay.com/api/';
const searchOption = {
  params: {
    key: '25723466-237a46130ce218f798049a33b',
    q: ` `,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page: 0,
  },
};

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', loadMore);
refs.clearBtn.addEventListener('click', clearInterface);

let gallery = new SimpleLightbox('.gallery a', {
  showCounter: true,
  disableScroll: true,
});

function onCardClick(evt) {
  evt.preventDefault();

  gallery.open('.gallery');
}

async function onFormSubmit(e) {
  e.preventDefault();
  searchOption.params.page = 0;
  try {
    const collection = await getColection(e.currentTarget.searchQuery.value);
    onSucces(collection);
  } catch {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  }

  refs.form.reset();
}

function onSucces(respond) {
  clearInterface();

  makeMarkUp(respond);

  refs.gallery.addEventListener('click', onCardClick);
  gallery.refresh();

  Notify.success(`Hooray! We found ${respond.data.totalHits} images.`);
}

function clearInterface() {
  refs.gallery.removeEventListener('click', onCardClick);
  refs.gallery.innerHTML = '';
  refs.loadMoreBtn.classList.add('visually-hidden');
}

async function getColection(query = searchOption.params.q) {
  searchOption.params.q = `${query}`;
  searchOption.params.page = searchOption.params.page + 1;

  const respons = await axios.get(URL, searchOption);

  if (respons.data.hits.length === 0) {
    throw new Error();
  }

  return respons;
}

async function loadMore() {
  try {
    const collection = await getColection();

    makeMarkUp(collection);
    gallery.refresh();
    smoothScroll();
  } catch {
    Notify.failure("We're sorry, but you've reached the end of search results.");
    refs.loadMoreBtn.classList.add('visually-hidden');
  }
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2 + 180,
    behavior: 'smooth',
  });
}

function makeMarkUp({ data }) {
  const items = data.hits.map(imgCard).join('');

  refs.gallery.insertAdjacentHTML('beforeend', items);

  refs.loadMoreBtn.classList.remove('visually-hidden');
}
