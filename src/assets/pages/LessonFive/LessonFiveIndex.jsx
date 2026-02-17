import { RouterProvider } from 'react-router-dom';
// ../../ 代表往上兩層：LessonFive -> pages -> assets，然後進入 router 資料夾
import { router } from '../../router/LessonFiveRouter';
// ./ 代表同層：直接在當前 LessonFive 資料夾中尋找
import { AssignmentContext } from './AssignmentContext';

const LessonFiveIndex = ({ onBack }) => {
    return (
        <AssignmentContext.Provider value={onBack}>
            <RouterProvider router={router} />
        </AssignmentContext.Provider>
    )
};
export default LessonFiveIndex;