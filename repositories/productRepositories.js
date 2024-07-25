import productModel from "../models/productModel.js";

export async function findFirstProducts(domain) {
    return await productModel.find({domain: domain}).limit(4).exec();
}

export async function findProductsByDomain(domain,) {
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

export async function findProductsByDomainAndBrands(domain,brands,sorting) {
    let query = {domain:domain};

    if(brands.length>0) {
        query.brand = {$in: brands}
    }
    let sort = {}
    if(sorting == 'asc'){
        sort.price=1;
    } else if(sorting == 'des'){
        sort.price=-1;
    }
    return await productModel.find(query).sort(sort);
    //return await productModel.find({domain:domain, brand:{$in:brands}}).sort(sort).exec();
}

export async function getDistinctBrands(domain) {
    return await productModel.distinct('brand',{domain:domain}).exec();
}