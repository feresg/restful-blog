const multer = require('multer'),
      path   = require('path');

function storage(type) {
    return multer.diskStorage({
    destination: './public/img/uploads/'+type,
    filename: (req, file, callback) => {
        callback(null, file.fieldname+'-'+Date.now()+path.extname(file.originalname));
    }
});
}

function upload(type){
    var storagePath = storage(type)
    return multer({
    storage:storagePath,
    limits:{fileSize:1000000},
    fileFilter: (req, file, callback) => {
        checkFileType(file, callback);
    }
    }).single('image');
}

function checkFileType (file, callback){
    const filetypes = /jpeg|jpg|png|bmp|gif/;
    // check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // check mimetype
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname){
        return callback(null, true);
    }else{
        callback('Error : Images Only');
    }
};

module.exports = {storage, upload}