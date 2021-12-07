const uploadS3 = require('./aws-s3-upload-images.helper')
const customerService = require('../service/customer.service')
const Customermodel = require('../model/customer.model')


const get_customer_profile_image_url = async(Customer_id) => {
    const profile_img = uploadS3().single("profile_pic")
    // const product_img = uploadS3().single("product_pic")
    
    profile_img(req, res, async (err) => {
        if (err) {
            return res.status(200).json({
                code: 201,
                status: "failure",
                message: err
            })
        }
        else {
            const result = await Customermodel.updateOne(
                {Customer_id : Customer_id},
                { $set: { Profile_pic: req.file.location }}
                )
                console.log(result);
        }
    })
}


module.export = {
    get_customer_profile_image_url
}