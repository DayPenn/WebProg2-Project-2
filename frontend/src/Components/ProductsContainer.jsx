import ProductCard from "./ProductCard";

export default function ProductsContainer({
  products,
  handleAddQuantity,
  handleRemoveQuantity,
  handleAddToCart,
  productQuantityArray,
  handleOnDelete, 
  setFormData, 
  setIsEditing,
}) {
  return (
    <div className="ProductsContainer">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          productData={product}
          productQuantity={
            productQuantityArray.find((prod) => prod.id === product._id)
              ? productQuantityArray.find((prod) => prod.id === product._id).quantity // if exists, set to prod quantity
              : 0 // else quantity = 0
          }
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleAddToCart={handleAddToCart}
          handleOnDelete={handleOnDelete}
          setFormData={setFormData}
          setIsEditing={setIsEditing}
        />
      ))}
    </div>
  );
}
