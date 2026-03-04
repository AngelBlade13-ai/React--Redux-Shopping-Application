import React from "react";
import Categories from "../../components/Categories/Categories";
import Contact from "../../components/Contact/Contact";
import FeaturedProducts from "../../components/FeaturedProducts/FeaturedProducts";
import Slider from "../../components/Slider/Slider";
import useFetch from "../../hooks/useFetch";
import { buildStoreCategories } from "../../utils/categoryUtils";
import "./Home.scss";

const Home = () => {
  const { data: categories } = useFetch("/categories?populate=*");
  const storeCategories = buildStoreCategories(categories);
  const womenCategory = storeCategories.find((category) => category.title === "Women") || storeCategories[0];
  const menCategory = storeCategories.find((category) => category.title === "Men") || storeCategories[1];

  return (
    <div className="home">
      <Slider />
      <FeaturedProducts
        title={womenCategory?.title || "featured products"}
        categoryId={womenCategory?.id}
        fallbackType="featured"
      />
      <Categories />
      <FeaturedProducts
        title={menCategory?.title || "trending products"}
        categoryId={menCategory?.id}
        fallbackType="trending"
      />
      <Contact />
    </div>
  );
};

export default Home;
