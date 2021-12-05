const Customermodel = require('../model/customer.model')



// ### create Customer document ###



const create = async (req, res) => {
    const customer = new Customermodel({
        Customer_id: req.body.Customer_id,
        Name: req.body.Name,
        Phone_Number: req.body.Phone_Number,
        Address: req.body.Address,
        Referer: req.body.Referer,
        Price: req.body.Password,
        Hand_Cash: req.body.Hand_Cash,
        Water_Purifier_Type: req.body.Water_Purifier_Type,
        Extra_Parts: req.body.Extra_Parts,
        Images: req.body.Images
    });
    try{
        const total_number_of_documents = await Customermodel.estimatedDocumentCount()
        console.log(total_number_of_documents);
        if (total_number_of_documents === undefined || total_number_of_documents === 0) {
            await customer.save();
            res.status(200).json({
                code: 200,
                status: "success",
                message: `document were inserted`
            })
        } else {
            const find_document_with_user_id = await Customermodel.find({"Customer_id": req.body.Customer_id});
            console.log(find_document_with_user_id.length)
            if (find_document_with_user_id.length !== 0) {
                res.status(200).json({
                    code: 200,
                    status: "success",
                    message: `document with this Customer_id ${req.body.Customer_id} already exits`
                })
            } else if (find_document_with_user_id.length === 0) {
                await customer.save();
                res.status(200).json({
                    code: 200,
                    status: "success",
                    message: `document were inserted`
                })
            }
        }
    }
    catch(err){
        res.json(
            {
                code: 201,
                status: "failure",
                message: err
            }
        )
    }
}



// ### list of all Customers in the collection ###



const customers_list = async (req, res, next) => {
    try
    {   
        fields = {"Customer_id" : 1,"Name" : 1,"Extra_Parts" : 1}
        const result = await Customermodel.find({}).select(fields);
        // console.log(result);
        res.status(200).json({
            code: 200,
            status: "success",
            message: `list of all customers fetched successfully`,
            result
        })
    }
    catch(err)
    {
        res.json({
            code: 201,
            status: "failure",
            message: err
        })
    }
}



// ### search customers using customer_id in the collection ###



const customers_search = async (req, res, next) => {
    try
    {   
        fields = {"Customer_id" : 1,"Name" : 1,"Extra_Parts" : 1}
        query = {"Customer_id": req.body.Customer_id}
        const result = await Customermodel.find(query).select(fields);
        // console.log(result);
        if(result.length !== 0){
            res.status(200).json({
                code: 200,
                status: "success",
                message: `customers fetched successfully`,
                result
            })
        }else{
            res.status(200).json({
                code: 201,
                status: "failure",
                message: `no such customer found`
            })
        }
    }
    catch(err)
    {
        res.json({
            code: 201,
            status: "failure",
            message: err
        })
    }
}



// ### search customers using customer_id in the collection ###



const customers_detail = async (req, res, next) => {
    try
    {   
        query = {"Customer_id": req.body.Customer_id}
        const result = await Customermodel.find(query);
        // console.log(result);
        if(result.length !== 0){
            res.status(200).json({
                code: 200,
                status: "success",
                message: `customer details fetched successfully`,
                result
            })
        }else{
            res.status(200).json({
                code: 201,
                status: "failure",
                message: `no such customer found`
            })
        }
    }
    catch(err)
    {
        res.json({
            code: 201,
            status: "failure",
            message: err
        })
    }
}



module.exports = {
    create,
    customers_list,
    customers_search,
    customers_detail
}
