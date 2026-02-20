import { createHashRouter } from 'react-router-dom';
import LessonSevenLayout from '../layout/LessonSevenLayout';
import LessonSevenHome from '../pages/LessonSeven/LessonSevenHome';
import LessonSevenProducts from '../pages/LessonSeven/LessonSevenProducts';
import LessonSevenSingleProduct from '../pages/LessonSeven/LessonSevenSingleProduct';
import LessonSevenCart from '../pages/LessonSeven/LessonSevenCart'; // 沒改動，延用第五週作業的code
import LessonSevenNotFound from '../pages/LessonSeven/LessonSevenNotFound'; // 沒改動，延用第五週作業的code
import LessonSevenUserLogin from '../pages/LessonSeven/LessonSevenUserLogin';
import LessonSevenCheckoutPage from '../pages/LessonSeven/LessonSevenCheckoutPage';//新建 Checkout：建立一個專屬第七週的結帳頁 LessonSevenCheckout.jsx，讓它能同時接受「管理者 Token」或「使用者模擬登入」兩種驗證方式。
import LessonSevenAdminLogin from '../pages/LessonSeven/LessonSevenAdminLogin';


export const router = createHashRouter([
  {
    path: '/',
    element: <LessonSevenLayout />,
    children: [
      {
        index: true,
        element: <LessonSevenHome />,
      },
      {
        path: 'product',
        element: <LessonSevenProducts />,
      },
      {
        path: 'product/:id',
        element: <LessonSevenSingleProduct />,
      },
      {
        path: 'cart',
        element: <LessonSevenCart />,
        // 沒改動，延用第五週作業的code
      },
      {
        path: 'userlogin',
        element: <LessonSevenUserLogin />,
      },
      {
        path: 'adminlogin',
        element: <LessonSevenAdminLogin />,
        
      },
      {
        path: 'checkout',
        element: <LessonSevenCheckoutPage />,
      },
      {
        path: '*',
        element: <LessonSevenNotFound />,
        // 沒改動，延用第五週作業的code
      },
    ],
  },
]);
