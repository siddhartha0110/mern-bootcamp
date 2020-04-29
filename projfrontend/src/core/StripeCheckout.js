import React, { useState, useEffect } from 'react';
import { isAutheticated } from '../auth/helper';
import { emptyCart, loadCart } from './helper/cartHelper';
import { Link } from 'react-router-dom';
import StripeCheckout from 'react-stripe-checkout';
import { API } from '../backend';
import { createOrder } from './helper/orderHelper';

const StripeCheckoutComp = ({
    products,
    setReload = f => f,
    reload = undefined
}) => {

    const [data, setData] = useState({
        loading: false,
        success: false,
        error: "",
        address: ""
    })
    const token = isAutheticated() && isAutheticated().token;
    const userId = isAutheticated() && isAutheticated().user._id;

    const getFinalPrice = () => {
        return products.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price
        }, 0);
    }

    const stripePayment = (token) => {
        const body = {
            token,
            products
        }
        const headers = {
            "Content-Type": "application/json"
        }
        return fetch(`${API}/stripe_payments`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body)
        })
            .then(response => {
                console.log(response)
                const { status } = response;
                console.log("Status:", status);
                const orderData = {
                    products: products,
                    transaction_id: response.id,
                    amount: response.amount
                }
                createOrder(userId, token, orderData)
                emptyCart(() => {
                    console.log("Crash?");

                })
                setReload(!reload)

            }).catch(err => console.log(err));
    }

    const showStripeButton = () => {
        console.log(process.env.REACT_APP_PKKEY);
        return isAutheticated() ?
            (
                <StripeCheckout
                    stripeKey={process.env.REACT_APP_PKKEY}
                    token={stripePayment}
                    currency="INR"
                    amount={getFinalPrice() * 100}
                    name="Payment Confirmation"
                    shippingAddress
                    billingAddress
                >
                    <button className="btn btn-success">Continue Payment With Stripe</button>
                </StripeCheckout>
            ) : (
                <Link to="/signin">
                    <button className="btn btn-warning">Sign in before proceeding</button>
                </Link>
            )
    }

    return (
        <div>
            <h3 className="text-white">Stripe Checkout</h3>
            <p>Total Checkout Price is : Rs.{getFinalPrice()}</p>
            {showStripeButton()}
        </div>
    )
}

export default StripeCheckoutComp;
