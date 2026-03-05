const express = require("express");
const router = express.Router();
const db = require("../db");

/* CREATE ITEM */
router.post("/", (req,res)=>{

    const {title,description,category,location,date,contact} = req.body;

    if(!title || !description || !category){
        return res.status(400).json({message:"Missing required fields"});
    }

    const sql = `
        INSERT INTO items 
        (title,description,category,location,date,contact)
        VALUES (?,?,?,?,?,?)
    `;

    db.execute(sql,[title,description,category,location,date,contact],
    (err,result)=>{
        if(err) return res.status(500).json(err);
        res.json({message:"Item created"});
    });

});

/* READ ALL ITEMS */
router.get("/", (req,res)=>{

    db.query("SELECT * FROM items",(err,result)=>{
        if(err) return res.status(500).json(err);
        res.json(result);
    });

});

/* READ ONE ITEM */

router.get("/:id",(req,res)=>{

    const sql = "SELECT * FROM items WHERE id=?";

    db.execute(sql,[req.params.id],(err,result)=>{
        if(err) return res.status(500).json(err);
        res.json(result[0]);
    });

});

/* UPDATE STATUS */

router.put("/:id",(req,res)=>{

    const {status} = req.body;

    const sql = "UPDATE items SET status=? WHERE id=?";

    db.execute(sql,[status,req.params.id],(err,result)=>{
        if(err) return res.status(500).json(err);
        res.json({message:"Updated"});
    });

});

/* DELETE */

router.delete("/:id",(req,res)=>{

    const sql = "DELETE FROM items WHERE id=?";

    db.execute(sql,[req.params.id],(err,result)=>{
        if(err) return res.status(500).json(err);
        res.json({message:"Deleted"});
    });

});

module.exports = router;