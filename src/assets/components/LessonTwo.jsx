import React, { useState } from 'react';

const LessonTwo = ({ onBack }) => {
  return (
    <>
      <div className="p-3 border rounded bg-light mb-3">
        <h3>第二週作業：RESTful API 串接</h3>
        <p>這是第二週的練習內容...</p>
      </div><button onClick={onBack} className="btn btn-secondary">返回首頁列表</button>
    </>
  );
};

export default LessonTwo;