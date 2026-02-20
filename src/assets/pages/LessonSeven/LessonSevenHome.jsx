import { Link } from 'react-router-dom';
import './LessonSeven.css'; // 確保路徑指向你的 CSS 檔案

export default function LessonSevenHome() {
  return (
    <div className="lesson-seven">
      {/* Hero Section - 大視覺區塊 */}
      <div className="hero-section py-5 mb-5 text-center">
        <div className="container py-5">
          <h1 className="display-3 fw-bold text-white mb-3">
            KAWASAKI <span style={{ color: '#69BE28' }}>CERTIFIED</span>
          </h1>
          <p className="lead text-white-50 mb-4">
            尋找你的下一台川崎靈魂。嚴選優質二手重機，專業技師鑑定。
          </p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <Link to="/product" className="btn btn-kawasaki btn-lg px-4 gap-3">
              立即賞車
            </Link>
            <Link to="/coming-soon" className="btn btn-outline-light btn-lg px-4">
              預約鑑定
            </Link>
          </div>
        </div>
      </div>

      <div className="container pb-5">
        {/* 精選分類區塊 */}
        <div className="row mb-5">
          <div className="col-12 border-start border-4 border-success ps-3 mb-4">
            <h2 className="text-white m-0">精選車種</h2>
          </div>
          
          {[
            { name: 'NINJA 系列', desc: '賽道熱血首選', img: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800' },
            { name: 'Z 系列', desc: '純粹街車本色', img: 'https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?q=80&w=800' },
            { name: 'VERSYS 系列', desc: '跨界休旅首選', img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=800' }
          ].map((item, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card h-100 product-card">
                <div className="card-img-wrapper">
                  <div className="position-absolute top-0 start-0 p-2" style={{ zIndex: 5 }}>
                    <span className="badge rounded-pill badge-category-home">TOP SELLING</span>
                  </div>
                  <Link to="/product"><img src={item.img} className="card-img-top" alt={item.name} /></Link>
                </div>
                <div className="card-body">
                  <h5 className="card-title fw-bold">{item.name}</h5>
                  <p className="card-text text-white-50 small">{item.desc}</p>
                  <p className="text-price mb-3">熱烈銷售中</p>
                  <Link to="/product" className="btn btn-kawasaki w-100">查看更多</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 廣告橫幅 */}
        <div className="row">
          <div className="col-12">
            <div className="p-4 rounded-3" style={{ border: '1px solid #69BE28', backgroundColor: 'rgba(105, 190, 40, 0.05)' }}>
              <div className="row align-items-center">
                <div className="col-md-8 text-white">
                  <h4 className="fw-bold">專業估價，高價收購</h4>
                  <p className="m-0">換車沒壓力！我們提供最公平的舊車鑑價服務。</p>
                </div>
                <div className="col-md-4 text-end">
                  <Link to="/coming-soon" className="btn btn-kawasaki">我要賣車</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}