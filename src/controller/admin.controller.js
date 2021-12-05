const Adminmodel = require('../model/admin.model')



// ### create Admin document ###



const create = async (req, res) => {
    const admin = new Adminmodel({
        User_id: req.body.User_id,
        Name: req.body.Name,
        Phone_Number: req.body.Phone_Number,
        Desigination: req.body.Desigination,
        Username: req.body.Username,
        Password: req.body.Password
    });
    try{
        const total_number_of_documents = await Adminmodel.estimatedDocumentCount()
        console.log(total_number_of_documents);
        if (total_number_of_documents === undefined || total_number_of_documents === 0) {
            await admin.save();
            res.status(200).json({
                code: 200,
                status: "success",
                message: `document were inserted`
            })
        } else {
            const find_document_with_user_id = await Adminmodel.find({"User_id": req.body.User_id});
            console.log(find_document_with_user_id.length)
            if (find_document_with_user_id.length !== 0) {
                res.status(200).json({
                    code: 200,
                    status: "success",
                    message: `document with this user_id ${req.body.User_id} already exits`
                })
            } else if (find_document_with_user_id.length === 0) {
                const insert_document = await admin.save();
                res.status(200).json({
                    code: 200,
                    status: "success",
                    message: `${
                        insert_document.insertedCount
                    } documents were inserted with the _id: ${
                        insert_document.insertedId
                    }`
                })
            }
        }
    }
    catch(err){
        res.json(
            {
                code: 201,
                status: "failure",
                message: `Unknown Error Found From Server Side`
            }
        )
    }
}



// ### Admin Login ###



const login = async (req, res) => {
    try{
        const total_number_of_documents = await Adminmodel.estimatedDocumentCount()
        // console.log(total_number_of_documents);
        if (total_number_of_documents === undefined || total_number_of_documents === 0) {
            res.status(200).json({
                code: 201,
                status: "failure",
                message: `Database collection is empty, please fill some data`
            })
        } else {
            const login_with_username_and_password = await Adminmodel.find({
                    $and:[
                        {"Username" : req.body.Username},
                        {"Password" : req.body.Password}
                    ]
                });
            console.log(login_with_username_and_password.length)
            if (login_with_username_and_password.length !== 0) {
                res.status(200).json({
                    code: 200,
                    status: "success",
                    message: `you have been logged in successfully`
                })
            } else {
                res.status(200).json({
                    code: 201,
                    status: "failure",
                    message: `please check the credentials username: ${req.body.Username}, password: ${req.body.Password}`
                })
            }
        }
    }
    catch(err){
        res.json({
            code: 201,
            status: "failure",
            message: `Unknown Error Found From Server Side`
        })
    }
}



module.exports = {
    create,
    login
}