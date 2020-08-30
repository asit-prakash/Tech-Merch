import React, { useState, useEffect } from "react";
import "../styles.css";
import Base from "./Base";
import Card from "./Card";
import { getProducts } from "./helper/coreapicalls";

const Home = () => {
  const [products, setproducts] = useState([]);
  const [error, seterror] = useState(false);

  //load all products
  const loadAllProducts = () => {
    getProducts().then((data) => {
      if (data.error) {
        seterror(data.error);
      } else {
        setproducts(data);
      }
    });
  };

  //calling loadAllProducts after render cycle completes
  useEffect(() => {
    loadAllProducts();
  }, []);

  return (
    <Base title="Techmerch.com" description="An amazing Tech Merchandise store">
      <div className="row text-center">
        <div className="row">
          {products.map((product, index) => {
            return (
              <div key={index} className="col-3 mb-4">
                <Card product={product}/>
              </div>
            );
          })}
        </div>
      </div>
    </Base>
  );
};

export default Home;