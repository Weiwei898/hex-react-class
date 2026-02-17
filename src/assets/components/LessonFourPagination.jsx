import React from 'react';

function LessonFourPagination({ pageInfo, handlePageChange }) {
  // 事件處理：將點擊邏輯封裝成 handleClick 函數
  const handleClick = (e, page) => {
    e.preventDefault();
    handlePageChange(page);
  };

  return (
    <div className="d-flex justify-content-center">
      {/* 加入無障礙 (A11y)：aria-label 說明導覽區塊 */}
      <nav aria-label="Page navigation">
        <ul className="pagination">
          {/* 用三元運算子判斷：若 pageInfo.has_pre 為 true (有前一頁)，回傳 '' (啟用)；若為 false (無前一頁)，回傳 'disabled' (禁用) */}
          <li className={`page-item ${pageInfo.has_pre ? '' : 'disabled'}`}>
            {/* 加入無障礙 (A11y)：aria-label, aria-hidden */}
            <a className="page-link" href="#" aria-label="Previous" onClick={(e) => handleClick(e, pageInfo.current_page - 1)}>
              <span aria-hidden="true">上一頁</span>
            </a>
          </li>
          {Array.from({ length: pageInfo.total_pages }).map((_, index) => (
            // 用三元運算子判斷 active：確保 class 名稱正確
            <li key={index} className={`page-item ${pageInfo.current_page === index + 1 ? 'active' : ''}`}>
              {/* 事件處理：用 handleClick 函數 */}
              <a className="page-link" href="#" onClick={(e) => handleClick(e, index + 1)}>
                {index + 1}
              </a>
            </li>
          ))}
          {/* 用三元運算子判斷 disabled 說明同前*/}
          <li className={`page-item ${pageInfo.has_next ? '' : 'disabled'}`}>
            {/* 加入無障礙 (A11y)：aria-label, aria-hidden, 事件處理handleClick */}
            <a className="page-link" href="#" aria-label="Next" onClick={(e) => handleClick(e, pageInfo.current_page + 1)}>
              <span aria-hidden="true">下一頁</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default LessonFourPagination;
