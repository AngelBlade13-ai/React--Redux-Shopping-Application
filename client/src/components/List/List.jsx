import React from "react";
import "./List.scss";
import Card from "../Card/Card";
import useFetch from "../../hooks/useFetch";

const List = ({ subCats, maxPrice, sort, catId }) => {
  const subCategoryFilters = subCats
    .map((item, index) => `&[filters][sub_categories][id][$in][${index}]=${item}`)
    .join("");

  const { data, loading, error } = useFetch(
    `/products?populate=*&[filters][categories][id][$eq]=${catId}${subCategoryFilters}&[filters][price][$lte]=${maxPrice}${sort ? `&sort=price:${sort}` : ""}`
  );
  const productsToRender = Array.isArray(data) ? data : [];

  return (
    <div className="list">
      {error
        ? "Something went wrong while loading products."
        : loading
        ? "loading"
        : productsToRender.length > 0
        ? productsToRender.map((item) => <Card item={item} key={item.id} />)
        : "No products found for this filter."}
    </div>
  );
};

export default List;
