import productModel from "../models/productModel.js";

export async function findProductsByDomain(domain) {
    return await productModel.find({domain: domain});
}

export async function getAllProducts() {
    return await productModel.find();
}

export async function getFeaturedProducts() {
    return await productModel.find({featured: true});
}