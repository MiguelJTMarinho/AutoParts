import React, { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetails,
  fetchSimilarProducts,
} from "../../redux/slices/productsSlice";
import { addToCart } from "../../redux/slices/cartSlice";

const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, similarProducts, loading, error } = useSelector(
    (state) => state.products,
  );
  const { user, guestId } = useSelector((state) => state.auth);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const productGetfetchId = productId || id;

  useEffect(() => {
    if (productGetfetchId) {
      dispatch(fetchProductDetails(productGetfetchId));
      dispatch(fetchSimilarProducts({ productId: productGetfetchId }));
    }
  }, [dispatch, productGetfetchId]);

  const handleQuantityChange = (action) => {
    if (action === "plus") setQuantity((prev) => prev + 1);
    if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    setIsButtonDisabled(true);
    dispatch(
      addToCart({
        productId: productGetfetchId,
        quantity,
        userId: user?.id,
        guestId,
      }),
    )
      .unwrap()
      .then(() => {
        toast.success("Product added to cart!", {
          duration: 1000,
        });
      })
      .catch((err) => {
        toast.error(err?.error || "Error adding to cart. Please check stock.");
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].image_url);
    }
  }, [selectedProduct]);

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="py-10">
      {selectedProduct && (
        <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* LEFT SIDE */}
            <div className="flex gap-4">
              {/* thumbnails */}
              <div className="hidden md:flex flex-col gap-3">
                {selectedProduct.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.image_url}
                    onClick={() => setMainImage(image.image_url)}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === image.image_url ? "border-black" : "border-gray-400"}`}
                  />
                ))}
              </div>

              {/* main image */}
              <div className="flex-1">
                {mainImage && (
                  <img
                    src={mainImage}
                    alt={selectedProduct.name}
                    className="w-full rounded-lg border"
                  />
                )}

                {/* mobile thumbs */}
                <div className="flex md:hidden gap-2 mt-3 overflow-x-auto">
                  {selectedProduct.images.map((image, index) => (
                    <img
                      key={index}
                      src={image.image_url}
                      onClick={() => setMainImage(image.image_url)}
                      className={`w-16 h-16 object-cover rounded-lg cursor-pointer border ${mainImage === image.image_url ? "border-black" : "border-gray-400"}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div>
              <h1 className="text-3xl font-semibold mb-2">
                {selectedProduct.name}
              </h1>

              <p className="text-2xl text-main-blue font-bold mb-4">
                ${selectedProduct.price}
              </p>

              <p className="text-gray-600 mb-6">
                {selectedProduct.description}
              </p>

              {/* quantity */}
              <div className="mb-6">
                <p className="mb-2 font-medium">Quantity</p>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleQuantityChange("minus")}
                    className={`px-3 py-1 bg-gray-200 rounded ${quantity === 1 ? "cursor-default" : "cursor-pointer"}`}
                  >
                    -
                  </button>

                  <span className="px-4 py-1 border rounded">{quantity}</span>

                  <button
                    onClick={() => handleQuantityChange("plus")}
                    className="px-3 py-1 bg-gray-200 rounded cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* add to cart */}
              <button
                onClick={handleAddToCart}
                disabled={isButtonDisabled}
                className={`w-full bg-main-blue text-white py-3 rounded font-semibold hover:opacity-90 cursor-pointer ${isButtonDisabled ? "cursor-not-allowed opacity-50" : ""}`}
              >
                {isButtonDisabled ? "Adding..." : "Add to cart"}
              </button>

              {/* characteristics */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-3">Characteristics</h3>

                <table className="w-full text-sm">
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-2 text-gray-500">SKU</td>
                      <td>{selectedProduct.sku}</td>
                    </tr>

                    <tr>
                      <td className="py-2 text-gray-500">Category</td>
                      <td>{selectedProduct.category}</td>
                    </tr>

                    <tr>
                      <td className="py-2 text-gray-500">Part Brand</td>
                      <td>{selectedProduct.part_brand}</td>
                    </tr>

                    <tr>
                      <td className="py-2 text-gray-500">Condition</td>
                      <td>{selectedProduct.condition}</td>
                    </tr>

                    <tr>
                      <td className="py-2 text-gray-500">Stock</td>
                      <td>
                        {selectedProduct.stock > 0
                          ? `${selectedProduct.stock} available`
                          : "Out of stock"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3">Compatibility</h3>

              <div className="space-y-2">
                {selectedProduct.compatibility.map((item, index) => (
                  <div
                    key={index}
                    className="border p-3 rounded text-sm flex justify-between"
                  >
                    <span>
                      {item.brand} {item.model}
                    </span>

                    <span className="text-gray-500">
                      {item.year_start} - {item.year_end}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3">OEM References</h3>

              <div className="space-y-2">
                {selectedProduct.oem_references.map((oem, index) => (
                  <div
                    key={index}
                    className="border p-3 rounded text-sm flex justify-between"
                  >
                    <span>{oem.reference_code}</span>

                    <span className="text-gray-500">
                      {oem.brand} ({oem.type})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-20">
            <h2 className="text-2xl text-center font-medium mb-4">
              {" "}
              You May Also Like
            </h2>
            <ProductGrid
              products={similarProducts}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
