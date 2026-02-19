import React, { useState, useEffect } from 'react';
// 助教建議已解構取出 useState，下方可不再從 React 中選取，useEffect 也可以這麼做
import axios from 'axios'
import { useNavigate } from 'react-router-dom'; // 引入 useNavigate 進行頁面跳轉

const API_BASE = import.meta.env.VITE_API_BASE;

const LessonSixUserLogin = ({ onBack }) => {
  //驗證登入狀態，useNavigate 進行頁面跳轉
  const navigate = useNavigate();
  // 助教建議，解構後的 Hook 使用方式更簡潔(不用再加React.useState)
  const [isAuth, setIsAuth] = useState(false); // 用來確認驗證是否成功，true渲染產品列表/false維持登入畫面
  const [messageSignIn, setMessageSignIn] = useState(""); // 登入提示訊息
  const [isErrorSignIn, setIsErrorSignIn] = useState(false); // 錯誤提示訊息

  // 別記錄帳號與密碼的錯誤訊息
  const [inputErrors, setInputErrors] = useState({
    username: "",
    password: ""
  });

  // 集中管理登入資訊 (物件形式)
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
    // 重置錯誤訊息
    setInputErrors({ username: "", password: "" });
    setMessageSignIn("");

    // 1. 登入驗證：檢查帳號密碼是否填寫
    let hasError = false;
    const newErrors = { username: "", password: "" };

    if (!loginData.username) {
      newErrors.username = "請輸入帳號 (Email)";
      hasError = true;
    }
    if (!loginData.password) {
      newErrors.password = "請輸入密碼";
      hasError = true;
    }
    if (hasError) {
      setInputErrors(newErrors);
      return;
    }
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
      navigate('/checkout'); // 登入成功後，直接跳轉到結帳頁面
    } catch (error) {
      setMessageSignIn(error.response.data.message);
      setIsErrorSignIn(true);
    }
  };

  // 驗證登入 API (取代純 Cookie 檢查)
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
      navigate('/checkout'); // 若已登入，直接跳轉到結帳頁面
    } catch (error) {
      // 若 Token 失效則清除本地狀態
      setIsAuth(false); //驗證失敗
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // 登出 API
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
      setMessageSignIn("");
      setLoginData({ username: "", password: "" });
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // 畫面載入時檢查是否已登入，助教建議，解構後的 Hook 使用方式更簡潔(不用再加React.useEffect)
  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <>
      <div className="p-3 border rounded bg-light mb-3">
        <h3>第六週 - 進階語法介紹(會員登入 / 結帳驗證)</h3>
      </div>
      
      <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-6 border border-1 bg-light p-3 rounded shadow mb-3 text-center">
              <h2>使用者登入</h2>
              <div className="form-floating mb-3">
                <input
                  name="username"
                  value={loginData.username}
                  onChange={handleInputChange}
                  type="email" 
                  className={`form-control ${inputErrors.username ? 'is-invalid' : ''}`} 
                  id="floatingInput" placeholder="name@example.com" required />
                <label >Email address</label>
                {inputErrors.username && <div className="invalid-feedback text-start">{inputErrors.username}</div>}
              </div>
              <div className="form-floating mb-3">
                <input
                  name="password"
                  value={loginData.password}
                  onChange={handleInputChange}
                  type="password" 
                  className={`form-control ${inputErrors.password ? 'is-invalid' : ''}`} 
                  id="floatingPassword" placeholder="Password" required />
                <label >Password</label>
                {inputErrors.password && <div className="invalid-feedback text-start">{inputErrors.password}</div>}
              </div>
              {messageSignIn && (
                <p className={`mt-2 ${isErrorSignIn ? 'text-danger' : 'text-success'}`}>
                  {messageSignIn}
                </p>
              )}
              <div className="d-flex justify-content-center align-items-center gap-4">
                <button type="button" className="btn btn-primary" onClick={signIn}>
                  登入
                </button>
                <button type="button" className="btn btn-danger" onClick={checkOut}>登出</button>
              </div>
            </div>
          </div>
        </div>

    </>
  );
};
export default LessonSixUserLogin;