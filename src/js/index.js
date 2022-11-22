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

refs.form.addEventListener('input', onFormInput);
refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

function onFormInput(e) {
  pixabay.query = e.target.value;
}

async function onFormSubmit(e) {
  e.preventDefault();
  pixabay.page = 1;
  refs.gallery.innerHTML = '';
  try {
    const photos = await pixabay.fetchPhotos();
    const { hits, totalHits } = photos.data;
    if (totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
    createMarkUp(hits);
  } catch (error) {
    console.log(error);
  }
}

function createMarkUp(arrayOfPhotos) {
  refs.gallery.insertAdjacentHTML('beforeend', photosTemplate(arrayOfPhotos));
  // lightbox = new SimpleLightbox('.gallery a', {
  //   captionsData: 'alt',
  //   captionDelay: 250,
  // });
}

async function onLoadMoreBtnClick() {
  pixabay.page += 1;
  try {
    const photos = await pixabay.fetchPhotos();
    createMarkUp(photos.data.hits);
  } catch (error) {
    console.log(error);
  }
}
