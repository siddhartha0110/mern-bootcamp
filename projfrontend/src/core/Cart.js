import React, { useState, useEffect } from "react";
import "../styles.css";
import Base from "./Base";
import Card from "./Card";
import { loadCart } from "./helper/cartHelper";
import StripeCheckoutComp from "./StripeCheckout";

const CartPage = () => {
    const [products, setProducts] = useState([]);
    const [relaod, setReload] = useState(false)
    useEffect(() => {
        setProducts(loadCart())
    }, [relaod])

    const loadAllProducts = () => {
        return (
            <div>
                <h2>View Your Selected Products</h2>
                {products.map((product, index) => {
                    return <Card
                        key={index}
                        product={product}
                        removeFromCart={true}
                        addtoCart={false}
                        setReload={setReload}
                        relaod={relaod} />
                })}
            </div>
        )
    }


    return (
        <Base title="Cart Page" description="View The Items Added By You Before processing to checkout">
            <div className="row text-center">
                <div className="col-6">{loadAllProducts()}</div>
                <div className="col-6">
                    <StripeCheckoutComp
                        products={products}
                        setReload={setReload}
                        reload={relaod} />
                </div>
            </div>
        </Base>
    );
}
export default CartPage;