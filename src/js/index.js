import { PixabayApi } from './pixabayApi';
import photosTemplate from '../templates/photosMarkUp.hbs';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightbox;

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.js-load-more'),
};

const pixabay = new PixabayApi();

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

async function onFormSubmit(e) {
  e.preventDefault();
  const searchQuery = e.currentTarget.elements.searchQuery.value;
  checkQuery(searchQuery);
  refreshMarkUp();
  try {
    const photos = await pixabay.fetchPhotos();
    const { hits, totalHits } = photos.data;
    if (!totalHits) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
    createMarkUp(hits);
    refs.loadMoreBtn.classList.remove('is-hidden');
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMoreBtnClick() {
  pixabay.page += 1;
  try {
    const photos = await pixabay.fetchPhotos();
    createMarkUp(photos.data.hits);
    lightbox.refresh();
  } catch (error) {
    console.log(error);
  }
}

function createMarkUp(arrayOfPhotos) {
  refs.gallery.insertAdjacentHTML('beforeend', photosTemplate(arrayOfPhotos));
  lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
}

function checkQuery(searchQuery) {
  pixabay.query = searchQuery;
  if (!pixabay.query) {
    Notiflix.Notify.info(`Please, enter search query ;)`);
    return;
  }
}

function refreshMarkUp() {
  pixabay.page = 1;
  refs.gallery.innerHTML = '';
}
