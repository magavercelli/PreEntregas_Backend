import productModel from "../models/product.model.js";


export default class ProductManagerDB {
    
    getProducts = async (options, filters) => {
        try {
            const products = await productModel.paginate(filters, options);
            return products;
          } catch (error) {
            console.error('Error getting products:', error);
            throw error;
          }
    }

    addProduct = async (product) => {

       try {
        const newProduct = await productModel.create(product);
        return {
            status: 'success',
            msg: 'The product was added successfully',
            product: newProduct,
        };
        
       } catch (error) {
            console.error('Error adding product:', error);
            throw error;
       }

    }

    getProductById = async (pid) => {
        const products = await productModel.findOne({_id: pid});
        if(!products){
            return {
                status: 'error',
                msg: `Product with id ${pid} doesn't exist`,
            }
        }
        return{
            status: 'success',
            msg: products
        }
       
    }

    updateProduct = async (pid, updatedProduct) => {
        try {
            const product = await productModel.findOne({ _id: pid });
        
            if (!product) {
              return {
                status: 'error',
                msg: `Product with id ${pid} doesn't exist`,
              };
            }
        
            product.set(updatedProduct);
        
            await product.save();
        
            return {
              status: 'success',
              msg: 'Product updated successfully',
            };
          } catch (error) {
            console.error('Error updating product:', error);
            throw error;
          }
    }

    deleteProduct = async (pid) => {
        try {
            const product = await productModel.findOne({ _id: pid });
      
            if (!product) {
              return {
                status: 'error',
                msg: `Product with id ${pid} doesn't exist`,
              };
            }
      
            return {
              status: 'success',
              msg: `Product with id ${pid} removed successfully`,
            };
          } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
          }
    };
}
