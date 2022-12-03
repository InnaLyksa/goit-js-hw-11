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

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 200,
});

const pixabayApiServise = new PixabayApiServise();

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();
  clearPictureContainer();

  pixabayApiServise.query = e.currentTarget.elements.searchQuery.value;

  if (pixabayApiServise.query === '' || pixabayApiServise.query.length < 3) {
    loadMoreBtn.hide();
    Notify.warning(
      'Warning! Search must not be empty and includes more then 2 letters'
    );
    return;
  }
  //   window.addEventListener('scroll', onScrollWindow, {
  //     passive: true,
  //   });

  loadMoreBtn.show();
  loadMoreBtn.disable();
  refs.searchForm.reset();
  pixabayApiServise.resetPage();

  await featchImages().then(images => {
    loadMoreBtn.enable();
  });
}

async function featchImages() {
  await pixabayApiServise
    .featchImages()
    .then(images => {
      if (images.total === 0) {
        loadMoreBtn.hide();
        refs.pictureContainer.innerHTML = '';
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      } else {
        pixabayApiServise.incrementPage();
        const createdImages = images.hits
          .map(image => createMarkup(image))
          .join('');
        refs.pictureContainer.insertAdjacentHTML('beforeend', createdImages);
        // Notify.success(`Hooray! We found ${images.totalHits} images`);

        lightbox.refresh();
      }

      console.log(images);
      return images.totalHits;
    })
    .then(totalHits => {
      const allItems = document.querySelectorAll('a.gallery__image');
      console.log(allItems);
      const totals = `${totalHits}` - `${allItems.length}`;
      Notify.success(`Hooray! We found more ${totals} images`);
      console.log(totals);
      if (allItems.length === totalHits) {
        loadMoreBtn.hide();
        Notify.success(`Sorry! We have uploaded all images`);
      }

      return totalHits;
    });
}

function onLoadMore() {
  loadMoreBtn.disable();

  featchImages().then(images => {
    loadMoreBtn.enable();
  });
}

function clearPictureContainer() {
  refs.pictureContainer.innerHTML = '';
}

// function onScrollWindow() {
//   const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

//   if (scrollTop + clientHeight >= scrollHeight - 5) {
//     featchImages();
//   }
// }

// window.onscroll = function () {
//   scrollFunction();
// };

// function scrollFunction() {
//   if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
//     mybutton.style.display = 'flex';
//   } else {
//     mybutton.style.display = 'none';
//   }
// }
