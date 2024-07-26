import orderModel from "../models/ordersModel.js";

export async function addOrder(cart, result) {
    const userId = cart.userId;
    const allOrders = await orderModel.findOne({userId});
    if(allOrders) {
        allOrders.orders.push({
            fname:result.customer_details.name,
            address:result.customer_details.address.line1,
            postal:result.customer_details.address.postal_code,
            items: cart.items,
            totalPrice: cart.totalPrice
        })
        await allOrders.save();
    } else {
        await orderModel.create({userId, 
            orders: [{
            fname:result.customer_details.name,
            address:result.customer_details.address.line1,
            postal:result.customer_details.address.postal_code,
            items: cart.items,
            totalPrice: cart.totalPrice
        }]
    })
    }
}