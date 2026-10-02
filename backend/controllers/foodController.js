import foodModel from "../models/foodModel.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// Add food item
const addFood = async (req, res) => {

    if (!req.file) {
        return res.json({
            success: false,
            message: "No file received by multer"
        });
    }

    try {
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "food-point",
            resource_type: "image"
        });

        // Save food details + Cloudinary URL in MongoDB
        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: result.secure_url
        });

        await food.save();

        // Delete temporary local image
        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.log("Error deleting temporary file:", err);
            }
        });

        res.json({
            success: true,
            message: "Food Added"
        });

    } catch (error) {

        console.log("Error adding food:", error);

        // Delete temporary file if upload fails
        fs.unlink(req.file.path, () => {});

        res.json({
            success: false,
            message: "Error uploading food image"
        });
    }
};


// All food list
const listFood = async (req, res) => {

    try {
        const foods = await foodModel.find({});

        res.json({
            success: true,
            data: foods
        });

    } catch (error) {

        console.log("Error fetching food:", error);

        res.json({
            success: false,
            message: "Error"
        });
    }
};


// Remove food item
const removeFood = async (req, res) => {

    try {
        const food = await foodModel.findById(req.body.id);

        if (!food) {
            return res.json({
                success: false,
                message: "Food not found"
            });
        }

        await foodModel.findByIdAndDelete(req.body.id);

        res.json({
            success: true,
            message: "Food Removed"
        });

    } catch (error) {

        console.log("Error removing food:", error);

        res.json({
            success: false,
            message: "Error"
        });
    }
};


export { addFood, listFood, removeFood };