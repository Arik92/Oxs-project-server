const mongoose = require('mongoose');

const TenantSchema = new mongoose.Schema({
    // A tenant has a name, phone number, address, and a financial debt (Or has no debt).
    // In addition, not every user can manage every tennant, thus building_manager field was added
    name: String,
    phone_number: String,
    address: String,
    debt: Number,
    building_manager : { type: mongoose.Schema.ObjectId, ref: 'User' }
});


const Tenant = mongoose.model('Tenant', TenantSchema);
module.exports = {
    Tenant
};
