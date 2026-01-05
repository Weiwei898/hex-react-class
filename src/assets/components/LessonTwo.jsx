import React, { useState } from 'react';
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const LessonTwo = ({ onBack }) => {

  const [isAuth, setIsAuth] = React.useState(false);//用來確認驗證是否成功，ture渲染產品列表/false維持登入畫面
  const [products, setProducts] = React.useState([]);//用來存放API讀出的資料
  const [tempProduct, setTempProduct] = React.useState(null);//用來渲染產品詳細內容，ture彈出詳細內容畫面/false顥示選擇產品
  const [messageSignIn, setMessageSignIn] = React.useState("");//登入提示訊息
  const [isErrorSignIn, setIsErrorSignIn] = React.useState(false);//錯誤提示訊息
  const [emailSignIn, setEmailSignIn] = React.useState("");//存放信箱驗證用
  const [passwordSignIn, setPasswordSignIn] = React.useState("");//存放密碼驗證用

  //登入API
  const signIn = async () => {
    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, {
        username: emailSignIn,
        password: passwordSignIn
      });
      const { token, expired } = response.data;
      // 寫入 cookie token，expires 設置有效時間
      document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
      axios.defaults.headers.common['Authorization'] = token;

      setMessageSignIn("登入成功");

      setIsAuth(true);
      setIsErrorSignIn(false);
      getData();
    } catch (error) {
      setMessageSignIn(error.response.data.message);
      setIsErrorSignIn(true);
    }
  };

  //存取cookie維持登入
  const checkLogin = async () => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1",
    );
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
      setIsAuth(true);
      getData();
    }
  };
  
  //登出並清空畫面資訊
  const checkOut = () => {
    document.cookie = "hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    setIsAuth(false);
    setProducts([]);
    setTempProduct(null);
    setMessageSignIn("");
    setIsErrorSignIn(false);
    setEmailSignIn("");
    setPasswordSignIn("");
    axios.defaults.headers.common['Authorization'] = '';
  };

  // 畫面載入時檢查是否已登入
  React.useEffect(() => {
    checkLogin();
  }, []);

  //取得產品API
  const getData = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products`);
      setProducts(response.data.products);
    } catch (error) {
      console.dir(error);
      alert('資料取得失敗');
    }
  };

  return (
    <>
      <div className="p-3 border rounded bg-light mb-3">
        <h3>第二週作業：RESTful API 串接</h3>
      </div><button onClick={onBack} className="btn btn-secondary mb-5">返回首頁列表</button>

      {isAuth ? (
        <>
          <div className="container">
              <h2 className="">產品列表</h2>
              <button type="button" className="btn btn-danger" onClick={checkOut}>登出</button>
            <ul className="row mt-3 list-unstyled">
              {products.map((item) => (
                <li key={item.id} className="col-md-4">
                  <div className="card h-100 shadow border-0 hover-shadow transition bg-primary-subtle">
                    <div style={{ overflow: 'hidden' }} className="rounded rounded-top-5 border-0 hover-shadow mb-3">
                      <img src={item.imageUrl} alt="" className="" style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain'
                      }} />
                    </div>
                    <div className="card-body">
                      <h5>{item.title}</h5>
                      <div className="d-flex justify-content-center align-items-center gap-3">
                        <p>原價：{item.origin_price}元</p>
                        <p>售價：{item.price}元</p>
                      </div>
                      <p>是否啟用：{item.is_enabled ? "啟用" : "未啟用"}</p>
                      <button className="btn btn-primary" onClick={() => setTempProduct(item)}>
                        查看細節
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {tempProduct ? (
          <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <span className="fs-4 ms-2">{tempProduct.category}</span>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setTempProduct(null)}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body row">
                  <div className="col-md-7">
                    <img src={tempProduct.imageUrl} alt={tempProduct.title} className="w-100 img-thumbnail mb-3" />
                  </div>
                  <div className="col-md-5 d-flex flex-column justify-content-center align-items-start">
                    <h1 className="modal-title">{tempProduct.title}</h1>
                    <p>內容：{tempProduct.content}</p>
                    <p>描述：{tempProduct.description}</p>
                    <p>
                      售價：{tempProduct.price} <del>{tempProduct.origin_price}</del> 元
                    </p>
                    <p>更多圖片：</p>
                    <div className="d-flex flex-wrap gap-2">
                      {tempProduct.imagesUrl?.map((url, index) => (
                        <img key={index} src={url} className="img-thumbnail" alt="" style={{ width: 100 }} />
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-secondary">請選擇一個商品查看</p>
        )}
        </>
      ) : (
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-6 border border-1 bg-light p-3 rounded shadow mb-3 text-center">
              <h2>使用者登入</h2>
              <div className="form-floating mb-3">
                <input
                  value={emailSignIn}
                  onChange={(e) => setEmailSignIn(e.target.value)}
                  type="email" className="form-control" id="floatingInput" placeholder="name@example.com" />
                <label >Email address</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  value={passwordSignIn}
                  onChange={(e) => setPasswordSignIn(e.target.value)}
                  type="password" className="form-control" id="floatingPassword" placeholder="Password" />
                <label >Password</label>
              </div>
              {messageSignIn && (
                <p className={`mt-2 ${isErrorSignIn ? 'text-danger' : 'text-success'}`}>
                  {messageSignIn}
                </p>
              )}
              <button type="button" className="btn btn-primary" onClick={signIn}>
                登入
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default LessonTwo;