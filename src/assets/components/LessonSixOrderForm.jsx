import React from 'react';

const LessonSixOrderForm = ({ formData, handleInputChange, errors, onSubmit, onBack }) => {
  return (
    /* 加上 noValidate 屬性，關閉瀏覽器原生的驗證氣泡框，改用我們自定義的 invalid-feedback */
    <form onSubmit={onSubmit} className="card p-4 shadow-sm border-0" noValidate>
    
      <h4 className="mb-4 fw-bold">收件人資訊</h4>
      
      <div className="mb-3">
        <label htmlFor="name" className="form-label text-start w-100">姓名</label>
        <input
          type="text"
          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
          id="name"
          name="name"
          placeholder="請輸入姓名"
          value={formData.name}
          onChange={handleInputChange}
        />
        {errors.name && <div className="invalid-feedback text-start">{errors.name}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label text-start w-100">Email</label>
        <input
          type="email"
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          id="email"
          name="email"
          placeholder="請輸入 Email"
          value={formData.email}
          onChange={handleInputChange}
        />
        {errors.email && <div className="invalid-feedback text-start">{errors.email}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="tel" className="form-label text-start w-100">電話</label>
        <input
          type="tel"
          className={`form-control ${errors.tel ? 'is-invalid' : ''}`}
          id="tel"
          name="tel"
          placeholder="請輸入電話"
          value={formData.tel}
          onChange={handleInputChange}
        />
        {errors.tel && <div className="invalid-feedback text-start">{errors.tel}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="address" className="form-label text-start w-100">地址</label>
        <input
          type="text"
          className={`form-control ${errors.address ? 'is-invalid' : ''}`}
          id="address"
          name="address"
          placeholder="請輸入地址"
          value={formData.address}
          onChange={handleInputChange}
        />
        {errors.address && <div className="invalid-feedback text-start">{errors.address}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="message" className="form-label text-start w-100">留言</label>
        <textarea
          className="form-control"
          id="message"
          name="message"
          rows="3"
          placeholder="有什麼想告訴我們的嗎？"
          value={formData.message}
          onChange={handleInputChange}
        ></textarea>
      </div>

      <div className="d-flex justify-content-end gap-3">
        <button type="button" className="btn btn-outline-secondary px-4" onClick={onBack}>上一步</button>
        <button type="submit" className="btn btn-kawasaki px-5">送出訂單</button>
      </div>
    </form>
  );
};

export default LessonSixOrderForm;