import * as axios from '../node_modules/axios/dist/axios.min.js';
import gutenberg from './gutenberg';

export default class GutenbergAPI {
  constructor() {

  }

  public static getBookMap(): any {
    return gutenberg.bookMap;
  }

  public static getFile(link: string): any {
    return axios.get(link);
  }
}
