import React, { useState, useEffect } from "react";
import { loadCart, cartEmpty } from "./helper/cartHelper";
import { Link } from "react-router-dom";
import { getToken, processPayment } from "./helper/paymentBHelper";
import { createOrder } from "./helper/orderHelper";
import { isAuthenticated } from "../auth/helper";
import DropIn from "braintree-web-drop-in-react";

const PaymentB = ({
  product,
  setReload = (val) => val,
  reload = undefined,
}) => {
  const [info, setInfo] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {},
  });

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  const getTokenHere = (userId, token) => {
    getToken(userId, token).then((response) => {
      if (response.error) {
        setInfo({ ...info, error: response.error });
      } else {
        const clientToken = response.clientToken;
        setInfo({ ...info, clientToken: clientToken });
      }
    });
  };

  const showBtDropIn = () => {
    return (
      <div>
        {info.clientToken !== null && product.length > 0 ? (
          <div>
            <DropIn
              options={{ authorization: info.clientToken }}
              onInstance={(instance) => (info.instance = instance)}
            />
            <button
              className="btn btn-outline-success btn-block rounded"
              onClick={onPurchase}
            >
              Buy
            </button>
          </div>
        ) : (
          <h2>Please login or add more items</h2>
        )}
      </div>
    );
  };

  useEffect(() => {
    getTokenHere(userId, token);
  }, []);

  const onPurchase = () => {
    setInfo({ loading: true });
    let nonce;
    let getNonce = info.instance.requestPaymentMethod().then((data) => {
      nonce = data.nonce;
      const paymentData = {
        paymentMethodNonce: nonce,
        amount: getAmount(),
      };
      processPayment(userId, token, paymentData)
        .then((response) => {
          setInfo({ ...info, success: response.success, loading: false });
          console.log("success");
          // const orderData = {
          //   products: product,
          //   transaction_id: response.transaction.id,
          //   amount: response.transaction.amount,
          // };
          // console.log(response.transaction.id);
          // console.log(response.transaction.amount);
          // createOrder(userId, token, orderData);
          cartEmpty(() => {
            // console.log("cart empty");
          });
          setReload(!reload);
        })
        .catch((error) => {
          setInfo({ ...info, success: false, loading: false });
          console.log("fail");
        });
    });
  };

  const getAmount = () => {
    let amount = 0;
    product.map((p) => {
      amount = amount + p.price;
    });
    return amount;
  };

  return (
    <div>
      <h3>Your Total Bill Amount is of {getAmount()} $</h3>
      {showBtDropIn()}
    </div>
  );
};

export default PaymentB;
