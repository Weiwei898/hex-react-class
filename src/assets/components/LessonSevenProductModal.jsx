import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';
import { useDispatch } from 'react-redux';
import { pushMessage } from '../slice/lessonSevenToastSlice';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function LessonSevenProductModal({ isOpen, type, tempProduct, getData, closeProductModal }) {
  const productModalRef = useRef(null);
  const modalInstanceRef = useRef(null);
  const fileInputRef = useRef(null); // 用於控制檔案輸入框
  const dispatch = useDispatch();
  
  // 為了讓 Modal 內部管理表單狀態，在這裡定義 modalData
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
    imagesUrl: [],
    rating: 5 // 自訂欄位：星級
  });
  // 透過 productModalRef.current 取得 DOM 元素，並建立 Bootstrap Modal 實體
  // backdrop: 'static' 設定點擊背景時不會關閉 Modal
  useEffect(() => {
    modalInstanceRef.current = new Modal(productModalRef.current, { backdrop: 'static' });
  }, []);

  // 當 isOpen 或 tempProduct 改變時，決定是否開啟 Modal 並設定資料
  useEffect(() => {
    if (isOpen) {
      // 每次開啟 Modal 時，清空檔案輸入框，避免殘留上次的檔名
      if (fileInputRef.current) fileInputRef.current.value = '';

      // 使用三元運算子判斷是編輯還是新增，並設定表單資料
      setModalData(
        type === 'edit' && tempProduct
          ? {
              ...tempProduct,
              imagesUrl: tempProduct.imagesUrl ? [...tempProduct.imagesUrl] : [],
              rating: tempProduct.rating || 5 // 如果舊資料沒有 rating，預設為 5
            }
          : {
              title: "",
              category: "",
              origin_price: 0,
              price: 0,
              unit: "",
              description: "",
              content: "",
              is_enabled: 0,
              imageUrl: "",
              imagesUrl: [],
              rating: 5
            }
      );

      // 如果 isOpen 為 true，呼叫 Bootstrap 實體的 show() 方法顯示 Modal
      modalInstanceRef.current.show();
    } else {
      // 如果 isOpen 為 false，呼叫 hide() 方法隱藏 Modal
      modalInstanceRef.current.hide();
    }
  }, [isOpen, type, tempProduct]);

  //事件監聽
  const handleModalInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    // 修正：type="range" 的值也是字串，需要轉為 Number，否則星級會變成字串
    setModalData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? (checked ? 1 : 0) : (type === "number" || type === "range" ? Number(value) : value),
    }));
  };

  //新增主要圖片
  const handleImageChange = (index, value) => {
    setModalData((prev) => {
      const newImages = [...prev.imagesUrl];
      newImages[index] = value;
      return { ...prev, imagesUrl: newImages };
    });
  };
  //新增其他圖片欄位
  const handleAddImage = () => {
    setModalData((prev) => ({
      ...prev,
      imagesUrl: [...prev.imagesUrl, '']
    }));
  };

  //移除最後一張圖片欄位
  const handleRemoveImage = () => {
    setModalData((prev) => {
      const newImages = [...prev.imagesUrl];
      newImages.pop();
      return { ...prev, imagesUrl: newImages };
    });
  };

  // 圖片上傳功能
  const handleFileChange = async (e) => {
    // e.target.files 是一個 FileList 物件，裡面包含使用者選取的檔案 (陣列結構)
    // 只取第一個檔案 [0]
    const file = e.target.files[0];
    if (!file) return;

    // FormData 是一個 Web API，用來建構可以透過 XMLHttpRequest 或 fetch (axios) 傳送的鍵值對
    // 它主要用於傳送表單資料，特別是當表單包含檔案上傳時 (multipart/form-data)
    const formData = new FormData();
    // 'file-to-upload' 是後端 API 指定的欄位名稱，必須與後端一致
    formData.append('file-to-upload', file);

    try {
      const res = await axios.post(`${API_BASE}/api/${API_PATH}/admin/upload`, formData);
      if (res.data.success) {
        setModalData(prev => ({
          ...prev,
          imageUrl: res.data.imageUrl
        }));
        dispatch(pushMessage({
          text: '圖片上傳成功',
          status: 'success'
        }));
      }
    } catch (error) {
      console.error(error);
      dispatch(pushMessage({
        text: '圖片上傳失敗',
        status: 'danger'
      }));
    }
  };

  // 封裝關閉 Modal 的邏輯，加入手動 blur 以解決焦點殘留問題 (教學重點)
  // 為什麼要這裡要手動 blur (失去焦點)？
  // 當 Modal 關閉時，Bootstrap 會移除 DOM 上的顯示狀態，但 React 的渲染可能會有微小的延遲。
  // 如果此時焦點 (Focus) 還停留在 Modal 內部的按鈕上，瀏覽器會偵測到「焦點位於一個隱藏的元素內」，
  // 進而發出 "Blocked aria-hidden on an element" 的警告。
  // 透過 document.activeElement.blur()，我們先強制移除焦點，再關閉 Modal，就能完美解決這個問題。
  //
  // 補充知識 (Modern Web)：
  // 現代瀏覽器支援 HTML `inert` 屬性，可以更優雅地解決此問題 (例如: <div inert={!isOpen ? "" : undefined}>)。
  // 但為了相容性與確保 Bootstrap 行為一致，我們目前採用手動 blur 的方式。
  const handleCloseModal = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    closeProductModal();
  };

  const handleUpdateProduct = async () => {
    try {
      let api = `${API_BASE}/api/${API_PATH}/admin/product`;
      let method = 'post'; // 預設是新增
      if (type === 'edit') {
        api = `${API_BASE}/api/${API_PATH}/admin/product/${modalData.id}`;
        method = 'put'; // 編輯模式改為 put
      }
      const res = await axios[method](api, { data: modalData });
      dispatch(pushMessage({
        text: type === 'edit' ? '更新成功' : '新增成功',
        status: 'success'
      }));      // 成功後關閉 Modal 前先移除焦點 (原理同 handleCloseModal)
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      closeProductModal();
      getData(); // 重新取得列表
    } catch (error) {
      console.error(error);
      dispatch(pushMessage({
        text: error.response?.data?.message || '操作失敗',
        status: 'danger'
      }));
    }
  };

  return (
    // aria-hidden={isOpen ? "false" : "true"} (教學重點)
    // 這是為了無障礙 (Accessibility) 設置的。
    // 當 Modal 開啟時 (isOpen=true)，aria-hidden 必須為 "false"，讓螢幕閱讀器知道這塊內容是可見的。
    // 當 Modal 關閉時 (isOpen=false)，aria-hidden 必須為 "true"，避免讀取到隱藏的內容。
    // 雖然 Bootstrap 會自動處理，但 React 的狀態管理有時會覆蓋 DOM 屬性，因此手動綁定最保險。
    <div ref={productModalRef} className="modal fade" tabIndex="-1" aria-hidden={isOpen ? "false" : "true"}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 bg-dark text-white">
          <div className="modal-header border-bottom-0">
            <h5 className="modal-title fw-bold">{type === 'create' ? '建立新商品' : '編輯商品'}</h5>
            <button type="button" className="btn-close btn-close-white" onClick={handleCloseModal}></button>
          </div>
          <div className="modal-body p-4">
            <div className="row g-4">
              <div className="col-md-4">
                <div className="mb-4">
                  <label htmlFor="fileInput" className="form-label fw-bold">上傳主要圖片</label>
                  <input ref={fileInputRef} type="file" className="form-control mb-2" id="fileInput" onChange={handleFileChange} />
                  
                  <label htmlFor="imageUrl" className="form-label fw-bold">或輸入圖片網址</label>
                  <div className="ratio ratio-1x1 bg-secondary rounded-4 overflow-hidden border border-2 mb-3">
                    {modalData.imageUrl ? (
                      <img src={modalData.imageUrl} alt="預覽" className="object-fit-cover" />
                    ) : (
                      <div className="d-flex align-items-center justify-content-center text-white-50">
                        <span className="fs-3">圖片預覽</span>
                      </div>
                    )}
                  </div>
                  <input type="text" className="form-control rounded-3 border-0" id="imageUrl" placeholder="輸入圖片網址" value={modalData.imageUrl} onChange={handleModalInputChange} />
                </div>
              </div>
              <div className="col-md-8">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label fw-bold">標題</label>
                  <input type="text" className="form-control rounded-3 border-0" id="title" placeholder="請輸入標題" value={modalData.title} onChange={handleModalInputChange} />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="category" className="form-label fw-bold">分類</label>
                    <input type="text" className="form-control rounded-3 border-0" id="category" placeholder="請輸入分類" value={modalData.category} onChange={handleModalInputChange} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="unit" className="form-label fw-bold">單位</label>
                    <input type="text" className="form-control rounded-3 border-0" id="unit" placeholder="請輸入單位" value={modalData.unit} onChange={handleModalInputChange} />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="origin_price" className="form-label fw-bold">原價</label>
                    <input min="0" type="number" className="form-control rounded-3 border-0" id="origin_price" placeholder="請輸入原價" value={modalData.origin_price} onChange={handleModalInputChange} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="price" className="form-label fw-bold">售價</label>
                    <input min="0" type="number" className="form-control rounded-3 border-0" id="price" placeholder="請輸入售價" value={modalData.price} onChange={handleModalInputChange} />
                  </div>
                </div>

                {/* 自訂欄位：星級 */}
                <div className="mb-3">
                  <label htmlFor="rating" className="form-label fw-bold">商品評價 (1-5星)</label>
                  <div className="d-flex align-items-center gap-2">
                    <input 
                      type="range" 
                      className="form-range" 
                      min="1" 
                      max="5" 
                      step="1" 
                      id="rating" 
                      value={modalData.rating} 
                      onChange={handleModalInputChange} 
                    />
                    <span className="badge bg-warning text-dark fs-6">{modalData.rating} 星</span>
                  </div>
                </div>

                <hr className="border-secondary" />
                <div className="mb-3">
                  <label htmlFor="description" className="form-label fw-bold">產品描述</label>
                  <textarea className="form-control rounded-3 border-0" id="description" placeholder="請輸入產品描述" value={modalData.description} onChange={handleModalInputChange}></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="content" className="form-label fw-bold">說明內容</label>
                  <textarea className="form-control rounded-3 border-0" id="content" placeholder="請輸入說明內容" value={modalData.content} onChange={handleModalInputChange}></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">更多圖片</label>
                  {modalData.imagesUrl?.map((url, index) => (
                    <div key={index} className="mb-2">
                      <input type="text" className="form-control rounded-3 border-0 mb-1" placeholder={`圖片網址 ${index + 1}`} value={url} onChange={(e) => handleImageChange(index, e.target.value)} />
                      {url && (
                        <div className="ratio ratio-1x1 bg-secondary rounded-3 overflow-hidden border border-1" style={{ width: '100px' }}>
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
                  <label className="form-check-label fw-bold" htmlFor="is_enabled">是否啟用</label>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer border-top-0 rounded-bottom-4">
            <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={handleCloseModal}>取消</button>
            <button type="button" className="btn btn-primary rounded-pill px-4" onClick={handleUpdateProduct}>確認</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LessonSevenProductModal;
