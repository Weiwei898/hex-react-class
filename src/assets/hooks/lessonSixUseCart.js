import axios from 'axios';

// API 基本設定
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

//lessonSixUseCart.js，增加的購物車驗證邏輯、購物數量增減
export const useCart = (getCartCallback) => {
  
  // === 1. 驗證邏輯  ===
  
  // 檢查數量是否可減少 (最小為 1)
  const canDecrement = (qty) => qty > 1;

  // 檢查購物車是否可結帳 (不為空)
  const canCheckout = (cartItems) => cartItems && cartItems.length > 0;

  // === 2. API 行為邏輯 (執行動作) ===

  // 更新數量
  const updateCartItem = async (item_id, product_id, qty) => {
    try {
      await axios.put(`${API_BASE}/api/${API_PATH}/cart/${item_id}`, {
        data: {
          product_id,
          qty: Number(qty)
        }
      });
      // 更新成功後，呼叫回傳函數重新整理畫面
      if (getCartCallback) getCartCallback();
    } catch (error) {
      console.error(error);
      alert('更新數量失敗');
    }
  };

  // 送出訂單 (符合需求 2：送出後清除購物車 - API 會自動清除，只需刷新畫面)
  const submitOrder = async (data) => {
    try {
      await axios.post(`${API_BASE}/api/${API_PATH}/order`, { data });
      alert('訂單已送出');
      if (getCartCallback) getCartCallback();
    } catch (error) {
      console.error(error);
      alert('送出訂單失敗');
    }
  };

  // === 3. 回傳所有「大腦」功能給元件使用 ===
  return { 
    updateCartItem, 
    submitOrder,
    canDecrement, 
    canCheckout 
  };
};