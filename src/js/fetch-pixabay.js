import axios from 'axios';
const API_KEY = '31666099-266026a5e387fdbb4f62e5b52';
const BASE_URL = 'https://pixabay.com/api/';

export default class PixabayAPI {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 40;
  }

  async featchImages() {
    try {
      const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.perPage}&page=${this.page}`;
      const res = await axios.get(url);
      const images = res.data;
      return images;
    } catch (error) {
      console.error(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
