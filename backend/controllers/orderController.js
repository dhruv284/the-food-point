import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Placing user order for frontend
const placeOrder = async (req, res) => {
    try {
        // Create order in MongoDB
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        });

        await newOrder.save();

        // Clear user's cart
        await userModel.findByIdAndUpdate(
            req.body.userId,
            { cartData: {} }
        );

        // Razorpay amount is in paise
        const amountInPaise = Math.round(req.body.amount * 100);

        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: newOrder._id.toString()
        });

        res.json({
            success: true,
            orderId: newOrder._id,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            key: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        console.log(error);

        res.json({
            success: false,
            message: "Error creating order"
        });
    }
};


// Verify Razorpay payment
const verifyOrder = async (req, res) => {
    const {
        orderId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    } = req.body;

    try {
        // Create signature string
        const body =
            razorpay_order_id + "|" + razorpay_payment_id;

        // Generate expected signature
        const expectedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(body)
            .digest("hex");

        // Verify signature
        if (expectedSignature === razorpay_signature) {

            await orderModel.findByIdAndUpdate(
                orderId,
                {
                    payment: true
                }
            );

            res.json({
                success: true,
                message: "Payment verified successfully"
            });

        } else {

            // Delete unpaid/invalid order
            await orderModel.findByIdAndDelete(orderId);

            res.json({
                success: false,
                message: "Payment verification failed"
            });
        }

    } catch (error) {
        console.log(error);

        res.json({
            success: false,
            message: "Error verifying payment"
        });
    }
};


// User orders for frontend
const userOrders = async (req, res) => {
    try {

        const orders = await orderModel.find({
            userId: req.body.userId
        });

        res.json({
            success: true,
            data: orders
        });

    } catch (error) {

        console.log(error);

        res.json({
            success: false,
            message: "Error"
        });
    }
};


// Listing orders for admin panel
const listOrders = async (req, res) => {
    try {

        const orders = await orderModel.find({});

        res.json({
            success: true,
            data: orders
        });

    } catch (error) {

        console.log(error);

        res.json({
            success: false,
            message: "Error"
        });
    }
};


// API for updating order status
const updateStatus = async (req, res) => {
    try {

        await orderModel.findByIdAndUpdate(
            req.body.orderId,
            {
                status: req.body.status
            }
        );

        res.json({
            success: true,
            message: "Status Updated"
        });

    } catch (error) {

        console.log(error);

        res.json({
            success: false,
            message: "Error"
        });
    }
};


export {
    placeOrder,
    verifyOrder,
    userOrders,
    listOrders,
    updateStatus
};