// MediaFactory.js
import Media from './Media.js';

export default class MediaFactory {
    createMedia(file, likes, thumbnail, title, date) {
        return new Media(file, likes, thumbnail, title, date);
    }
}
