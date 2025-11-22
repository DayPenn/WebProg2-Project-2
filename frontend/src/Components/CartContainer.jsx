import CartCard from "./CartCard";

export default function CartContainer({
  cartList,
  handleRemoveFromCart,
  handleAddQuantity,
  handleRemoveQuantity,
  handleClearCart,
}) {
  return (
    <div className="CartContainer">
      <h2>Cart items: {cartList.length}</h2>
      {cartList.length > 0 ? (
        <>
          {console.log(cartList)}
          {cartList.map((product) => (
            <CartCard
              key={product._id}
              {...product}
              handleRemoveFromCart={handleRemoveFromCart}
              handleAddQuantity={handleAddQuantity} // specifically - FROM CART
              handleRemoveQuantity={handleRemoveQuantity} // - FROM CART
            />
          ))}
          <div className="CartListBtns">
            <button onClick={() => handleClearCart()} className="RemoveButton">
              Empty Cart
            </button>
            <button id="BuyButton">
              Checkout:{" $"}
              {cartList
                .reduce(
                  (total, item) =>
                    total +
                    parseFloat(item.price.replace("$", "")) * item.quantity,
                  0
                )
                .toFixed(2)}
            </button>
          </div>
        </>
      ) : (
        <h3>No items in cart</h3>
      )}
    </div>
  );
}

//      MY ORIGINAL Project 1 solution: FOR REFERENCE
//
//      {/*TURNARY gets confusing here, replaced with short circuit*/}
//      {cart.length > 0 /*<--if left=TRUE, do RIGHT side, too*/ && (
//        <div className="CartListBtns">
//          <button onClick={handleEmptyCart}>EMPTY Cart</button>
//          <button className="BuyButton">
//            BUY (Total: ${totalPrice.toFixed(2)})
//          </button>
//        </div>
//      )}
