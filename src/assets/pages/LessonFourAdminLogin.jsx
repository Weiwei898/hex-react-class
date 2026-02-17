import React, { useState, useEffect } from 'react';
// 助教建議已解構取出 useState，下方可不再從 React 中選取，useEffect 也可以這麼做
import axios from 'axios'
import Pagination from '../components/LessonFourPagination';
import ProductModal from '../components/LessonFourProductModal';
import DeleteModal from '../components/LessonFourDeleteModal';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const LessonFourAdminLogin = ({ onBack }) => {
  // 助教建議，解構後的 Hook 使用方式更簡潔(不用再加React.useState)
  const [isAuth, setIsAuth] = useState(false); // 用來確認驗證是否成功，true渲染產品列表/false維持登入畫面
  const [products, setProducts] = useState([]); // 用來存放API讀出的資料
  const [pageInfo, setPageInfo] = useState({}); // 存放分頁資訊
  const [tempProduct, setTempProduct] = useState(null); // 用來渲染產品詳細內容，true彈出詳細內容畫面/false顯示選擇產品
  const [messageSignIn, setMessageSignIn] = useState(""); // 登入提示訊息
  const [isErrorSignIn, setIsErrorSignIn] = useState(false); // 錯誤提示訊息

  // Modal 控制狀態
  const [isProductModalOpen, setIsProductModalOpen] = useState(false); // 控制新增/編輯商品modal預設是關閉
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 控制刪除商品modal預設是關閉
  const [modalType, setModalType] = useState('create'); // 'create' or 'edit' (建立或編輯)，預設create
  
  // 編輯/刪除時選中的產品 (傳給 Modal 用)
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 2. 集中管理登入資訊 (物件形式)
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });

  // 處理表單欄位變更的通用函式 (onChange 觸發)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };


  //登入API => { ：這是要寫程式邏輯的地方 (要記得寫 return 才有值)。
  const signIn = async () => {
    try {
      //配合 集中管理登入資訊 (物件形式)修正由 改由loginData物件發送請求
      const response = await axios.post(`${API_BASE}/admin/signin`, loginData);
      const { token, expired } = response.data;
      // 寫入 cookie token，expires 設置有效時間
      document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
      axios.defaults.headers.common['Authorization'] = token;

      setMessageSignIn("登入成功");

      setIsAuth(true);  // 驗證成功
      setIsErrorSignIn(false); // 不需執行 SignIn Error提示
      getData(); // 登入成功後執行，跳轉到預設商品頁面
    } catch (error) {
      setMessageSignIn(error.response.data.message);
      setIsErrorSignIn(true);
    }
  };

  // 3. 驗證登入 API (取代純 Cookie 檢查)
  const checkLogin = async () => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1",
    );
    if (!token) return;//!token意思是沒有token就結束?，有的話往下執行

    axios.defaults.headers.common['Authorization'] = token;
    try {
      // 串接檢查登入 API 確保 Token 依然有效
      await axios.post(`${API_BASE}/api/user/check`);
      setIsAuth(true); //驗證成功
      getData(); // 登入成功後執行，跳轉到預設商品頁面
    } catch (error) {
      // 若 Token 失效則清除本地狀態
      setIsAuth(false); //驗證失敗
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // 3. 登出 API
  const checkOut = async () => {
    try {
      // 呼叫登出 API 註銷 Token
      await axios.post(`${API_BASE}/logout`);
    } catch (error) {
      console.warn('伺服器登出失敗，但將強制清除本地狀態');
    } finally {
      // finally是無論 API 成功與否，皆清除本地 Token 與狀態
      document.cookie = "hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      setIsAuth(false);
      setProducts([]);
      setTempProduct(null);
      setMessageSignIn("");
      setLoginData({ username: "", password: "" });
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // 畫面載入時檢查是否已登入，助教建議，解構後的 Hook 使用方式更簡潔(不用再加React.useEffect)
  useEffect(() => {
    checkLogin();
  }, []);

  //取得產品API
  // 預設使用當前頁面 (pageInfo.current_page)，若無則回第 1 頁。這樣編輯/刪除後不會跳回第一頁。
  const getData = async (page = pageInfo.current_page || 1) => {
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products?page=${page}`);
      setProducts(response.data.products); // 讀出當頁商品
      setPageInfo(response.data.pagination); //讀出當頁
    } catch (error) {
      console.dir(error);
      alert('資料取得失敗');
    }
  };

  // 開啟產品 Modal (新增或編輯)
  const openProductModal = (type, product) => {
    setModalType(type); // 依type回傳確定要開啟哪一個商品的Modal
    setSelectedProduct(product || null); //如果是新增 就是null，如果是修改，就是讀出type對應的product
    setIsProductModalOpen(true);
  };

  // 關閉產品 Modal
  const closeProductModal = () => {
    setIsProductModalOpen(false);
  };

  // 開啟刪除 Modal
  const openDeleteModal = (product) => {
    setSelectedProduct(product); // 依選取的商品
    setIsDeleteModalOpen(true); // 開啟對應的刪除Modal
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  //刪除產品
  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${id}`);
      alert('刪除成功');
      closeDeleteModal(); // 關閉刪除Modal
      getData(); // 重新渲染更新後的商品畫面
    } catch (error) {
      console.error(error);
      alert('刪除失敗');
    }
  };

  return (
    <>

      <div className="p-3 border rounded bg-light mb-3">
        <h3>第四週 - 元件化</h3>
      </div>
      <div className="d-flex justify-content-center align-items-center mb-5 gap-4">
        <button onClick={onBack} className="btn btn-secondary">返回首頁列表</button>
        <button type="button" className="btn btn-danger" onClick={checkOut}>登出</button>
      </div>
      {/*如果驗證成功，顯示渲染出來的商品列表畫面*/}
      {isAuth ? (
        <>
          <div className="container">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="">產品列表</h2>
              <button type="button" className="btn btn-primary" onClick={() => openProductModal('create')}>建立新商品</button>
            </div>
            <table className="table table-hover table-striped align-middle mt-4">
              <thead className="table-secondary fw-bold text-nowrap">
                <tr>
                  <th scope="col">分類</th>
                  <th scope="col">產品名稱</th>
                  <th scope="col">原價</th>
                  <th scope="col">售價</th>
                  <th scope="col">是否啟用</th>
                  <th scope="col">評價</th>
                  <th scope="col">查看細節</th>
                  <th scope="col">編輯 / 刪除</th>
                </tr>
              </thead>
              <tbody>
                {/* => ( ：通常是要直接吐出 JSX (HTML)。 */}
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.category}</td>
                    <td>{product.title}</td>
                    <td>{product.origin_price}</td>
                    <td>{product.price}</td>
                    <td className={product.is_enabled ? "text-success fw-bold" : "text-danger fw-bold"}>
                      {product.is_enabled ? "啟用" : "未啟用"}
                    </td>
                    <td>{product.rating ? `${product.rating} 星` : '無'}</td>
                    <td>
                      <button className="btn btn-outline-primary btn-sm" type="button" onClick={() => setTempProduct(product)}>查看細節</button>
                    </td>
                    <td>
                      <button className="btn btn-outline-secondary btn-sm me-2" type="button" onClick={() => openProductModal('edit', product)}>編輯</button>
                      <button className="btn btn-outline-danger btn-sm" type="button" onClick={() => openDeleteModal(product)}>刪除</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* 分頁元件 */}
            <Pagination pageInfo={pageInfo} handlePageChange={getData} />
          </div>
          {/* 產品詳細內容 Modal */}
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

          {/* 產品新增/編輯 Modal 元件*/}
          <ProductModal 
            isOpen={isProductModalOpen} 
            type={modalType} 
            tempProduct={selectedProduct} 
            getData={getData} 
            closeProductModal={closeProductModal} 
          />

          {/* 刪除確認 Modal 元件*/}
          <DeleteModal 
            isOpen={isDeleteModalOpen} 
            closeDeleteModal={closeDeleteModal} 
            handleDeleteProduct={handleDeleteProduct} 
            tempProduct={selectedProduct} 
          />
        </>
      /*還沒驗證，顯示渲染出來的登入畫面*/
      ) : (
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-6 border border-1 bg-light p-3 rounded shadow mb-3 text-center">
              <h2>使用者登入</h2>
              <div className="form-floating mb-3">
                <input
                  name="username"
                  value={loginData.username}
                  onChange={handleInputChange}
                  type="email" className="form-control" id="floatingInput" placeholder="name@example.com" />
                <label >Email address</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  name="password"
                  value={loginData.password}
                  onChange={handleInputChange}
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
export default LessonFourAdminLogin;