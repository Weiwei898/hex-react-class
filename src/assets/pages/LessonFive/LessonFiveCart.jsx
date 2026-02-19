import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
// 因應LessonSix作業進行LessonFiveCart最小改動，(引入自定義 Hook)
import { useCart } from '../../hooks/lessonSixUseCart';
import './LessonFive.css';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function LessonFiveCart() {
  // 因應LessonSix作業進行LessonFiveCart最小改動，(驗證登入狀態，useNavigate 進行頁面跳轉)
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

  // 因應LessonSix作業進行LessonFiveCart最小改動，(使用 useCart Hook 取出需要的資料與函式，並傳入 getCart 以便更新畫面)
  //這裡有報錯 等最後的內容都搞定再回來檢查
  const { updateCartItem, canDecrement, canCheckout } = useCart(getCart);

  const removeCartItem = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/cart/${id}`);
      getCart(); // 重新取得購物車列表
    } catch (error) {
      console.error(error);
      alert('刪除失敗');
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  return (
    <div className="container mt-4 lesson-five">
      <h2 className="mb-4 fw-bold">購物車</h2>
      
      {cart.carts?.length > 0 ? (
        <div className="card border-0 shadow-sm overflow-hidden">
          <div className="card-body p-0">
            <table className="table table-dark table-hover mb-0 align-middle">
              <thead className="table-active">
                <tr>
                  <th scope="col" className="ps-4 py-3">品名</th>
                  <th scope="col" className="py-3">數量</th>
                  <th scope="col" className="py-3 text-end">單價</th>
                  <th scope="col" className="py-3 text-end pe-4">小計</th>
                  <th scope="col" className="py-3 text-center">操作</th>
                </tr>
              </thead>
              <tbody>
                {cart.carts.map((item) => (
                  <tr key={item.id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center">
                        <img src={item.product.imageUrl} alt={item.product.title} style={{ width: '50px', height: '50px', objectFit: 'cover' }} className="rounded me-3" />
                        <span className="fw-bold">{item.product.title}</span>
                      </div>
                    </td>
                    <td>
                      {/* 因應LessonSix作業進行LessonFiveCart最小改動，(修改數量顯示為可操作的按鈕群組) */}
                      <div className="input-group input-group-sm" style={{ width: '120px' }}>
                        <button 
                          className="btn btn-outline-secondary" 
                          type="button" 
                          onClick={() => updateCartItem(item.id, item.product_id, item.qty - 1)}
                          disabled={!canDecrement(item.qty)}
                        >
                          -
                        </button>
                        <input type="text" className="form-control text-center" value={item.qty} readOnly />
                        <button 
                          className="btn btn-outline-secondary" 
                          type="button" 
                          onClick={() => updateCartItem(item.id, item.product_id, item.qty + 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="text-end">NT$ {item.product.price}</td>
                    <td className="text-end pe-4 text-price">NT$ {item.final_total}</td>
                    <td className="text-center">
                      <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => removeCartItem(item.id)}>
                        <i className="bi bi-trash"></i> 刪除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="text-end py-3 fw-bold">總計</td>
                  <td className="text-end py-3 pe-4 fs-4 text-price fw-bold">NT$ {cart.final_total}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="card-footer bg-dark border-top border-secondary p-3 d-flex justify-content-end">
            <Link to="/product" className="btn btn-outline-light me-2">繼續購物</Link>
            {/* 因應LessonSix作業進行LessonFiveCart最小改動，(加入結帳按鈕的狀態控制) */}
            <button 
              type="button" 
              className={`btn btn-kawasaki ${!canCheckout(cart.carts) ? 'disabled' : ''}`}
              onClick={() => navigate('/userlogin')} // 點擊後導向登入頁面進行驗證
              disabled={!canCheckout(cart.carts)}
            >
              前往結帳
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-5">
          <p className="fs-4 text-secondary mb-4">購物車目前沒有商品</p>
          <Link to="/product" className="btn btn-kawasaki">去逛逛</Link>
        </div>
      )}
    </div>
  );
}
