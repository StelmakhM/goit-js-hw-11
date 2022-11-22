'use strict';
import axios from 'axios';

export class PixabayApi {
  #BASE_URL = `https://pixabay.com/api/`;
  #API_KEY = '31500159-a5060d62383e22c767908c9f6';

  constructor() {
    this.page = null;
    this.query = null;
  }

  async fetchPhotos() {
    const searchParams = {
      params: {
        q: this.query,
        key: this.#API_KEY,
        image_type: 'photo',
        orientation: `horizontal`,
        safesearch: true,
        page: this.page,
        per_page: 39,
      },
    };

    return await axios.get(`${this.#BASE_URL}`, searchParams);
  }
}
