import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import List from "../../components/List/List";
import useFetch from "../../hooks/useFetch";
import { fallbackSubCategoriesByCategory } from "../../data/fallbackProducts";
import "./Products.scss";

const Products = () => {
  const catId = Number(useParams().id);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sort, setSort] = useState(null);
  const [selectedSubCats, setSelectedSubCats] = useState([]);

  const { data, loading } = useFetch(
    `/sub-categories?[filters][categories][id][$eq]=${catId}`
  );

  const handleChange = (e) => {
    const value = Number(e.target.value);
    const isChecked = e.target.checked;

    setSelectedSubCats(
      isChecked
        ? [...selectedSubCats, value]
        : selectedSubCats.filter((item) => item !== value)
    );
  };

  const apiSubCategories = Array.isArray(data)
    ? data.filter((item) => {
        const title = item?.attributes?.title || item?.title;
        return Boolean(title);
      })
    : [];

  const fallbackSubCategories = fallbackSubCategoriesByCategory[catId] || [];
  const useFallbackSubCategories = apiSubCategories.length === 0;
  const subCategories = useFallbackSubCategories
    ? fallbackSubCategories
    : apiSubCategories.map((item) => ({
        id: item.id,
        title: item?.attributes?.title || item?.title,
      }));

  return (
    <div className="products">
      <div className="left">
        <div className="filterItem">
          <h2>Product Categories</h2>
          {useFallbackSubCategories && (
            <div className="inputItem">Using local fallback subcategories.</div>
          )}
          {loading && !useFallbackSubCategories
            ? "loading"
            : subCategories.map((item) => {
                const subCatId = item?.id;
                const subCatTitle = item?.title || `Subcategory ${subCatId}`;

                return (
                  <div className="inputItem" key={subCatId}>
                    <input
                      type="checkbox"
                      id={String(subCatId)}
                      value={subCatId}
                      onChange={handleChange}
                    />
                    <label htmlFor={String(subCatId)}>{subCatTitle}</label>
                  </div>
                );
              })}
        </div>
        <div className="filterItem">
          <h2>Filter by price</h2>
          <div className="inputItem">
            <span>0</span>
            <input
              type="range"
              min={0}
              max={1000}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
            <span>{maxPrice}</span>
          </div>
        </div>
        <div className="filterItem">
          <h2>Sort by</h2>
          <div className="inputItem">
            <input
              type="radio"
              id="asc"
              value="asc"
              name="price"
              onChange={(e) => setSort("asc")}
            />
            <label htmlFor="asc">Price (Lowest first)</label>
          </div>
          <div className="inputItem">
            <input
              type="radio"
              id="desc"
              value="desc"
              name="price"
              onChange={(e) => setSort("desc")}
            />
            <label htmlFor="desc">Price (Highest first)</label>
          </div>
        </div>
      </div>
      <div className="right">
        <img
          className="catImg"
          src="https://images.pexels.com/photos/1074535/pexels-photo-1074535.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt=""
        />
        <List catId={catId} maxPrice={maxPrice} sort={sort} subCats={selectedSubCats} />
      </div>
    </div>
  );
};

export default Products;
