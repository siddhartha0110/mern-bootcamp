const stripe = require('stripe')("sk_test_i51zeR6UZEuWyZBzPw5pZDJA00GzHHQE8T");
const uuid = require("uuid/v4");

exports.stripePayment = (req, res) => {
    const { products, token } = req.body
    console.log("Products", products);

    let amount = 0;
    products.map(p => {
        amount = amount + p.price
    })

    const idempotencyKey = uuid()

    return stripe.customers.create({
        email: token.email,
        source: token.id,
    })
        .then(customer => {
            stripe.charges.create({
                amount: amount * 100,
                currency: "INR",
                customer: customer.id,
                receipt_email: token.email,
                description: "Test Mode Payments",
                shipping: {
                    name: token.card.name,
                    address: {
                        line1: token.card.address_line1,
                        line2: token.card.address_line2,
                        city: token.card.address_city,
                        country: token.card.country,
                        postal_code: token.card.address_zip
                    }
                }
            }, { idempotencyKey })
                .then(response => res.status(200).json({ response }))
                .catch(err => console.log(err));
        })

}