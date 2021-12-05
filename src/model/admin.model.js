const mongoose = require('mongoose');
const collectionName = "Admin"

const AdminSchema = mongoose.Schema
({
    User_id:
    {
        type: String,
        require : true
    },
    Name:
    {
        type: String,
        require : true
    },
    Phone_Number:
    {
        type: Number,
        require : true
    },
    Desigination:
    {
        type: String,
        require : true
    },
    Username:
    {
        type: String,
        require : true
    },
    Password:
    {
        type: String,
        require : true
    }
});

const Adminmodel = mongoose.model('admin', AdminSchema, collectionName);
module.exports = Adminmodel