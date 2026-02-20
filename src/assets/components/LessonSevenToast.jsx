import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeMessage } from '../slice/lessonSevenToastSlice';

export default function LessonSevenToast() {
  const messages = useSelector((state) => state.toast.messages);
  const dispatch = useDispatch();

  const handleDismiss = (id) => {
    dispatch(removeMessage(id));
  };

  // 自動移除訊息 (3秒後)
  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        dispatch(removeMessage(messages[0].id));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [messages, dispatch]);

  return (
    /* top-0 start-50 translate-middle-x (上方置中) */
    <div className="toast-container position-fixed top-0 start-50 translate-middle-x p-3" style={{ zIndex: 1050 }}>
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="toast show"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          // 樣式：背景改為深灰色 (#3d3d3d) 且不透明，文字為白色
          style={{ backgroundColor: '#3d3d3d', color: 'white' }}
        >
          <div 
            className={`toast-header ${msg.status === 'success' ? '' : 'bg-danger'} text-white`}
            // 如果是成功訊息，使用 Kawasaki 綠 (#69BE28)；如果是錯誤，維持 bg-danger
            style={msg.status === 'success' ? { backgroundColor: '#69BE28' } : {}}
          >
            {/* 成功訊息背景較亮，標題改用深色 (text-dark) 增加對比；錯誤訊息維持白色 */}
            <strong className={`me-auto ${msg.status === 'success' ? 'text-dark' : 'text-white'}`}>{msg.title}</strong>
            <button
              type="button"
              // 成功訊息背景較亮，使用預設黑色叉叉；錯誤訊息背景深，使用白色叉叉
              className={`btn-close ${msg.status === 'success' ? '' : 'btn-close-white'}`}
              aria-label="Close"
              onClick={() => handleDismiss(msg.id)}
            ></button>
          </div>
          <div className="toast-body">
            {msg.text}
          </div>
        </div>
      ))}
    </div>
  );
}
