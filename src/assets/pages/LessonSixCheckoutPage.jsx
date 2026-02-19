import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/lessonSixUseCart';
import LessonSixOrderForm from '../components/LessonSixOrderForm';
import { validateOrderForm } from '../utils/lessonSixValidateRules';
import './LessonFive/LessonFive.css'; // 共用樣式

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const LessonSixCheckoutPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({});

  const getCart = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      setCart(res.data.data);
    } catch (error) {
      console.error(error);
      alert('取得購物車失敗');
    }
  };

  const { submitOrder } = useCart(getCart); // 使用 Hook，傳入 getCart 以便更新
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    tel: '',
    address: '',
    message: ''
  });

  const [errors, setErrors] = useState({});

  // 取得購物車資料 (確認是否有商品)
  useEffect(() => {
    getCart();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. 驗證表單
    const validation = validateOrderForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // 2. 送出訂單
    // 這裡需要將 user 資訊包裝成 API 需要的格式
    const orderData = {
      user: {
        name: formData.name,
        email: formData.email,
        tel: formData.tel,
        address: formData.address,
      },
      message: formData.message
    };

    await submitOrder(orderData);
    navigate('/product'); // 送出成功後導回產品頁
  };

  return (
    <div className="container mt-4 lesson-five">
      <div className="row mb-4">
        <div className="col-md-8 mx-auto d-flex align-items-center">
          <h2 className="fw-bold mb-0">填寫收件資訊</h2>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-8">
          {/* 顯示購物車摘要 (可選) */}
          {cart.carts && cart.carts.length > 0 && (
            <div className="alert alert-secondary mb-4">
              <h5 className="alert-heading">訂單摘要</h5>
              <p className="mb-0">共 {cart.carts.length} 項商品，總金額：<span className="text-price fw-bold">NT$ {cart.final_total}</span></p>
            </div>
          )}

          {/* 訂單表單 */}
          <LessonSixOrderForm 
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors}
            onSubmit={handleSubmit}
            onBack={() => navigate('/cart')} // 傳入返回購物車的函式
          />
        </div>
      </div>
    </div>
  );
};

export default LessonSixCheckoutPage;