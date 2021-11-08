import { diskStorage } from 'multer';
import { InvalidImageException } from '../modules/common/exceptions/invalid-image.exception';
import path from 'path';
import { v4 as uuid } from 'uuid';

export class StorageProvider {
    static AVATARS_DIR_PATH = './uploads/avatars';

    static uploadFileOptions = {
        storage: diskStorage({
            destination: this.AVATARS_DIR_PATH,
            filename: (req, file, cb) => {
                if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
                    cb(new InvalidImageException(), file.filename);
                }
                const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuid();
                const extension: string = path.parse(file.originalname).ext;
                cb(null, `${filename}${extension}`)
            }
        })
    }
}
