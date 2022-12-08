export default function createMarkup(image) {
  return `<div class="photo-card"> <a href="${image.largeImageURL}" class="gallery__image">
  <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy"/></a>
  <div class="info">
  <div>
    <p class="info-item info-likes">
      <b>Likes:</b>
      ${image.likes}
    </p>
    <p class="info-item ">
      <b>Views:</b>
      ${image.views}
    </p>
    </div>
    <div>
    <p class="info-item info-comments">
      <b>Comments:</b>
      ${image.comments}
    </p>
    <p class="info-item">
      <b>Downloads:</b>
      ${image.downloads}
    </p>
    </div>
  </div>
</div>`;
}

// export default function createMarkup(images) {
//   const markupImages = images
//     .map(
//       ({
//         webformatURL,
//         largeImageURL,
//         tags,
//         likes,
//         views,
//         comments,
//         downloads,
//       }) => {
//         return `<div class="photo-card">
//               <a href="${largeImageURL}" class="gallery__image">
//                 <img src="${webformatURL}" alt="${tags}" loading="lazy" />
//               </a>
//               <div class="info">
//                <div>
//                 <p class="info-item info-likes">
//                   <b>Likes: </b>${likes}
//                 </p>
//                 <p class="info-item">
//                   <b>Views: </b>${views}
//                 </p>
//                 </div>
//                  <div>
//                 <p class="info-item info-comments">
//                   <b>Comments: </b>${comments}
//                 </p>
//                 <p class="info-item">
//                   <b>Downloads: </b>${downloads}
//                 </p>
//                  </div>
//               </div>
//       </div>`;
//       }
//     )
//     .join('');

//   // refs.pictureContainer.insertAdjacentHTML('beforeend', markupImages);
// }
