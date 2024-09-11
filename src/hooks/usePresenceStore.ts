import { create } from 'zustand';
// 添加测试工具来查看状态
import { devtools } from 'zustand/middleware';

type PresenceState = {
    // 连接到app的人
    members: string[];
    // 把用户添加到members的方法
    add: (id: string) => void;
    remove: (id: string) => void;
    set: (ids: string[]) => void;
}

// 创建存储这些属性的store
// 注意测试工具的使用，在PresenceState后添加俩括号和添加最后的name
const usePresenceStore = create<PresenceState>()(devtools((set) => ({
    members: [],
    add: (id) => set((state) => ({ members: [...state.members, id] })),
    remove: (id) => set((state) => ({ members: state.members.filter(member => member !== id) })),
    set: (ids) => set({ members: ids })
}), {name: "PresenceStore"}))

export default usePresenceStore;