import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import LessonSevenToast from '../components/LessonSevenToast';
import { pushMessage } from '../slice/lessonSevenToastSlice';
import '../pages/LessonSeven/LessonSeven.css'; // 引入樣式

const API_BASE = import.meta.env.VITE_API_BASE;

export default function LessonSevenLayout() {
  const [isAdminAuth, setIsAdminAuth] = useState(false); // 管理者登入狀態
  const [isUserAuth, setIsUserAuth] = useState(false);   // 使用者登入狀態 (預留)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 檢查登入狀態 (讀取 Cookie 與 LocalStorage)
  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1",
    );
    // 1. 讀取 LocalStorage 中的角色設定 (user 或 admin)
    // 這是用來區分「使用者」與「管理者」的關鍵，即使背後可能都持有 Token
    const role = localStorage.getItem('lessonSevenRole');

    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
      // 2. 根據角色還原對應的登入狀態 (讓重新整理後 Navbar 狀態正確)
      if (role === 'admin') setIsAdminAuth(true);
      if (role === 'user') setIsUserAuth(true);
    }
  }, []);

  // 管理者登出邏輯
  const handleAdminLogout = async () => {
    try {
      await axios.post(`${API_BASE}/logout`);
    } catch (error) {
      console.warn('伺服器登出失敗，但將強制清除本地狀態');
    } finally {
      document.cookie = "hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      localStorage.removeItem('lessonSevenRole'); // 清除身分紀錄
      delete axios.defaults.headers.common['Authorization'];
      setIsAdminAuth(false);
      dispatch(pushMessage({
        text: '管理者已登出',
        status: 'success'
      }));
      navigate('/adminlogin'); // 登出後導向登入頁
    }
  };

  // 登出邏輯
  const handleUserLogout = async () => {
    try {
      await axios.post(`${API_BASE}/logout`);
    } catch (error) {
      console.warn('伺服器登出失敗，但將強制清除本地狀態');
    } finally {
      document.cookie = "hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      localStorage.removeItem('lessonSevenRole'); // 清除身分紀錄
      delete axios.defaults.headers.common['Authorization'];
      setIsUserAuth(false);
      dispatch(pushMessage({
        text: '使用者已登出',
        status: 'success'
      }));
      navigate('/userlogin');
    }
  };

  return (
    <div className="lesson-seven">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow-sm">
        <div className="container">
          <div className="collapse navbar-collapse justify-content-between">
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">首頁</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/product">產品列表</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/cart">購物車</NavLink>
              </li>
            </ul>
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item">
                {isUserAuth ? (
                  <button className="nav-link btn btn-link" onClick={handleUserLogout}>使用者登出</button>
                ) : (
                  <NavLink className="nav-link" to="/userlogin">使用者登入</NavLink>
                )}
              </li>
              <li className="nav-item">
                {isAdminAuth ? (
                  <button className="nav-link btn btn-link" onClick={handleAdminLogout}>管理者登出</button>
                ) : (
                  <NavLink className="nav-link" to="/adminlogin">管理者登入</NavLink>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {/* 3. 使用 Context 將狀態與設定方法傳遞給所有子頁面 (Outlet) */}
      <Outlet context={{ isAdminAuth, isUserAuth, setIsAdminAuth, setIsUserAuth }} />
      
      {/* 4. 全域 Toast 通知元件：放在 Layout 層級，確保切換頁面時通知不會消失 */}
      <LessonSevenToast />
    </div>
  );
}
