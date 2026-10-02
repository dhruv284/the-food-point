import React, { useContext, useState } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom';
import confetti from "canvas-confetti";

const Cart = () => {

  const { cartItems, food_list, removeFromCart, getTotalCartAmount,url, discount, setDiscount } = useContext(StoreContext);

  const [promoCode, setPromoCode] = useState("");

  const navigate = useNavigate();

  const applyPromoCode = () => {
    const code = promoCode.trim().toUpperCase();
    const subtotal = getTotalCartAmount();

    if (code === "FOOD10" && subtotal > 0) {
      setDiscount(subtotal * 0.10);

      confetti({
        particleCount: 120,
        spread: 70,
        startVelocity: 30,
        gravity: 0.7,
        ticks: 250,
        origin: { x: 0, y: 0.6 },
        scalar: 1.1,
      });

      confetti({
        particleCount: 120,
        spread: 70,
        startVelocity: 30,
        gravity: 0.7,
        ticks: 250,
        origin: { x: 1, y: 0.6 },
        scalar: 1.1,
      });

    } else {
      setDiscount(0);
      alert("Invalid promo code");
    }
  };

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div>
                <div className='cart-items-title cart-items-item'>
                  <img src={url+"/images/"+item.image} alt="" />
                  <p>{item.name}</p>
                  <p>₹{item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>₹{item.price * cartItems[item._id]}</p>
                  <p onClick={()=>removeFromCart(item._id)} className='cross'>x</p>
                </div>
                <hr />
              </div>
            )
          }
        })}
      </div>
      <div className="cart-bottom">
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
              <p>₹{getTotalCartAmount()===0?0:2}</p>
            </div>
            <hr />
            {discount > 0 && (
              <>
                <div key={discount} className="cart-total-details discount-row">
                  <p>Discount </p>
                  <p>-₹{discount.toFixed(2)}</p>
                </div>
                <hr />
              </>
            )}
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ₹{getTotalCartAmount() === 0
                  ? 0
                  : (getTotalCartAmount() + 2 - discount).toFixed(2)}
              </b>
            </div>
          </div>
          <button onClick={()=>navigate('/order')}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, enter it here</p>
            <div className='cart-promocode-input'>
              <input
                type="text"
                placeholder="Promo Code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button onClick={applyPromoCode}>Apply</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
