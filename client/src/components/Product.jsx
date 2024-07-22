import React from "react";
import axios from "axios";

const Product = () => {
  const paymentHandler = async (e) => {
    e.preventDefault();

    const amount = 60000;
    const currency = "INR";
    const receipt = "receipt#11";
    const payment_capture = 1;

    // console.log("Sending payment request with the following data:");
    // console.log({ amount, currency, receipt, payment_capture });
    try {
      const response = await axios.post(
        "http://localhost:3000/order",
        {
          amount,
          currency,
          receipt,
          payment_capture,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { data: order } = response;

      const options = {
        key: "rzp_test_hl15YLu2Q7PKHc", // Enter the Key ID generated from the Dashboard [safe to expose]
        amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency,
        name: "Acme Corp",
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler: async function (response) {
          //   alert(response.razorpay_payment_id);
          //   alert(response.razorpay_order_id);
          //   alert(response.razorpay_signature);
          const body = { ...response };
          try {
            const validateRes = await axios.post(
              "http://localhost:3000/order/validate",
              body,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            console.log(validateRes.data);
          } catch (err) {
            console.error(err);
          }
        },
        prefill: {
          name: "Ketan Chopade",
          email: "ketanchopade.kc@gmail.com",
          contact: "9000090000",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
      });
      rzp1.open();
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  return (
    <div>
      <button
        onClick={paymentHandler}
        className="border bg-gray-600 p-2 px-4 rounded-lg text-white"
      >
        Pay
      </button>
    </div>
  );
};

export default Product;
