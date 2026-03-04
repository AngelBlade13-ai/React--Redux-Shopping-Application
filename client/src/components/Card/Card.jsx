import React from "react";
import "./Card.scss";
import { Link } from "react-router-dom";

const Card = ({ item }) => {
  const uploadBase = process.env.REACT_APP_UPLOAD_URL || "http://localhost:1337";
  const attr = item?.attributes || item;
  const formatPrice = (value) => Number(value || 0).toFixed(2);

  const firstImage =
    attr?.img?.data?.attributes?.url ||
    attr?.img?.url ||
    attr?.img?.data?.url ||
    attr?.img ||
    "";
  const secondImage =
    attr?.img2?.data?.attributes?.url ||
    attr?.img2?.url ||
    attr?.img2?.data?.url ||
    attr?.img2 ||
    firstImage;

  const buildImageUrl = (url) => (url?.startsWith("http") ? url : `${uploadBase}${url}`);
  const productRouteId = item?.documentId || attr?.documentId || item?.id;

  return (
    <Link className="link" to={`/product/${productRouteId}`}>
      <div className="card">
        <div className="image">
          {attr?.isNew && <span>New Season</span>}
          <img src={buildImageUrl(firstImage)} alt={attr?.title || "Product"} className="mainImg" />
          <img src={buildImageUrl(secondImage)} alt={attr?.title || "Product"} className="secondImg" />
        </div>
        <h2>{attr?.title}</h2>
        <div className="prices">
          <h3>${formatPrice(attr?.oldPrice || Number(attr?.price || 0) + 20)}</h3>
          <h3>${formatPrice(attr?.price)}</h3>
        </div>
      </div>
    </Link>
  );
};

export default Card;
