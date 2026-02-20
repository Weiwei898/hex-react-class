import React, { useState, useEffect } from 'react';
// 助教建議已解構取出 useState，下方可不再從 React 中選取，useEffect 也可以這麼做
import axios from 'axios'
import { useNavigate, useOutletContext } from 'react-router-dom'; // 引入 useNavigate 進行頁面跳轉
import { useDispatch } from 'react-redux';
import { pushMessage } from '../../slice/lessonSevenToastSlice';
import './LessonSeven.css'; // 改用 LessonSeven 樣式

const API_BASE = import.meta.env.VITE_API_BASE;

const LessonSevenUserLogin = () => {
  const { setIsUserAuth, setIsAdminAuth } = useOutletContext(); // 取得 Layout 的狀態控制
  //驗證登入狀態，useNavigate 進行頁面跳轉
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
      
      // 1. 設定身分為 user (教學重點)
      // 雖然我們呼叫了 Admin API 取得 Token，但在前端邏輯上，我們將此狀態標記為 'user'
      // 這樣 Layout 就會顯示「使用者登出」，並且在 AdminLogin 頁面會觸發強制登出，達成權限分流的效果。
      localStorage.setItem('lessonSevenRole', 'user');

      setMessageSignIn("登入成功");
      setIsAuth(true);  // 驗證成功
      setIsUserAuth(true); // 通知 Layout 更新導覽列
      setIsErrorSignIn(false); // 不需執行 SignIn Error提示
      dispatch(pushMessage({
        text: '使用者登入成功',
        status: 'success'
      }));
      navigate('/checkout'); // 登入成功後，直接跳轉到結帳頁面
    } catch (error) {
      setMessageSignIn(error.response.data.message);
      setIsErrorSignIn(true);
      dispatch(pushMessage({
        text: '登入失敗：' + error.response.data.message,
        status: 'danger'
      }));
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
      setIsUserAuth(true); // 通知 Layout
      localStorage.setItem('lessonSevenRole', 'user'); // 確保角色正確
      navigate('/checkout'); // 若已登入，直接跳轉到結帳頁面
    } catch (error) {
      // 若 Token 失效則清除本地狀態
      setIsAuth(false); //驗證失敗
      setIsUserAuth(false);
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // 畫面載入時檢查是否已登入，助教建議，解構後的 Hook 使用方式更簡潔(不用再加React.useEffect)
  useEffect(() => {
    // 2. 防止權限混淆
    // 如果當前是「管理者」身分，進入此頁面應強制登出，避免混淆
    const role = localStorage.getItem('lessonSevenRole');
    if (role === 'admin') {
      document.cookie = "hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      localStorage.removeItem('lessonSevenRole');
      delete axios.defaults.headers.common['Authorization'];
      
      setIsAdminAuth(false); // 更新 Layout 狀態
      // 不執行 checkLogin，直接停留在登入畫面
      return;
    }

    checkLogin();
  }, []);

  return (
    <>
      <div className="container mt-5">
          <div className="row justify-content-center align-items-center">
            <div className="col-md-6">
              <div className="card shadow">
                <div className="card-body">
                  <h2 className="text-center mb-4">使用者登入</h2>
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
              <button type="button" className="btn btn-kawasaki w-100" onClick={signIn}>
                登入
              </button>
                </div>
              </div>
            </div>
          </div>
        </div>

    </>
  );
};
export default LessonSevenUserLogin;