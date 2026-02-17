import { Link } from 'react-router-dom';

export default function LessonFiveNotFound() {
  return (
    <div className="container mt-5">
      <h2>404 - 找不到頁面</h2>
      <Link to="/" className="btn btn-primary">回到首頁</Link>
    </div>
  );
}
