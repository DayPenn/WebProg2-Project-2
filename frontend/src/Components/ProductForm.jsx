// create a form to enable posting new products

export default function ProductForm({
    productName,
    brand,
    image,
    price,
    productQuantity,
    handleOnSubmit, 
    handleOnChange
}) {
    return <div>
        <form onSubmit={handleOnSubmit}>
            <label htmlFor="productName">Product:</label>
            <input type="text" name="productName" id="productName" 
            value={productName} onChange={handleOnChange} />
            <br/>            
            <label htmlFor="brand">Brand:</label>
            <input type="text" name="brand" id="brand" 
            value={brand} onChange={handleOnChange} />
            <br/>            
            <label htmlFor="image">Image:</label>
            <input type="text" name="image" id="image" 
            value={image} onChange={handleOnChange} />
            <br/>            
            <label htmlFor="price">Price:</label>
            <input type="text" name="price" id="price" 
            value={price} onChange={handleOnChange} />
            <br/>            
            <label htmlFor="productQuantity">Qty:</label>
            <input type="text" name="productQuantity" id="productQuantity" 
            value={productQuantity} onChange={handleOnChange} />
            <br/>
            <button>SUBMIT</button>
        </form>
    </div>
}