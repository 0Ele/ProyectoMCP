import "./product.css";
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import axios from "axios";
import { useState } from "react";

const Product = () => {
  const[preferenceId,setPreferenceId] = useState(null)
  initMercadoPago('APP_USR-1ad94aa7-5fe3-4f2f-a134-0223350ebcd1',{locale:"es-MX"});

  const createPreference = async () => {
    try {
      const response = await axios.post("http://localhost:3000/create_preference", {
        title: "Curso",
        quantity: 1,
        price: 425,
      });
  
      const { id } = response.data;
      return id;
    } catch (error) {
      console.log(error);
    }
  };
  
  const handleBuy = async () => {
    const id = await createPreference();
    if (id) {
        setPreferenceId(id);
    }
};


  return (
    <div className="card-product-container">
      <div className="card-product">
        <div className="card">
          <img
            src="https://cdn.donmai.us/sample/86/aa/__elegg_goddess_of_victory_nikke_drawn_by_sjryker__sample-86aaa3d03e5408f89b47f3a9c68f1aff.jpg"
            alt="Product Image"
          />
          <h3>Store</h3>
          <p className="price">425 $ </p>
          <button onClick={handleBuy}>Comprar</button>
          {preferenceId && <Wallet initialization={{ preferenceId: preferenceId }} />}
        </div>
      </div>
    </div>
  );
};

export default Product;
