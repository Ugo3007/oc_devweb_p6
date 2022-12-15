import multer from "multer";

const MIME_TYPES = {
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpg',
    'image/png': 'png'
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'src/images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname

            .split(' ').join('_')
        // @ts-ignore
        const extension = MIME_TYPES[file.mimetype] || 'jpg'
        callback(null, Date.now() + '.' + extension)
    }
})

export default multer({storage}).single('image')