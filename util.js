var multer = require('multer');
var path = require('path')
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './img')
    },
    filename: function (req, file, callback) {
        let file_name = file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        req.newFile_name.push(file_name)
        console.log(req.newFile_name)
        callback(null, file_name)

    }
});

var upload = multer({
    storage: storage,
}).array('img', 3);

module.exports = {
    upload,
    storage
}