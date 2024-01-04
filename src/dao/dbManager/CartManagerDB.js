import cartsModel from '../models/cart.model.js';
import productModel from '../models/product.model.js';

export default class CartManagerDB {
    
    getCarts = async () => {
        const carts = await cartsModel.find();
        return carts;
      
    }

    getCartById= async (cid) => {
        const cart = await cartsModel.find({_id: cid})
        return cart;
    }

    addNewCart = async () => {
        try { 
           const cart = await cartsModel.create({});
           return cart;
        } catch (error) {
            console.log ('Error');
        }
        
    }

    addProductToCart = async (cid, pid, quantity = 1) => {
        try {
            const cart = await cartsModel.findOne({_id: cid});
            if (!cart){
                return{
                    status : 'error',
                    msg: `Cart wiht id ${cid} doesn't exist`
                }
            }

            const product = await productModel.findOne({_id:pid});
            if (!product){
                return{
                    status : 'error',
                    msg: `Product wiht id ${pid} doesn't exist`
                }
            };

            let productsInCart = cart.product;
            const indexProduct = productsInCart.findIndex((product)=> product.product == pid);
           if(indexProduct == -1){

            const newProduct = {
                product : pid,
                quantity: quantity
            }
            cart.product.push(newProduct);
           }else {
            cart.product[indexProduct].quantity +=1;
           }

            await cart.save();
            return {
                status: 'success',
                msg: `The product was added successfully`
            }

        } catch (error) {
            console.log('Error trying to add product to cart', error);
        }
    }

    updatedCart = async (cid, updatedProduct)=> {
        try {
            const cart = await cartsModel.findOne({ _id: cid });
        
            if (!cart) {
              return {
                status: 'error',
                msg: `Cart with id ${cid} doesn't exist`
              };
            }
        
            // Iterar sobre el arreglo de productos actualizados
            updatedProduct.forEach(updatedProduct => {
              const { pid, quantity } = updatedProduct;
        
              // Buscar el producto en el carrito por su id
              const cartProductIndex = cart.product.findIndex(item => item.product.toString() === pid);
        
              if (cartProductIndex !== -1) {
                // Si el producto existe en el carrito, actualizar la cantidad
                cart.product[cartProductIndex].quantity = quantity;
              } else {
                // Si el producto no existe en el carrito, agregarlo
                cart.product.push({
                  product: pid,
                  quantity: quantity
                });
              }
            });
        
            // Guardar el carrito actualizado
            await cart.save();
        
            return {
              status: 'success',
              msg: 'Cart updated successfully'
            };

          } catch (error) {
            console.error('Error updating cart:', error);
            return {
              status: 'error',
              msg: 'An error occurred while updating the cart'
            };
          }
        
    }
    
    deleteProductsInCart = async (cid, pid) => {
        try {
            const cart = await cartsModel.findOne({_id: cid});
            if(!cart){
                return{
                    status: 'error',
                    msg: `Cart with id  ${cid} doesn't exist`
                };
            }

            const product = await productModel.findOne ({_id: pid});

            if(!product){
                return {
                    status: 'error',
                    msg: `Product with id ${pid} doesn't exist`
                }
            }

            cart.product = cart.product.filter((item)=> item.product.toString() !== pid);
            await cart.save();
            return {
                status:'succes',
                msg: `Product with id ${pid} removed from the cart successfully`
            }
        } catch (error) {
            console.error('Error deleting product from cart:', error);
            return {
            status: 'error',
            msg: 'An error occurred while deleting the product from the cart'
            };
            
        }
    }
    
} 