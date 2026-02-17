import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LessonFourPagination from '../../components/LessonFourPagination';
import './LessonFive.css'; // 引入獨立的樣式檔

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function LessonFiveProducts() {
  const [products, setProducts] = useState([]);
  const [pageInfo, setPageInfo] = useState({}); // 存放分頁資訊

  // page 參數，預設為第 1 頁
  const getProducts = async (page = 1) => {
    try {
      // API 請求加入 page 參數
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/products?page=${page}`);
      setProducts(res.data.products);
      setPageInfo(res.data.pagination); // 更新分頁資訊
    } catch (error) {
      console.error(error);
      alert('取得產品失敗');
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="container mt-4 lesson-five"> {/* 加入 lesson-five class 以套用樣式 */}
      <h2 className="mb-4 fw-bold">產品列表</h2>
      
      {/*  Bootstrap Grid System 製作響應式卡片牆 */}
      <div className="row row-cols-1 row-cols-md-3 row-cols-lg-3 g-4">
        {products.map((product) => (
          <div className="col" key={product.id}>
            <div className="card h-100 shadow-sm overflow-hidden position-relative">
              {/* 分類標籤：絕對定位於卡片左上角 */}
              <div className="position-absolute top-0 start-0 p-2" style={{ zIndex: 10 }}>
                <span className="badge rounded-pill badge-category">{product.category}</span>
              </div>
              <div className="card-img-wrapper">
                <img src={product.imageUrl} className="card-img-top" alt={product.title} />
              </div>       
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-truncate fw-bold mb-2">{product.title}</h5>
                <p className="card-text text-truncate text-white mb-2">{product.description}</p>       
                <div className="mt-auto">
                  <div className="d-flex justify-content-evenly align-items-center mb-3">
                    {/* 若有原價且原價大於售價，顯示原價刪除線 */}
                    {product.origin_price > product.price ? (
                      <small className="text-white-50 text-decoration-line-through">NT$ {product.origin_price}</small>
                    ) : null}
                    <span className="h5 mb-0 text-price">NT$ {product.price}</span>
                  </div>
                  <Link to={`/product/${product.id}`} className="btn btn-kawasaki w-100">查看詳情</Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* 分頁元件：傳入 pageInfo 與切換頁面的函式 */}
      <div className="d-flex justify-content-center mt-5">
        <LessonFourPagination pageInfo={pageInfo} handlePageChange={getProducts} />
      </div>
    </div>
  );
}
