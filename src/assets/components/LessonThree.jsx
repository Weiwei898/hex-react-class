import React, { useState } from 'react';
import axios from 'axios'

const LessonThree = ({ onBack }) => {

 return (
    <>
      <div className="p-3 border rounded bg-light mb-3">
        <h3>第三週 - 熟練 React.js</h3>
      </div><button onClick={onBack} className="btn btn-secondary mb-5">返回首頁列表</button>



    </>
  );
};
export default LessonThree;