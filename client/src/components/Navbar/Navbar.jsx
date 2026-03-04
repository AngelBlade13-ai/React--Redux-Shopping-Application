import React, { useEffect, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.scss"
import Cart from "../Cart/Cart";
import { useSelector } from "react-redux";
import useFetch from "../../hooks/useFetch";
import { buildStoreCategories } from "../../utils/categoryUtils";

const Navbar = () => {
  const [open,setOpen] = useState(false)
  const location = useLocation();
  const products = useSelector((state) => state.cart.products);
  const { data: categories } = useFetch("/categories?pagination[limit]=50");
  const derivedCategories = buildStoreCategories(categories);
  const navCategories =
    derivedCategories.length > 0
      ? derivedCategories
      : [
          { id: 1, title: "Women" },
          { id: 2, title: "Men" },
          { id: 3, title: "Accessories" },
        ];

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="left">
          <div className="item">
            <img src="/img/en.png" alt="" />
            <KeyboardArrowDownIcon />
          </div>
          <div className="item">
            <span>USD</span>
            <KeyboardArrowDownIcon />
          </div>
          {navCategories.map((category) => (
            <div className="item" key={category.id}>
              <Link className ="link" to={`/products/${category.id}`}>{category.title}</Link>
            </div>
          ))}
        </div>
        <div className="center">
          <Link className ="link" to="/">NEXTHAUL</Link>
        </div>
        <div className="right">
          <div className="item">
            <Link className ="link" to="/">Homepage</Link>
          </div>
          <div className="item">
            <Link className ="link" to="/">About</Link>
          </div>
          <div className="item">
            <Link className ="link" to="/contact">Contact</Link>
          </div>
          <div className="item">
            <Link className ="link" to={`/products/${navCategories[0]?.id || 1}`}>Store</Link>
          </div>
          <div className="icons">
            <SearchIcon/>
            <PersonOutlineOutlinedIcon/>
            <FavoriteBorderOutlinedIcon/>
            <div className="cartIcon" onClick={()=>setOpen(!open)}>
              <ShoppingCartOutlinedIcon/>
              <span>{products.length}</span>
            </div>
          </div>
        </div>
      </div>
      {open && <Cart/>}
    </div>
  );
};

export default Navbar;
