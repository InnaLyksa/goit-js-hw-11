import $ from 'jquery';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PixabayApiServise from './js/fetch-pixabay';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import createMarkup from './js/create-markup-image';
import './css/styles.css';
import LoadMoreBtn from './js/load-more-btn';
import OnlyScroll from 'only-scrollbar';

new OnlyScroll(document.scrollingElement, {
  damping: 0.6,
});

const refs = {
  searchForm: document.querySelector('#search-form'),
  pictureContainer: document.querySelector('.gallery'),
  spinerBtn: document.querySelector('.btn-spiner'),
};

const OPTIONS_NOTIFICATION = {
  position: 'right-top',
  fontSize: '16px',
  width: '350px',
};

const scrollToTopBtn = new LoadMoreBtn({
  selector: '[data-action="scroll-to-top"]',
  hidden: true,
});

const lightbox = new SimpleLightbox('.gallery a');

const pixabayApiServise = new PixabayApiServise();

refs.searchForm.addEventListener('submit', onSearch);

async function onSearch(e) {
  e.preventDefault();

  refs.spinerBtn.classList.remove('is-hidden');

  refs.pictureContainer.innerHTML = '';

  pixabayApiServise.query = e.currentTarget.elements.searchQuery.value;
  if (pixabayApiServise.query === '' || pixabayApiServise.query.length < 3) {
    Notify.warning(
      'Warning! Search must not be empty and includes more then 2 letters',
      OPTIONS_NOTIFICATION
    );
    refs.spinerBtn.classList.add('is-hidden');
    return;
  }
  pixabayApiServise.resetPage();
  refs.searchForm.reset();

  // await featchImages();
  pixabayApiServise.featchImages().then(images => {
    if (images.total === 0) {
      refs.spinerBtn.classList.add('is-hidden');
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
        { position: 'center-center', fontSize: '35px', width: '600px' }
      );
      return;
    } else {
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
        refs.spinerBtn.classList.add('is-hidden');
        refs.pictureContainer.innerHTML = '';
        return;
      } else {
        pixabayApiServise.incrementPage();
        const createdImages = images.hits
          .map(image => createMarkup(image))
          .join('');
        refs.pictureContainer.insertAdjacentHTML('beforeend', createdImages);
        lightbox.refresh();
        window.addEventListener('scroll', onScrollWindow, {
          passive: true,
        });
      }
      // console.log(images);
      return images.totalHits;
    })
    .then(totalHits => {
      const allImages = document.querySelectorAll('a.gallery__image');
      console.log(allImages);
      if (allImages.length === totalHits) {
        window.removeEventListener('scroll', onScrollWindow);
        refs.spinerBtn.classList.add('is-hidden');

        Notify.info(
          "We're sorry, but you've reached the end of search results.",
          {
            position: 'center-center',
            fontSize: '35px',
            width: '600px',
          }
        );
      }
      return totalHits;
    });
}

function onScrollWindow() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 1) {
    featchImages();
  }
}

scrollFunction();

function scrollFunction() {
  const btn = $('#scroll-to-top');
  $(window).on('scroll', function () {
    if ($(window).scrollTop() > 300) {
      scrollToTopBtn.show();
    } else {
      scrollToTopBtn.hide();
    }
  });
  btn.on('click', function (e) {
    e.preventDefault();
    $('html, body').animate(
      { scrollTop: $('#search-form').offset().top },
      2000
    );
    // $('html, body').animate({ scrollTop: 0 }, 500);
  });
}
