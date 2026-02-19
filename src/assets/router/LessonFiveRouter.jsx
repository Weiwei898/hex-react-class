import { createHashRouter } from 'react-router-dom';
import LessonFiveLayout from '../layout/LessonFiveLayout';
import LessonFiveHome from '../pages/LessonFive/LessonFiveHome';
import LessonFiveProducts from '../pages/LessonFive/LessonFiveProducts';
import LessonFiveSingleProduct from '../pages/LessonFive/LessonFiveSingleProduct';
import LessonFiveCart from '../pages/LessonFive/LessonFiveCart';
import LessonFiveNotFound from '../pages/LessonFive/LessonFiveNotFound';
import LessonSixUserLogin from '../pages/LessonSixUserLogin';
import LessonSixCheckoutPage from '../pages/LessonSixCheckoutPage';


export const router = createHashRouter([
  {
    path: '/',
    element: <LessonFiveLayout />,
    children: [
      {
        index: true,
        element: <LessonFiveHome />,
      },
      {
        path: 'product',
        element: <LessonFiveProducts />,
      },
      {
        path: 'product/:id',
        element: <LessonFiveSingleProduct />,
      },
      {
        path: 'cart',
        element: <LessonFiveCart />,
      },
      {
        path: 'userlogin',
        element: <LessonSixUserLogin />,
      },
      {
        path: 'checkout',
        element: <LessonSixCheckoutPage />,
      },
      {
        path: '*',
        element: <LessonFiveNotFound />,
      },
    ],
  },
]);
