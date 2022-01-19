import React, { useState, useEffect } from "react";
import {
  getProducts,
  getBraintreeClientToken,
  processPayment,
  createOrder,
} from "./apiCore";
import { emptyCart } from "./cartHelpers";
import Card from "./Card";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";

var newInstance = "";
const Checkout = ({ products }) => {
  const [data, setData] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {},
    address: "",
  });

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  const getToken = (userId, token) => {
    getBraintreeClientToken(userId, token).then((response) => {
      if (response.error) {
        console.log(response.error);
        console.log("data1", data);
        setData({ ...data, error: response.error });
      } else {
        console.log(response);
        setData({ clientToken: response.clientToken });
      }
    });
  };

  useEffect(() => {
    getToken(userId, token);
  }, []);

  const handleAddress = (event) => {
    console.log("data2", data);
    setData({ ...data, address: event.target.value });
  };

  const getTotal = () => {
    return products.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);
  };

  const showCheckout = () => {
    return isAuthenticated() ? (
      <div>{showDropIn()}</div>
    ) : (
      <Link to="/signin">
        <button className="btn btn-primary">Sign in to checkout</button>
      </Link>
    );
  };
  console.log("data3", data, data.instance, data.hasOwnProperty("instance"));

  if (data.instance) {
    newInstance = data.instance;
    console.log("newInstance", newInstance);
  }
  let deliveryAddress = data.address;
  console.log("data3.end", data, newInstance);

  const buy = () => {
    setData({ loading: true });
    // send the nonce to your server
    // nonce = data.instance.requestPaymentMethod()
    let nonce;
    console.log("data4", data);
    let getNonce = newInstance
      .requestPaymentMethod()
      .then((response) => {
        // console.log(data);
        nonce = response.nonce;

        const paymentData = {
          paymentMethodNonce: nonce,
          amount: getTotal(products),
        };

        processPayment(userId, token, paymentData)
          .then((response) => {
            console.log(response);

            const createOrderData = {
              products: products,
              transaction_id: response.transaction.id,
              amount: response.transaction.amount,
              address: deliveryAddress,
            };

            createOrder(userId, token, createOrderData)
              .then((response) => {
                emptyCart(() => {
                  console.log("payment success and empty cart");
                  setData({
                    loading: false,
                    success: true,
                  });
                  console.log("data10", data);
                });
              })
              .catch((error) => {
                console.log(error);
                setData({ loading: false });
                console.log("data11", data);
              });
          })
          .catch((error) => {
            console.log(error);
            setData({ loading: false });
            console.log("data12", data);
          });
      })
      .catch((error) => {
        // console.log("dropin error: ", error);
        console.log("data5", data);
        setData({ ...data, error: error.message });
      });
  };

  const showDropIn = () => (
    <div onBlur={() => setData({ ...data, error: "" })}>
      {data.clientToken !== null && products.length > 0 ? (
        <div>
          <div className="gorm-group mb-3">
            <label className="text-muted">Delivery address:</label>
            <textarea
              onChange={handleAddress}
              className="form-control"
              value={data.address}
              placeholder="Type your delivery address here..."
            />
          </div>

          <DropIn
            options={{
              authorization: data.clientToken,
              paypal: {
                flow: "vault",
              },
            }}
            onInstance={(instance) => (data.instance = instance)}
          />
          <button onClick={buy} className="btn btn-success btn-block">
            Pay
          </button>
        </div>
      ) : null}
    </div>
  );

  const showError = (error) => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  const showSuccess = (success) => (
    <div
      className="alert alert-info"
      style={{ display: success ? "" : "none" }}
    >
      Thanks! Your payment was successful!
    </div>
  );

  const showLoading = (loading) =>
    loading && <h2 className="text-danger">Loading...</h2>;

  return (
    <div>
      <h2>Total: ${getTotal()}</h2>
      {showLoading(data.loading)}
      {showSuccess(data.success)}
      {showError(data.error)}
      {showCheckout()}
    </div>
  );
};

export default Checkout;

// import React, { useState, useEffect } from "react";
// import {
//   getProducts,
//   getBraintreeClientToken,
//   processPayment,
//   createOrder,
// } from "./apiCore";
// import { emptyCart } from "./cartHelpers";
// import Card from "./Card";
// import { isAuthenticated } from "../auth";
// import { Link } from "react-router-dom";
// import DropIn from "braintree-web-drop-in-react";

