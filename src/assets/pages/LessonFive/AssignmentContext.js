import { createContext } from 'react';
/**
 AssignmentContext
 
 這個 Context 的主要用途是將 `onBack` (返回作業列表) 的功能傳遞給深層元件 (如 Layout)，
 避免透過 Props 一層一層傳遞 (Prop Drilling)。
 
 如果將 Context 定義在 `LessonFiveIndex.jsx` 中，會造成「循環依賴 (Circular Dependency)」：
 1. LessonFiveIndex 引入 router
 2. router 引入 LessonFiveLayout
 3. LessonFiveLayout 又要引入 LessonFiveIndex (為了取得 Context)
 
 這樣會導致程式報錯。因此將 Context 獨立出來，讓 Index (提供者) 和 Layout (使用者) 
 都能獨立引用這個檔案，解決循環依賴的問題。
 */
export const AssignmentContext = createContext(null);
