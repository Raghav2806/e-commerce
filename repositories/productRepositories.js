import productModel from "../models/productModel.js";

export async function findFirstProducts(domain) {
    return await productModel.find({domain: domain}).limit(4).exec();
}

export async function findProductsByDomain(domain) {
    return await productModel.find({domain: domain});
}

export async function findProductById(id) {
    return await productModel.findOne({_id: id});
}

export async function getAllProducts() {
    return await productModel.find();
}

export async function getFeaturedProducts() {
    return await productModel.find({featured: true});
}

export async function getNewProducts() {
    return await productModel.find({new: true});
}