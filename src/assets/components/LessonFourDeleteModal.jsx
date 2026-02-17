import React, { useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';

// 接收父層傳入的 props：
// isOpen: 控制 Modal 顯示/隱藏的布林值
// closeDeleteModal: 關閉 Modal 的函式
// handleDeleteProduct: 執行刪除動作的函式
// tempProduct: 要刪除的產品資料物件 (用來顯示標題)
function LessonFourDeleteModal({ isOpen, closeDeleteModal, handleDeleteProduct, tempProduct }) {
  // useRef 用途 1: 獲取 DOM 元素
  // 這裡用來綁定 HTML 中的 <div className="modal">，能在 JS 中操作這個 DOM
  const deleteModalRef = useRef(null);

  // useRef 用途 2: 保存變數，且變更時不會觸發畫面重新渲染 (Re-render)
  // 這裡用來存放 Bootstrap 的 Modal 實體，能在不同 useEffect 或函式中呼叫 .show() 或 .hide()
  const modalInstanceRef = useRef(null);
  
  // useEffect 用途: 處理副作用 (Side Effects)，例如 DOM 操作、API 呼叫
  // 第一個 useEffect: 依賴陣列為空 []，代表只在「元件建立 (Mount)」時執行一次
  useEffect(() => {
    // 透過 deleteModalRef.current 取得 DOM 元素，並建立 Bootstrap Modal 實體
    // backdrop: 'static' 設定點擊背景時不會關閉 Modal
    modalInstanceRef.current = new Modal(deleteModalRef.current, { backdrop: 'static' });
  }, []);

  // 第二個 useEffect: 依賴陣列包含 [isOpen]，代表當 isOpen 的值改變時會執行
  useEffect(() => {
    if (isOpen) {
      // 如果 isOpen 為 true，呼叫 Bootstrap 實體的 show() 方法顯示 Modal
      modalInstanceRef.current.show();
    } else {
      // 如果 isOpen 為 false，呼叫 hide() 方法隱藏 Modal
      modalInstanceRef.current.hide();
    }
  }, [isOpen]);

  return (
    // ref={deleteModalRef} 將這個 div 綁定到 useRef，方便 JS 抓取
    <div ref={deleteModalRef} className="modal fade" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title" id="deleteModalLabel">刪除產品</h5>
            <button type="button" className="btn-close" onClick={closeDeleteModal} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {/* tempProduct?.title 使用 Optional Chaining (?.)，避免 tempProduct 為 null 時報錯 */}
            是否確認刪除 <span className="fw-bold text-danger">{tempProduct?.title}</span> (刪除後將無法恢復)？
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeDeleteModal}>取消</button>
            <button type="button" className="btn btn-danger" onClick={() => handleDeleteProduct(tempProduct.id)}>確認刪除</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LessonFourDeleteModal;
