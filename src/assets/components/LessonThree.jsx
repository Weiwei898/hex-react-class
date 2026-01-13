import React, { useState, useEffect } from 'react';
// 1. 助教建議已解構取出 useState，下方可不再從 React 中選取，useEffect 也可以這麼做
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const LessonThree = ({ onBack }) => {
  // 1. 助教建議，解構後的 Hook 使用方式更簡潔(不用再加React.useState)
  const [isAuth, setIsAuth] = useState(false);//用來確認驗證是否成功，ture渲染產品列表/false維持登入畫面
  const [products, setProducts] = useState([]);//用來存放API讀出的資料
  const [tempProduct, setTempProduct] = useState(null);//用來渲染產品詳細內容，ture彈出詳細內容畫面/false顥示選擇產品
  const [messageSignIn, setMessageSignIn] = useState("");//登入提示訊息
  const [isErrorSignIn, setIsErrorSignIn] = useState(false);//錯誤提示訊息

  // 新增產品 Modal 的開關狀態
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create' or 'edit'
  // 新增產品的表單資料
  const [modalData, setModalData] = useState({
    title: "",
    category: "",
    origin_price: 0,
    price: 0,
    unit: "",
    description: "",
    content: "",
    is_enabled: 0,
    imageUrl: "",
    imagesUrl: []
  });

  // 2. 集中管理登入資訊 (物件形式)
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });

  // 處理表單欄位變更的通用函式 (onChange 觸發)
  const handleInputChange = (e) => {
    // 從觸發事件的 input 元素中，解構取出 id 和目前的輸入值 (value)
    const { id, value } = e.target;
    // 更新狀態：使用 prev (之前的狀態) 進行複製與局部更新
    setLoginData(prev => ({
      ...prev,// 展開運算子：先複製一份舊的所有欄位資料 (避免更新帳號時密碼被刪除)
      // 動態 Key 值：判斷當前 input 的 id
      // 如果 id 是 'floatingInput'，就更新 username 欄位；否則更新 password 欄位
      [id === 'floatingInput' ? 'username' : 'password']: value
    }));
  };


  //登入API
  const signIn = async () => {
    try {
      //配合 集中管理登入資訊 (物件形式)修正由 改由loginData物件發送請求
      const response = await axios.post(`${API_BASE}/admin/signin`, loginData);
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
      setIsAuth(true);
      getData();
    } catch (error) {
      // 若 Token 失效則清除本地狀態
      setIsAuth(false);
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
  const getData = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products`);
      setProducts(response.data.products);
    } catch (error) {
      console.dir(error);
      alert('資料取得失敗');
    }
  };

  //新增產品
  const openProductModal = (type, product) => {
    setModalType(type);
    if (type === 'edit') {
      setModalData({
        ...product,
        imagesUrl: product.imagesUrl ? [...product.imagesUrl] : []
      });
    } else {
      // 初始化表單資料
      setModalData({
        title: "",
        category: "",
        origin_price: 0,
        price: 0,
        unit: "",
        description: "",
        content: "",
        is_enabled: 0,
        imageUrl: "",
        imagesUrl: []
      });
    }
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
  };

  const handleModalInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setModalData((prev) => ({
      ...prev,
      // 如果是 checkbox，值為 checked (true/false) 轉為 1/0，否則為 value
      [id]: type === "checkbox" ? (checked ? 1 : 0) : (type === "number" ? Number(value) : value),
    }));
  };

  // 處理副圖變更
  const handleImageChange = (index, value) => {
    setModalData((prev) => {
      const newImages = [...prev.imagesUrl];
      newImages[index] = value;
      return { ...prev, imagesUrl: newImages };
    });
  };

  const handleAddImage = () => {
    setModalData((prev) => ({
      ...prev,
      imagesUrl: [...prev.imagesUrl, '']
    }));
  };

  const handleRemoveImage = () => {
    setModalData((prev) => {
      const newImages = [...prev.imagesUrl];
      newImages.pop();
      return { ...prev, imagesUrl: newImages };
    });
  };

  const handleUpdateProduct = async () => {
    try {
      let api = `${API_BASE}/api/${API_PATH}/admin/product`;
      let method = 'post';
      if (modalType === 'edit') {
        api = `${API_BASE}/api/${API_PATH}/admin/product/${modalData.id}`;
        method = 'put';
      }

      await axios[method](api, { data: modalData });

      alert(modalType === 'edit' ? '更新成功' : '新增成功');
      closeProductModal();
      getData();
    } catch (error) {
      console.error(error);
      alert('操作失敗');
    }
  };

  //刪除產品
  const handleDeleteProduct = async (id) => {
    if (window.confirm('確認刪除?')) {
      try {
        await axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${id}`);
        alert('刪除成功');
        getData();
      } catch (error) {
        console.error(error);
        alert('刪除失敗');
      }
    }
  };

  return (
    <>

      <div className="p-3 border rounded bg-light mb-3">
        <h3>第三週 - 熟練 React.js</h3>
      </div>
      <div className="d-flex justify-content-center align-items-center mb-5 gap-4">
        <button onClick={onBack} className="btn btn-secondary">返回首頁列表</button>
        <button type="button" className="btn btn-danger" onClick={checkOut}>登出</button>
      </div>
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
                  <th scope="col">查看細節</th>
                  <th scope="col">編輯 / 刪除</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item) => (
                  <tr key={item.id}>
                    <td>{item.category}</td>
                    <td>{item.title}</td>
                    <td>{item.origin_price}</td>
                    <td>{item.price}</td>
                    <td className={item.is_enabled ? "text-success fw-bold" : "text-danger fw-bold"}>
                      {item.is_enabled ? "啟用" : "未啟用"}
                    </td>
                    <td>
                      <button className="btn btn-outline-primary btn-sm" type="button" onClick={() => setTempProduct(item)}>查看細節</button>
                    </td>
                    <td>
                      <button className="btn btn-outline-secondary btn-sm me-2" type="button" onClick={() => openProductModal('edit', item)}>編輯</button>
                      <button className="btn btn-outline-danger btn-sm" type="button" onClick={() => handleDeleteProduct(item.id)}>刪除</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

          {/* 新增商品 Modal */}
          {isProductModalOpen && (
            <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg rounded-4">
                  <div className="modal-header bg-primary-subtle text-primary-emphasis rounded-top-4 border-bottom-0">
                    <h5 className="modal-title fw-bold">{modalType === 'create' ? '建立新商品' : '編輯商品'}</h5>
                    <button type="button" className="btn-close" onClick={closeProductModal}></button>
                  </div>
                  <div className="modal-body p-4">
                    <div className="row g-4">
                      <div className="col-md-4">
                        <div className="mb-4">
                          <label htmlFor="imageUrl" className="form-label fw-bold text-secondary">主要圖片</label>
                          <div className="ratio ratio-1x1 bg-light rounded-4 overflow-hidden border border-2 mb-3">
                            {modalData.imageUrl ? (
                              <img src={modalData.imageUrl} alt="預覽" className="object-fit-cover" />
                            ) : (
                              <div className="d-flex align-items-center justify-content-center text-muted">
                                <span className="fs-3">圖片預覽</span>
                              </div>
                            )}
                          </div>
                          <input type="text" className="form-control rounded-3 bg-light border-0" id="imageUrl" placeholder="輸入圖片網址" value={modalData.imageUrl} onChange={handleModalInputChange} />
                        </div>
                      </div>
                      <div className="col-md-8">
                        <div className="mb-3">
                          <label htmlFor="title" className="form-label fw-bold text-secondary">標題</label>
                          <input type="text" className="form-control rounded-3 bg-light border-0" id="title" placeholder="請輸入標題" value={modalData.title} onChange={handleModalInputChange} />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="category" className="form-label fw-bold text-secondary">分類</label>
                          <input type="text" className="form-control rounded-3 bg-light border-0" id="category" placeholder="請輸入分類" value={modalData.category} onChange={handleModalInputChange} />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="unit" className="form-label fw-bold text-secondary">單位</label>
                          <input type="text" className="form-control rounded-3 bg-light border-0" id="unit" placeholder="請輸入單位" value={modalData.unit} onChange={handleModalInputChange} />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="origin_price" className="form-label fw-bold text-secondary">原價</label>
                          <input type="number" className="form-control rounded-3 bg-light border-0" id="origin_price" placeholder="請輸入原價" value={modalData.origin_price} onChange={handleModalInputChange} />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="price" className="form-label fw-bold text-secondary">售價</label>
                          <input type="number" className="form-control rounded-3 bg-light border-0" id="price" placeholder="請輸入售價" value={modalData.price} onChange={handleModalInputChange} />
                        </div>
                        <hr className="border-secondary-subtle" />
                        <div className="mb-3">
                          <label htmlFor="description" className="form-label fw-bold text-secondary">產品描述</label>
                          <textarea className="form-control rounded-3 bg-light border-0" id="description" placeholder="請輸入產品描述" value={modalData.description} onChange={handleModalInputChange}></textarea>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="content" className="form-label fw-bold text-secondary">說明內容</label>
                          <textarea className="form-control rounded-3 bg-light border-0" id="content" placeholder="請輸入說明內容" value={modalData.content} onChange={handleModalInputChange}></textarea>
                        </div>
                        <div className="mb-3">
                          <label className="form-label fw-bold text-secondary">更多圖片</label>
                          {modalData.imagesUrl?.map((url, index) => (
                            <div key={index} className="mb-2">
                              <input type="text" className="form-control rounded-3 bg-light border-0 mb-1" placeholder={`圖片網址 ${index + 1}`} value={url} onChange={(e) => handleImageChange(index, e.target.value)} />
                              {url && (
                                <div className="ratio ratio-1x1 bg-light rounded-3 overflow-hidden border border-1" style={{ width: '100px' }}>
                                  <img src={url} alt={`副圖 ${index + 1}`} className="object-fit-cover" />
                                </div>
                              )}
                            </div>
                          ))}
                          <div className="d-flex justify-content-between gap-2">
                            {(!modalData.imagesUrl?.length || modalData.imagesUrl[modalData.imagesUrl.length - 1]) && (
                              <button type="button" className="btn btn-outline-primary btn-sm w-100" onClick={handleAddImage}>新增圖片</button>
                            )}
                            {modalData.imagesUrl?.length > 0 && (
                              <button type="button" className="btn btn-outline-danger btn-sm w-100" onClick={handleRemoveImage}>取消圖片</button>
                            )}
                          </div>
                        </div>
                        <div className="form-check form-switch">
                          <input id="is_enabled" className="form-check-input" type="checkbox" role="switch" checked={modalData.is_enabled} onChange={handleModalInputChange} />
                          <label className="form-check-label fw-bold text-secondary" htmlFor="is_enabled">是否啟用</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer border-top-0 bg-light rounded-bottom-4">
                    <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={closeProductModal}>取消</button>
                    <button type="button" className="btn btn-primary rounded-pill px-4" onClick={handleUpdateProduct}>確認</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-6 border border-1 bg-light p-3 rounded shadow mb-3 text-center">
              <h2>使用者登入</h2>
              <div className="form-floating mb-3">
                <input
                  value={loginData.username}
                  onChange={handleInputChange}
                  type="email" className="form-control" id="floatingInput" placeholder="name@example.com" />
                <label >Email address</label>
              </div>
              <div className="form-floating mb-3">
                <input
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
export default LessonThree;