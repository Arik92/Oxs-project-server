const express = require('express');
const router = express.Router();
const Tenant = require('../models/tenant').Tenant;
const auth = require('../auth.js')();

router.get("/all_tenants", auth.authenticate(), async (req, res) => {    
    try {
        const foundTenants = await Tenant.find({building_manager: req.user.userId});
        // console.log('tenants that match %s: %o', req.user.userId, foundTenants);
        res.json(foundTenants);
    } catch(err) {
        res.json(err);
    }
});

router.post("/add_tenant", auth.authenticate(), async (req, res) => {        
    try {
        const newTenant = new Tenant({});   
        newTenant.name = req.body.name;
        newTenant.phone_number = req.body.phoneNumber;
        newTenant.address = req.body.address;
        newTenant.debt = req.body.debt;
        newTenant.building_manager = req.user.userId;

        await newTenant.save();
        // res.json('Success');
        res.json(newTenant);
    } catch(err) {
        res.json(err);
    }
});

router.put("/update_tenant", auth.authenticate(),(req, res) => {     
    try {        
        Tenant.findOneAndUpdate({_id: req.body._id}, req.body,{ new:true } ,(err, response) => {
            res.json(response);
        });
        // res.json('Success');
    } catch(err) {
        res.json(err);
    }
});

router.delete("/delete_tenant", auth.authenticate(),async (req, res) => {     
    try {        
        await Tenant.findByIdAndDelete(req.body.id);
        res.json('Success');
    } catch(err) {
        res.json(err);
    }
});

module.exports = router;