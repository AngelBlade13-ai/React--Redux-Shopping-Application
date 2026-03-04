import React from "react";
import "./List.scss";
import Card from "../Card/Card";
import useFetch from "../../hooks/useFetch";
import { fallbackCatalogProducts } from "../../data/fallbackProducts";

const List = ({ subCats, maxPrice, sort, catId }) => {
  const subCategoryFilters = subCats
    .map((item, index) => `&[filters][sub_categories][id][$in][${index}]=${item}`)
    .join("");

  const { data, loading, error } = useFetch(
    `/products?populate=*&[filters][categories][id][$eq]=${catId}${subCategoryFilters}&[filters][price][$lte]=${maxPrice}${sort ? `&sort=price:${sort}` : ""}`
  );

  const fallbackProducts = fallbackCatalogProducts
    .filter((item) => item.categoryId === Number(catId))
    .filter((item) => Number(item.price || 0) <= Number(maxPrice))
    .filter((item) =>
      subCats.length > 0
        ? subCats.some((subCatId) => item.subCategoryIds?.includes(Number(subCatId)))
        : true
    );

  if (sort === "asc") {
    fallbackProducts.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
  }
  if (sort === "desc") {
    fallbackProducts.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
  }

  const hasApiProducts = Array.isArray(data) && data.length > 0;
  const productsToRender = hasApiProducts ? data : fallbackProducts;
  const usingFallback = !hasApiProducts;

  return (
    <div className="list">
      {usingFallback && productsToRender.length > 0 && (
        <div>Using local fallback products.</div>
      )}
      {loading && !hasApiProducts
        ? "loading"
        : productsToRender.length > 0
        ? productsToRender.map((item) => <Card item={item} key={item.id} />)
        : error
        ? "Something went wrong while loading products."
        : "No products found for this filter."}
    </div>
  );
};

export default List;
