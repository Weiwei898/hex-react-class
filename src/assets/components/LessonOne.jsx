import React, { useState } from 'react';
import axios from 'axios'
import { Modal } from 'bootstrap'

const LessonOne = ({ onBack }) => {
  const [tempProduct, setTempProduct] = React.useState(null);
  const products = [
    {
      category: "甜甜圈",
      content: "尺寸：14x14cm",
      description: "濃郁的草莓風味，中心填入滑順不膩口的卡士達內餡，帶來滿滿幸福感！",
      id: "-L9tH8jxVb2Ka_DYPwng",
      is_enabled: 1,
      origin_price: 150,
      price: 99,
      title: "草莓莓果夾心圈",
      unit: "元",
      num: 10,
      imageUrl: "https://images.unsplash.com/photo-1583182332473-b31ba08929c8",
      imagesUrl: ["https://images.unsplash.com/photo-1626094309830-abbb0c99da4a", "https://images.unsplash.com/photo-1559656914-a30970c1affd"],
    },
    {
      category: "蛋糕",
      content: "尺寸：6寸",
      description: "蜜蜂蜜蛋糕，夾層夾上酸酸甜甜的檸檬餡，清爽可口的滋味讓人口水直流！",
      id: "-McJ-VvcwfN1_Ye_NtVA",
      is_enabled: 16,
      origin_price: 1000,
      price: 900,
      title: "蜂蜜檸檬蛋糕",
      unit: "個",
      num: 1,
      imageUrl: "https://images.unsplash.com/photo-1627834377411-8da5f4f09de8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1001&q=80",
      imagesUrl: ["https://images.unsplash.com/photo-1618888007540-2bdead974bbb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=987&q=80"],
    },
    {
      category: "蛋糕",
      content: "尺寸：6寸",
      description: "法式煎薄餅加上濃郁可可醬，呈現經典的美味及口感。",
      id: "-McJ-VyqaFlLzUMmpPpm",
      is_enabled: 1,
      origin_price: 700,
      price: 600,
      title: "暗黑千層",
      unit: "個",
      num: 15,
      imageUrl: "https://images.unsplash.com/photo-1505253149613-112d21d9f6a9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDZ8fGNha2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60",
      imagesUrl: ["https://images.unsplash.com/flagged/photo-1557234985-425e10c9d7f1?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTA5fHxjYWtlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60", "https://images.unsplash.com/photo-1540337706094-da10342c93d8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDR8fGNha2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60"],
    },
  ];

  return (
    <>
      <div className="p-3 border rounded bg-light mb-3">
        <h3>第一週作業：從函式拆解認識設計模式</h3>
      </div>
      <button onClick={onBack} className="btn btn-secondary mb-5">返回首頁列表</button>
      <div className="container">
        <h2 className="">產品列表</h2>
        <ul className="row mt-3 list-unstyled">
          {products.map((products) => (
            <li key={products.id} className="col-md-4">
              <div className="card h-100 shadow border-0 hover-shadow transition bg-primary-subtle">
                <div style={{ overflow: 'hidden' }} className="rounded rounded-top-5 border-0 hover-shadow mb-3">
                  <img src={products.imageUrl} alt="" className="" style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }} />
                </div>
                <div className="card-body">
                  <h5>{products.title}</h5>
                  <div className="d-flex justify-content-center align-items-center gap-3">
                    <p>原價：{products.origin_price}元</p>
                    <p>售價：{products.price}元</p>
                  </div>
                  <p>是否啟用：{products.is_enabled ? "啟用" : "未啟用"}</p>
                  <button className="btn btn-primary" onClick={() => setTempProduct(products)}>
                    查看細節
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {tempProduct ? (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <span className="fs-4 ms-2">{tempProduct.category}</span>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setTempProduct(null)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body row">
                <div className="col-md-7">
                  <img src={tempProduct.imageUrl} alt={tempProduct.title} className="img-thumbnail mb-3" />
                </div>
                <div className="col-md-5 d-flex flex-column justify-content-center align-items-start">
                  <h1 className="modal-title">{tempProduct.title}</h1>
                  <p>內容：{tempProduct.content}</p>
                  <p>描述：{tempProduct.description}</p>
                  <p>
                    售價：{tempProduct.price} <del>{tempProduct.origin_price}</del> 元
                  </p>
                  <p>更多圖片：</p>
                  <div className="d-flex gap-2">
                    {tempProduct.imagesUrl.map((url, index) => (
                      <img key={index} src={url}
                        className="img-thumbnail"
                        alt=""
                        style={{
                          width: 100,
                          objectFit: 'contain'
                        }} />
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-secondary">請選擇一個商品查看</p>
      )}
    </>
  );
};


export default LessonOne;