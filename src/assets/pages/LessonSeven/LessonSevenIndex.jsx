import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { store } from '../../store/lessonSevenStore';
// ../../ 代表往上兩層：LessonSeven -> pages -> assets，然後進入 router 資料夾
import { router } from '../../router/LessonSevenRouter';

const LessonSevenIndex = () => {
    return (
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    )
};
export default LessonSevenIndex;