import { useContext } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { AssignmentContext } from '../pages/LessonFive/AssignmentContext';
import '../pages/LessonFive/LessonFive.css'; // 引入樣式

export default function LessonFiveLayout() {
  const onBack = useContext(AssignmentContext);

  return (
    <div className="lesson-five">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow-sm">
        <div className="container">
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">首頁</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/product">產品列表</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/cart">購物車</NavLink>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); onBack(); }}>回每週作業列表</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}