// const Checkout = ({ products, setRun = (f) => f, run = undefined }) => {
//   const [data, setData] = useState({
//     loading: false,
//     success: false,
//     clientToken: null,
//     error: "",
//     instance: {},
//     address: "",
//   });

//   const userId = isAuthenticated() && isAuthenticated().user._id;
//   const token = isAuthenticated() && isAuthenticated().token;

//   const getToken = (userId, token) => {
//     getBraintreeClientToken(userId, token).then((data) => {
//       if (data.error) {
//         console.log(data.error);
//         setData({ ...data, error: data.error });
//       } else {
//         console.log(data);
//         setData({ clientToken: data.clientToken });
//       }
//     });
//   };

//   useEffect(() => {
//     getToken(userId, token);
//   }, []);

//   const handleAddress = (event) => {
//     setData({ ...data, address: event.target.value });
//   };

//   const getTotal = () => {
//     return products.reduce((currentValue, nextValue) => {
//       return currentValue + nextValue.count * nextValue.price;
//     }, 0);
//   };

//   const showCheckout = () => {
//     return isAuthenticated() ? (
//       <div>{showDropIn()}</div>
//     ) : (
//       <Link to="/signin">
//         <button className="btn btn-primary">Sign in to checkout</button>
//       </Link>
//     );
//   };

//   let deliveryAddress = data.address;

//   const buy = () => {
//     setData({ loading: true });

//     let nonce;
//     let getNonce = data.instance
//       .requestPaymentMethod()
//       .then((data) => {

//         nonce = data.nonce;

//         const paymentData = {
//           paymentMethodNonce: nonce,
//           amount: getTotal(products),
//         };

//         processPayment(userId, token, paymentData)
//           .then((response) => {
//             console.log(response);

//             const createOrderData = {
//               products: products,
//               transaction_id: response.transaction.id,
//               amount: response.transaction.amount,
//               address: deliveryAddress,
//             };

//             createOrder(userId, token, createOrderData)
//               .then((response) => {
//                 emptyCart(() => {
//                   setRun(!run);
//                   console.log("payment success and empty cart");
//                   setData({
//                     loading: false,
//                     success: true,
//                   });
//                 });
//               })
//               .catch((error) => {
//                 console.log(error);
//                 setData({ loading: false });
//               });
//           })
//           .catch((error) => {
//             console.log(error);
//             setData({ loading: false });
//           });
//       })
//       .catch((error) => {

//         setData({ ...data, error: error.message });
//       });
//   };

//   const showDropIn = () => (
//     <div onBlur={() => setData({ ...data, error: "" })}>
//       {data.clientToken !== null && products.length > 0 ? (
//         <div>
//           <div className="gorm-group mb-3">
//             <label className="text-muted">Delivery address:</label>
//             <textarea
//               onChange={handleAddress}
//               className="form-control"
//               value={data.address}
//               placeholder="Type your delivery address here..."
//             />
//           </div>

//           <DropIn
//             options={{
//               authorization: data.clientToken,
//               paypal: {
//                 flow: "vault",
//               },
//             }}
//             onInstance={(instance) => (data.instance = instance)}
//           />
//           <button onClick={buy} className="btn btn-success btn-block">
//             Pay
//           </button>
//         </div>
//       ) : null}
//     </div>
//   );

//   const showError = (error) => (
//     <div
//       className="alert alert-danger"
//       style={{ display: error ? "" : "none" }}
//     >
//       {error}
//     </div>
//   );

//   const showSuccess = (success) => (
//     <div
//       className="alert alert-info"
//       style={{ display: success ? "" : "none" }}
//     >
//       Thanks! Your payment was successful!
//     </div>
//   );

//   const showLoading = (loading) =>
//     loading && <h2 className="text-danger">Loading...</h2>;

//   return (
//     <div>
//       <h2>Total: ${getTotal()}</h2>
//       {showLoading(data.loading)}
//       {showSuccess(data.success)}
//       {showError(data.error)}
//       {showCheckout()}
//     </div>
//   );
// };

// export default Checkout;
