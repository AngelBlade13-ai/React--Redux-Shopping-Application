import React from "react";
import { useState } from "react";
import "./Product.scss";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BalanceIcon from "@mui/icons-material/Balance";
import useFetch from "../../hooks/useFetch";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartReducer";
import { fallbackFeaturedProducts } from "../../data/fallbackProducts";

const Product = () => {
  const id = useParams().id;
  const [selectedImg, setSelectedImg] = useState("img");
  const [quantity, setQuantity] = useState(1);
  const uploadBase = process.env.REACT_APP_UPLOAD_URL || "http://localhost:1337";

  const dispatch = useDispatch();
  const { data, loading } = useFetch(`/products/${id}?populate=*`);
  const fallbackProduct = [...fallbackFeaturedProducts.featured, ...fallbackFeaturedProducts.trending].find(
    (item) => item.id === Number(id)
  );

  const source = data?.attributes || data || fallbackProduct;
  const image1 =
    source?.img?.data?.attributes?.url ||
    source?.img?.data?.url ||
    source?.img?.url ||
    source?.img ||
    "";
  const image2 =
    source?.img2?.data?.attributes?.url ||
    source?.img2?.data?.url ||
    source?.img2?.url ||
    source?.img2 ||
    image1;
  const mainImage = selectedImg === "img2" ? image2 : image1;
  const getImageUrl = (url) => (url?.startsWith("http") ? url : `${uploadBase}${url}`);

  if (!loading && !source) {
    return (
      <div className="product">
        <div className="right">
          <h1>Product not found</h1>
          <p>This item is unavailable. Please return to the products page and try another item.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product">
      {loading && !source ? (
        "loading"
      ) : (
        <>
          <div className="left">
            <div className="images">
              <img
                src={getImageUrl(image1)}
                alt={source?.title || "Product image"}
                onClick={() => setSelectedImg("img")}
              />
              <img
                src={getImageUrl(image2)}
                alt={source?.title || "Product image"}
                onClick={() => setSelectedImg("img2")}
              />
            </div>
            <div className="mainImg">
              <img src={getImageUrl(mainImage)} alt={source?.title || "Product"} />
            </div>
          </div>
          <div className="right">
            <h1>{source?.title}</h1>
            <span className="price">${source?.price}</span>
            <p>{source?.desc}</p>
            <div className="quantity">
              <button
                onClick={() =>
                  setQuantity((prev) => (prev === 1 ? 1 : prev - 1))
                }
              >
                -
              </button>
              {quantity}
              <button onClick={() => setQuantity((prev) => prev + 1)}>+</button>
            </div>
            <button
              className="add"
              onClick={() =>
                dispatch(
                  addToCart({
                    id: data?.id || source?.id,
                    title: source?.title,
                    desc: source?.desc,
                    price: source?.price,
                    img: image1,
                    quantity,
                  })
                )
              }
            >
              <AddShoppingCartIcon /> ADD TO CART
            </button>
            <div className="links">
              <div className="item">
                <FavoriteBorderIcon /> ADD TO WISH LIST
              </div>
              <div className="item">
                <BalanceIcon /> ADD TO COMPARE
              </div>
            </div>
            <div className="info">
              <span>Vendor: Polo</span>
              <span>Product Type: T-Shirt</span>
              <span>Tag: T-Shirt, Women, Top</span>
            </div>
            <hr />
            <div className="info">
              <span>DESCRIPTION</span>
              <hr />
              <span>ADDITIONAL INFORMATION</span>
              <hr />
              <span>FAQ</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Product;
