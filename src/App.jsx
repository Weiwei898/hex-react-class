import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Modal } from 'bootstrap'

import './App.css'

import LessonOne from './assets/pages/LessonOne';
import LessonTwo from './assets/pages/LessonTwo';
import LessonThree from './assets/pages/LessonThree';
import LessonFourAdminLogin from './assets/pages/LessonFourAdminLogin';

const App = () => {
  const [activeAssignment, setActiveAssignment] = useState(null);
  const assignments = [
    { id: 1, title: "第一週作業", desc: "從函式拆解認識設計模式" },
    { id: 2, title: "第二週作業", desc: "RESTful API 串接" },
    { id: 3, title: "第三週作業", desc: "熟練 React.js" },
    { id: 4, title: "第四週作業", desc: "元件化" },
  ];

  return (
    <div className="container">
      {/* 如果 activeAssignment 是 null，顯示卡片牆 */}
      {!activeAssignment ? (
        <>
          <h1>React每週作業</h1>
          <ul className="row list-unstyled"> {/* 加上 row 可以讓卡片並排 */}
            {assignments.map((item) => (
              <li key={item.id} className="col-md-4 mb-4">
                <div className="card" style={{ width: '18rem' }}>
                  <div className="card-body">
                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-text">{item.desc}</p>
                    <button
                      onClick={() => setActiveAssignment(item.id)}
                      className="btn btn-primary">
                      作業連結
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        /* 如果狀態不是 null，顯示作業內容 */
        <div>
          {activeAssignment === 1 && <LessonOne onBack={() => setActiveAssignment(null)} />}
          {activeAssignment === 2 && <LessonTwo onBack={() => setActiveAssignment(null)} />}
          {activeAssignment === 3 && <LessonThree onBack={() => setActiveAssignment(null)} />}
          {activeAssignment === 4 && <LessonFourAdminLogin onBack={() => setActiveAssignment(null)} />}
        </div>
      )}

    </div>
  );
};

export default App
