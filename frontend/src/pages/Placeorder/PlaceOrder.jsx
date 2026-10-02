import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'

const PlaceOrder = () => {

  const {
    getTotalCartAmount,
    token,
    food_list,
    cartItems,
    url,
    discount
  } = useContext(StoreContext)

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  })

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value

    setData(data => ({
      ...data,
      [name]: value
    }))
  }

  const placeOrder = async (event) => {
    event.preventDefault()

    let orderItems = []

    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {

        let itemInfo = {
          ...item,
          quantity: cartItems[item._id]
        }

        orderItems.push(itemInfo)
      }
    })

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2 - discount,
      discount: discount
    }

    try {

      const response = await axios.post(
        url + "/api/order/place",
        orderData,
        {
          headers: {
            token
          }
        }
      )

      if (response.data.success) {

        alert(
          "Order received successfully! 🎉\n\n" +
          "Your order has been placed successfully."
        )

        // Go back to home page
        navigate('/')

      } else {

        alert(
          response.data.message || "Unable to place order."
        )

      }

    } catch (error) {

      console.log(error)

      alert(
        "Something went wrong while placing your order."
      )

    }
  }

  const navigate = useNavigate()

  useEffect(() => {

    if (!token) {
      navigate('/cart')
    }
    else if (getTotalCartAmount() === 0) {
      navigate('/cart')
    }

  }, [token, getTotalCartAmount, navigate])


  return (
    <form onSubmit={placeOrder} className='place-order'>

      <div className="place-order-left">

        <p className="title">
          Delivery Information
        </p>

        <div className="multi-fields">

          <input
            required
            name='firstName'
            onChange={onChangeHandler}
            value={data.firstName}
            type="text"
            placeholder='First Name'
          />

          <input
            required
            name='lastName'
            onChange={onChangeHandler}
            value={data.lastName}
            type="text"
            placeholder='Last Name'
          />

        </div>

        <input
          required
          name='email'
          onChange={onChangeHandler}
          value={data.email}
          type="email"
          placeholder='Email Address'
        />

        <input
          required
          name='street'
          onChange={onChangeHandler}
          value={data.street}
          type="text"
          placeholder='Street'
        />

        <div className="multi-fields">

          <input
            required
            name='city'
            onChange={onChangeHandler}
            value={data.city}
            type="text"
            placeholder='City'
          />

          <input
            required
            name='state'
            onChange={onChangeHandler}
            value={data.state}
            type="text"
            placeholder='State'
          />

        </div>

        <div className="multi-fields">

          <input
            required
            name='zipcode'
            onChange={onChangeHandler}
            value={data.zipcode}
            type="text"
            placeholder='Zip Code'
          />

          <input
            required
            name='country'
            onChange={onChangeHandler}
            value={data.country}
            type="text"
            placeholder='Country'
          />

        </div>

        <input
          required
          name='phone'
          onChange={onChangeHandler}
          value={data.phone}
          type="text"
          placeholder='Phone'
        />

      </div>


      <div className="place-order-right">

        <div className="cart-total">

          <h2>Cart Totals</h2>

          <div>

            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>

            <hr />

            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>
                ₹{getTotalCartAmount() === 0 ? 0 : 2}
              </p>
            </div>

            <hr />

            {discount > 0 && (
              <>
                <div className="cart-total-details">
                  <p>Discount</p>
                  <p>-₹{discount.toFixed(2)}</p>
                </div>

                <hr />
              </>
            )}

            <div className="cart-total-details">

              <b>Total</b>

              <b>
                ₹{
                  getTotalCartAmount() === 0
                    ? 0
                    : (getTotalCartAmount() + 2 - discount).toFixed(2)
                }
              </b>

            </div>

          </div>

          <button type='submit'>
            PLACE ORDER
          </button>

        </div>

      </div>

    </form>
  )
}

export default PlaceOrder