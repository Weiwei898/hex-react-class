import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './LessonFive.css';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function LessonFiveSingleProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(''); // 新增：控制主圖顯示

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`);
        setProduct(res.data.product);
        setMainImage(res.data.product.imageUrl); // 初始化主圖
      } catch (error) {
        console.error(error);
        alert('取得產品失敗');
      }
    };
    getProduct();
  }, [id]);

  // 加入購物車
  const addToCart = async () => {
    try {
      await axios.post(`${API_BASE}/api/${API_PATH}/cart`, {
        data: {
          product_id: product.id,
          qty: 1
        }
      });
      alert('已加入購物車');
    } catch (error) {
      console.error(error);
      alert('加入購物車失敗');
    }
  };

  if (!product) return <div className="container">Loading...</div>;

  return (
    <div className="container mt-4 lesson-five">
      <div className="card border-0 shadow-sm overflow-hidden">
        <div className="card-body">
          <div className="row g-4">
            {/* 左側：圖片區塊 */}
            <div className="col-md-6">
              <div className="position-relative mb-3">
                <img 
                  src={mainImage} 
                  className="img-fluid rounded w-100" 
                  alt={product.title} 
                  style={{ objectFit: 'cover', maxHeight: '500px' }} 
                />
                <div className="position-absolute top-0 start-0 p-2" style={{ zIndex: 10 }}>
                  <span className="badge rounded-pill badge-category" style={{ transform: 'translate(-5px, -5px)' }}>{product.category}</span>
                </div>
              </div>

              {/* 更多圖片 (縮圖) */}
              {product.imagesUrl && product.imagesUrl.length > 0 && (
                <div className="d-flex flex-wrap gap-2">
                  {/* 點擊縮圖切換主圖 */}
                  <img 
                    src={product.imageUrl} 
                    className={`img-thumbnail border-secondary ${mainImage === product.imageUrl ? 'border-2 border-success' : 'bg-transparent'}`}
                    alt="主圖縮圖" 
                    style={{ width: 80, height: 80, objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => setMainImage(product.imageUrl)}
                  />
                  {product.imagesUrl.map((url, index) => (
                    <img 
                      key={index} 
                      src={url} 
                      className={`img-thumbnail border-secondary ${mainImage === url ? 'border-2 border-success' : 'bg-transparent'}`}
                      alt={`縮圖 ${index + 1}`} 
                      style={{ width: 80, height: 80, objectFit: 'cover', cursor: 'pointer' }} 
                      onClick={() => setMainImage(url)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 右側：商品資訊 */}
            <div className="col-md-6 d-flex flex-column align-items-start text-start">
              <div className="mb-auto w-100">
                <h2 className="fw-bold mb-3">{product.title}</h2>
                <div>
                  <h5 className="fw-bold">產品描述：</h5>
                  <p className="text-white-50">{product.description}</p>
                </div>
                <div>
                  <h5 className="fw-bold">產品內容：</h5>
                  <p className="text-white-50">{product.content}</p>
                </div>
              </div>

              <div className="mt-4 w-100">
                <hr className="border-secondary" />
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex align-items-center gap-3">
                    {product.origin_price > product.price && (
                      <span className="text-white-50 text-decoration-line-through fs-5">NT$ {product.origin_price}</span>
                    )}
                    <span className="h3 mb-0 text-price">NT$ {product.price}</span>
                  </div>
                </div>
                
                <div className="d-flex gap-3">
                  <button type="button" className="btn btn-outline-light flex-grow-1" onClick={addToCart}>加入購物車</button>
                  <Link to="/product" className="btn btn-kawasaki flex-grow-1">回到列表</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
