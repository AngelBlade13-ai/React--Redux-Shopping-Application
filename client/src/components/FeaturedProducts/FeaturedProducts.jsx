import React from "react";
import Card from "../Card/Card";
import "./FeaturedProducts.scss";
import useFetch from "../../hooks/useFetch";
import { fallbackFeaturedProducts } from "../../data/fallbackProducts";

const FeaturedProducts = ({ title, categoryId, fallbackType = "featured" }) => {
  const { data, loading, error } = useFetch(
    categoryId
      ? `/products?populate=*&[filters][categories][id][$eq]=${categoryId}&pagination[limit]=4&sort=createdAt:desc`
      : `/products?populate=*&pagination[limit]=4&sort=createdAt:desc`
  );
  const productsToRender =
    Array.isArray(data) && data.length > 0
      ? data
      : fallbackFeaturedProducts[fallbackType] || [];
  const showError = error && productsToRender.length === 0;

  return (
    <div className="featuredProducts">
      <div className="top">
        <h1>{title}</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum
          suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan
          lacus vel facilisis labore et dolore magna aliqua. Quis ipsum
          suspendisse ultrices gravida. Risus commodo viverra maecenas.
        </p>
      </div>
      <div className="bottom">
        {showError
          ? "Something went wrong!"
          : loading
          ? "loading"
          : productsToRender.map((item) => <Card item={item} key={item.id} />)}
      </div>
    </div>
  );
};

export default FeaturedProducts;
