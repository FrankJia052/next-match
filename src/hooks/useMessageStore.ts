import { MessageDto } from "@/types"
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type MessageState = {
    messages: MessageDto[];
    unreadCount: number;
    add: (message: MessageDto) => void;
    remove: (id: string) => void;
    set: (messages: MessageDto[]) => void;
    updateUnreadCount: (amount: number) => void;
    // 添加方法
    resetMessages: () => void;
}

const useMessageStore = create<MessageState>()(devtools((set) => ({
    messages: [],
    unreadCount: 0,
    add: (message) => set(state => ({messages: [message, ...state.messages]})),
    remove: (id) => set(state => ({messages: state.messages.filter(message => message.id !== id)})),
    // 这里方法改一下，需要保留我们之前的消息记录
    // 这是我自己的方法，貌似有很多漏洞
    // set: (messages) => set(state => ({messages: {...state.messages, messages}})),
    // 这里是别人的方法，避免开发模式和严格模式下的一些数据重复问题，用map解决, 把重复的id去除掉
    set: (messages) => set((state) => {
        // 在 Map 中，键是唯一的，如果有重复的键（即相同的 id），后面的值会覆盖前面的值。这就实现了根据 id 的去重。new Map
        // 创建键值对数组，其中键是消息的 id，值是消息对象本身
        const map = new Map([...state.messages, ...messages].map(m => [m.id, m]));
        // 从 Map 中获取所有的值（即唯一的消息对象），并将其转换回数组
        const uniqueMessages = Array.from(map.values());
        return {messages: uniqueMessages}
    }),
    updateUnreadCount: (amount:number) => set(state => ({unreadCount: state.unreadCount + amount})),
    resetMessages: () => set({messages: []}),
}), {name: 'messageStore'}))

export default useMessageStore;