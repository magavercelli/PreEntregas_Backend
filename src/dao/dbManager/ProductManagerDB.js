import productModel from "../models/product.model.js";


export default class ProductManagerDB {
    
    getProducts = async (req,res) => {
      try {
        const { limit = 10, page = 1, sort = '', query = '' } = req.query;
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: sort === 'desc' ? { price: -1 } : sort === 'asc' ? { price: 1 } : null
        };

        let filter = {};
        if (query) {
            filter = { title: { $regex: query, $options: 'i' } },
            { category: { $regex: query, $options: 'i' } },
            { status: query.toLowerCase() === 'true' }
        }

        const result = await productModel.paginate(filter, options);
        res.json({
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.prevPage ? `/api/products?page=${result.prevPage}` : null,
            nextLink: result.nextPage ? `/api/products?page=${result.nextPage}` : null
        });
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
