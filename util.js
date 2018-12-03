var multer=require('multer');
var path=require('path')
var storage=multer.diskStorage({
   
    destination:function(req,file,callback){
        // console.log(file)
        // console.log("in destination")
       callback(null,'./img')
    },
    filename:function(req,file,callback){
        // console.log(file)
        let file_name=file.fieldname+'-'+Date.now()+path.extname(file.originalname)
        req.newFile_name.push(file_name)
        console.log(req.newFile_name)
         callback(null,file_name)
       
    }
});

var upload = multer({
  storage: storage,

  }).array('img',5);



module.exports={
    upload,
    storage
}