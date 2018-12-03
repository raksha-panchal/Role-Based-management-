var model = require('./model.js')
const bcrypt = require('bcrypt');
var util = require('./util.js')
var cloudinary = require('cloudinary')
cloudinary.config({
    cloud_name: 'dyxq6qusc',
    api_key: 768427637163896,
    api_secret: 'C-9_ibjyCuctlwLWNxOEwbrOMWk',
})


async function signup(req, res) {
    var user = model(req.body)
    var pass = await bcrypt.hash(req.body.password, 10);
    user.password = pass;
    user.save((err, data) => {
        if (err) {
            console.log(err)
            if (err.code === 11000) {
                return res.json({ code: 400, message: "emailId must be unique" })
            }
            return res.json({ code: 500, message: "Internal Server Error" })
        } else {
            return res.json({ code: 200, message: "ok", data })
        }
    })
}

function login(req, res) {
    model.findOne({ emailId: req.body.emailId, status: 'Active' }).then((result) => {
        if (!result) {
            return res.json({ code: 400, message: "Please check EmailId" })
        }
        var password = req.body.password;
        bcrypt.compare(password, result.password).then((data) => {
            if (data == true) {
                return res.json({ code: 200, message: "Login Successfully", result })
            }
            return res.json({ code: 404, message: "Please check password" })
        })
    }).catch((err) => {
        console.log(err)
        return res.json({ code: 500, message: "Internal Server Error" })
    })
}


function update(req, res) {
    model.findOne({ _id: req.params.updateid, status: 'Active' }, async (err, data) => {
        console.log(data._id)
        console.log(req.params.id)
        if (err) {
            return res.json({ code: 500, message: "Internal Server Error" })
        } else if (!data) {
            return res.json({ code: 404, message: "data not found" })
        } else if (data._id == req.params.id) {
            req.body.editedBy = data._id
            model.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true }).select({ "password": 0, "editedBy": 0 }).then((result) => {
                return res.json({ code: 200, message: "Data Update Successfully", result })
            })
        }
        else {
            let condition;
            if (data.role == 'King') {
                condition = {
                    $or: [
                        { role: 'Girls' },
                        { role: 'Boys' },
                        { role: 'Queen' },
                    ]
                }
            }
            else if (data.role == 'Queen') {
                condition = {
                    $or: [
                        { role: 'Girls' },
                        { role: 'Boys' },
                    ]
                }
            } else {
                return res.json({ code: 404, message: "Not Access For update" })
            }
            req.body.editedBy = req.params.updateid
            model.findOneAndUpdate({ $and: [{ _id: req.params.id }, condition] }, { $set: req.body }, { new: true }, (err, data1) => {
                if (err) {
                    return res.json({ code: 500, message: "Internal Server Error" })
                } else if (!data1) {
                    return res.json({ code: 404, message: "Not Access For Update" })
                } else {
                    return res.json({ code: 200, message: "Data Updated Successfully", data1 })
                }
            })
        }
    })
}

function deleteUser(req, res) {
    model.findOne({ _id: req.params.deleteid, status: 'Active' }, (err, data) => {
        if (err) {
            return res.json({ code: 500, message: "Internal Server Error" })
        } else if (!data) {
            return res.json({ code: 404, message: "data not found" })
        } else if (data._id == req.params.id) {
            model.findOneAndUpdate({ _id: req.params.id }, { $set: { status: 'InActive' } }, { new: true }).then((result) => {
                return res.json({ code: 200, message: "Data delete Successfully" })
            })
        } else {
            console.log(data.role)
            let condition;
            if (data.role == 'King') {
                condition = {
                    $or: [
                        { role: 'Girls' },
                        { role: 'Boys' },
                        { role: 'Queen' },
                    ]
                }
            }
            else if (data.role == 'Queen') {
                condition = {
                    $or: [
                        { role: 'Girls' },
                        { role: 'Boys' },
                    ]
                }
            } else {
                return res.json({ code: 404, message: "Not Access For delete" })
            }
            model.findOneAndUpdate({ $and: [{ _id: req.params.id }, condition] }, { $set: { status: 'InActive' } }, { new: true }, (err, data1) => {
                if (err) {
                    return res.json({ code: 500, message: "Internal Server Error" })
                } else if (!data1) {
                    return res.json({ code: 404, message: "Not Access For delete" })
                } else {
                    return res.json({ code: 200, message: "Data delete Successfully" })
                }
            })
        }
    })
}


function view(req, res) {
    model.findOne({ _id: req.params.id, status: 'Active' }, (err, data) => {
        if (err) {
            console.log(err)
            return res.json({ code: 500, message: "Internal Server Error" })
        } else if (!data) {
            return res.json({ code: 404, message: "data not found" })
        } else {
            let condition;
            if (data.role == 'Queen') {
                condition = {
                    $or: [
                        { role: 'Girls' },
                        { role: 'Boys' },
                        { $and: [{ role: 'Queen' }, { _id: { $nin: req.params.id } }] }
                    ]
                }
            } else if (data.role == 'King') {
                condition = {
                    $or: [
                        { role: 'Queen' },
                        { role: 'Boys' },
                        { role: 'Girls' },
                        { $and: [{ role: 'King' }, { _id: { $nin: req.params.id } }] }
                    ]
                }
            } else if (data.role == 'Boys') {
                condition = {
                    $and: [{ role: 'Boys' }, { _id: { $nin: req.params.id } }]
                }
            }
            else {
                condition = { $and: [{ role: 'Girls' }, { _id: { $nin: req.params.id } }] }
            }
            model.find({ $and: [condition, { status: 'Active' }] }).select({ "password": 0, "editedBy": 0 }).then((result) => {
                return res.json({ code: 200, message: "ok", result })
            }).catch((err) => {
                return res.json({ code: 500, message: "something wrong" })
            })
        }
    })
}

async function imageupload1(req, res) {
    req.newFile_name = [];
    await util.upload(req, res, async function (err) {
        if (err) {
            return res.json({ code: 500, message: "Internal Server Error" })
        }
        else {
            // var filePath = req.newFile_name;
            // console.log("file", filePath)
            // cloudinary.v2.uploader.upload(`${process.cwd()}/img/${filePath}`, (err, result) => {
            //     if (err) {
            //         res.json({ code: 500, message: "Internal server error" })
            //     } else {
            //         return res.json({ code: 200, message: "Image uploaded Successfully", URL: result.url })
            //     }
            // })
            var filePaths = req.newFile_name;
            let multipleUpload = new Promise(async (resolve, reject) => {

                let upload_len = filePaths.length
                    , upload_res = new Array();
                for (let i = 0; i <= upload_len; i++) {
                    let filePath = filePaths[i];
                    await cloudinary.v2.uploader.upload(`${process.cwd()}/img/${filePath}`, (error, result) => {

                        if (upload_res.length === upload_len) {
                            resolve(upload_res)
                        } else if (result) {
                            upload_res.push(result.url);
                        } else if (error) {
                            reject(error)
                            return res.json({ code: 500, message: "Internal Server Error" })
                        }
                    })
                }
            })
                .then((result) => result)
                .catch((error) => error)
            let upload = await multipleUpload;
            res.json({ code: 200, message: "uploaded successfully", 'response': upload })
        }
    });

}

module.exports = {
    signup,
    update,
    view,
    deleteUser,
    login,
    imageupload1
}