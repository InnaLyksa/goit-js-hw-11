import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PixabayApiServise from './js/fetch-pixabay';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import createMarkup from './js/create-markup-image';
import './css/styles.css';
import LoadMoreBtn from './js/load-more-btn';

const refs = {
  searchForm: document.querySelector('#search-form'),
  pictureContainer: document.querySelector('.gallery'),
};

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

const OPTIONS_NOTIFICATION = {
  position: 'right-top',
  fontSize: '16px',
  width: '350px',
};

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 200,
});

const pixabayApiServise = new PixabayApiServise();

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();
  clearPictureContainer();

  pixabayApiServise.query = e.currentTarget.elements.searchQuery.value;

  if (pixabayApiServise.query === '' || pixabayApiServise.query.length < 3) {
    loadMoreBtn.hide();
    Notify.warning(
      'Warning! Search must not be empty and contain less then 2 letters',
      OPTIONS_NOTIFICATION
    );
    return;
  }

  loadMoreBtn.show();
  loadMoreBtn.disable();
  refs.searchForm.reset();
  pixabayApiServise.resetPage();

  pixabayApiServise.featchImages().then(images => {
    if (images.total === 0) {
      loadMoreBtn.hide();
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
        OPTIONS_NOTIFICATION
      );
      return;
    } else {
      loadMoreBtn.enable();
      Notify.success(
        `Hooray! We found ${images.totalHits} images`,
        OPTIONS_NOTIFICATION
      );
      featchImages();
    }
  });
}

async function featchImages() {
  await pixabayApiServise
    .featchImages()
    .then(images => {
      if (images.total === 0) {
        loadMoreBtn.hide();
        clearPictureContainer();

        return;
      } else {
        pixabayApiServise.incrementPage();
        const createdImages = images.hits
          .map(image => createMarkup(image))
          .join('');
        refs.pictureContainer.insertAdjacentHTML('beforeend', createdImages);

        lightbox.refresh();
      }

      // console.log(images);
      return images.totalHits;
    })
    .then(totalHits => {
      const allImages = document.querySelectorAll('a.gallery__image');
      // console.log(allImages);

      if (allImages.length === totalHits) {
        loadMoreBtn.hide();
        Notify.warning(
          `We're sorry, but you've reached the end of search results. Please start a new search`,
          {
            timeout: 6000,
            position: 'right-top',
            fontSize: '16px',
            width: '350px',
          }
        );
      }

      return totalHits;
    });
}

function onLoadMore() {
  loadMoreBtn.disable();
  featchImages().then(() => {
    loadMoreBtn.enable();
  });
}

function clearPictureContainer() {
  refs.pictureContainer.innerHTML = '';
}
