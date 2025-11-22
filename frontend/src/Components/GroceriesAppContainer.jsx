import { useState, useEffect } from "react";
import axios from "axios";
import CartContainer from "./CartContainer";
import ProductsContainer from "./ProductsContainer";
import NavBar from "./NavBar";
import ProductForm from "./ProductForm";
import QuantityCounter from "./QuantityCounter";

// Dayna Pennock
// WEb Programming 2 - Project 2 due November 21, 2025

export default function GroceriesAppContainer() {
  // products <-- no longer used, NOW using localHost:3000 to grab from server

  // states
  const [productsData, setProductsData] = useState([]);
  const [productQuantity, setProductQuantity] = useState([]);
  const [cartList, setCartList] = useState([]);
  const [formData, setFormData] = useState({
    productName: "",
    brand: "",
    image: "",
    price: "",
    productQuantity: "",
    _id: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [postResponse, setPostResponse] = useState(null); // to be able to use date to fix bug

  // useEffects
  useEffect(() => {
    handleProductsDB();
  }, []); // add empty array [] at the end b/c we only want to call it once at the beginning of the mount, otherwise will continuously call DB

  // Handlers
  // gather the data from mongo on localhost:3000
  const handleProductsDB = async () => {
    try {
      const response = await axios.get("http://localhost:3000/products");
      console.log(response.data);
      setProductsData(response.data);

      // map out each product customer could add to cart, start all qty @ 0
      const initialQuantities = response.data.map((product) => ({
        id: product._id, // using the top one w/_ in mongo, not sure about second one...
        quantity: 0,
      }));
      setProductQuantity(initialQuantities);
    } catch (error) {
      console.log(error.message);
    }
  };

  // instead of repeating code, made it a function
  const handleResetForm = () => {
    setFormData({
      productName: "",
      brand: "",
      image: "",
      price: "",
      productQuantity: "",
      _id: "",
    });
    setIsEditing(false);
  };

  // handle the submission of product information
  const handleOnSubmit = async (e) => {
    e.preventDefault(); // prevent before brackets
    try {
      if (isEditing) {
        await handleOnUpdate(formData._id); // make changes
        handleResetForm(); // use function instead of repeating code
      } else {
        await axios.post("http://localhost:3000/products", formData);
        handleResetForm();
      }
      handleProductsDB(); // regardless of how changes were made, refresh list
    } catch (error) {
      console.log(error.message);
    }
  };

  // handle onChange event for the product submission form
  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  // ADD to quantity
  const handleAddQuantity = (productId, mode) => {
    if (mode === "cart") {
      setCartList((prev) =>
        prev.map((product) =>
          product.id === productId
            ? { ...product, quantity: product.quantity + 1 }
            : product
        )
      );
    } else if (mode === "product") {
      const newProductQuantity = productQuantity.map((product) => {
        if (product.id === productId) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      });
      setProductQuantity(newProductQuantity);
      return;
    }
  };

  const handleRemoveQuantity = (productId, mode) => {
    if (mode === "cart") {
      const newCartList = cartList.map((product) => {
        if (product.id === productId && product.quantity > 1) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      });
      setCartList(newCartList);
      return;
    } else if (mode === "product") {
      const newProductQuantity = productQuantity.map((product) => {
        if (product.id === productId && product.quantity > 0) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      });
      setProductQuantity(newProductQuantity);
      return;
    }
  };

  const handleAddToCart = (productId) => {
    const productToAdd = productsData.find((prod) => prod._id === productId);
    const productQty = productQuantity.find((prod) => prod.id === productId);

    if (productQty.quantity === 0) {
      alert(`Please select quantity for ${productToAdd.productName}`); // must select something to be able to add to cart
      return;
    }

    setCartList((prevCart) => {
      // check to see if there's an item in the cart that matches id
      const productInCart = prevCart.find((item) => item.id === productId);
      // if nothing in the cart matches, negative logic is true, does NOT exist so add it

      if (!productInCart) {
        return [
          ...prevCart, // spread existing cart before adding
          {
            ...productToAdd,
            id: productToAdd._id,
            quantity: productQty.quantity,
          },
        ];
      } else {
        // if it IS already in the cart, add to qty
        return prevCart.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + productQty.quantity }
            : item
        );
      }
    });
  };

  // everything that does not match productId remains in cart
  const handleRemoveFromCart = (productId) => {
    const newCartList = cartList.filter((product) => product.id !== productId);
    setCartList(newCartList);
  };

  const handleClearCart = () => {
    setCartList([]);
  };

  // handle UPDATING the api patch route --> PATCH(oldId), not PUT(newId)
  const handleOnUpdate = async (id) => {
    try {
      const result = await axios.patch(
        `http://localhost:3000/products/${id}`,
        formData
      );
      setPostResponse({
        // to fix bug -- we use date to be unique, change without refresh
        message: result.data.message,
        date: result.data.date,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // handle to delete one contact by id --> will run to API to delete so it will be async fctn
  const handleOnDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/products/${id}`);
      handleProductsDB();
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      <NavBar quantity={cartList.length} />
      <div className="GroceriesApp-Container">
        <ProductForm
          productName={formData.productName}
          brand={formData.brand}
          image={formData.image}
          price={formData.price}
          productQuantity={formData.productQuantity}
          handleOnSubmit={handleOnSubmit}
          handleOnChange={handleOnChange}
        />
        <ProductsContainer
          products={productsData}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleAddToCart={handleAddToCart}
          productQuantityArray={productQuantity}
          handleOnDelete={handleOnDelete}
          setFormData={setFormData}
          setIsEditing={setIsEditing}
        />
        <CartContainer
          cartList={cartList}
          handleRemoveFromCart={handleRemoveFromCart}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleClearCart={handleClearCart}
        />
      </div>
    </div>
  );
}
