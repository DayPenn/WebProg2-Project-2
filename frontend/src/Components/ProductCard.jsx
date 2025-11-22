import QuantityCounter from "./QuantityCounter";

export default function ProductCard({
  productData,
  productQuantity,
  handleAddQuantity,
  handleRemoveQuantity,
  handleAddToCart,
  handleOnDelete, 
  setFormData,
  setIsEditing,
}) {
  return (
    <div className="ProductCard">
      <h3>{productData.productName}</h3>
      <img src={productData.image} alt="" />
      <h4>{productData.brand}</h4>
      <QuantityCounter
        handleAddQuantity={handleAddQuantity}
        productQuantity={productQuantity}
        handleRemoveQuantity={handleRemoveQuantity}
        id={productData._id}
        mode="product"
      />
      <h3>{productData.price}</h3>
      <button onClick={() => handleAddToCart(productData._id)}>
        Add to Cart
      </button>

      <button onClick={()=>{
        setFormData({
        productName: productData.productName,
        brand: productData.brand,
        image: productData.image, 
        price: productData.price,
        productQuantity, // don't need to write it twice 
        _id: productData._id,
        });
        setIsEditing(true);
      }}>EDIT</button>

      <button onClick={()=> handleOnDelete(productData._id)}>DELETE</button>
    </div>
  );
}
