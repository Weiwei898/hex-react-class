import { Link } from 'react-router-dom';
import './LessonSeven.css';

export default function LessonSevenNotFound() {
  return (
    <div className="container mt-5 lesson-seven text-center">
      <h2 className="text-white fw-bold mb-4">404 - 頁面不存在或功能建置中</h2>
      <Link to="/" className="btn btn-kawasaki">回到首頁</Link>
    </div>
  );
}
