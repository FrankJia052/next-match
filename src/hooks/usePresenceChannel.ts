import { useCallback, useEffect, useRef } from "react"
import usePresenceStore from "./usePresenceStore"
import { Channel, Members } from "pusher-js";
import { pusherClient } from "@/lib/pusher";

export const usePresenceChannel = () => {
    // 这里这样做是防止刷新的时候初始方法丢失
    const {set, add, remove} = usePresenceStore(state => ({
        set: state.set,
        add: state.add,
        remove: state.remove
    }));

    // useEffect里因为restrict mode会触发两次，用ref避免
    // 当set, add, remove变化的时候，ref不会被影响，它永远是指向的位置
    const channelRef = useRef<Channel | null>(null);

    const handleSetMembers = useCallback((memberIds: string[]) => {
        set(memberIds)
    }, [set])

    const handleAddMember = useCallback((memberId: string) => {
        add(memberId);
    }, [add])

    const handleRemoveMember = useCallback((memberId: string) => {
        remove(memberId)
    }, [remove])

    useEffect(() => {
        if(!channelRef.current) {
            // presence是表示channel的形式，nm是随便取的名字
            channelRef.current = pusherClient.subscribe('presence-nm')

            channelRef.current.bind('pusher:subscription_succeeded', (members: Members) => {
                handleSetMembers(Object.keys(members.members));
            });

            channelRef.current.bind('pusher:member_added', (member: Record<string, any>) => {
                handleAddMember(member.id)
            });

            channelRef.current.bind('pusher:member_removed', (member: Record<string, any>) => {
                handleRemoveMember(member.id)
            });
        }

        return () => {
            if(channelRef.current && channelRef.current.subscribed) {
                channelRef.current.unsubscribe();
                // 以下event名字不准确，之后会改
                channelRef.current.unbind('pusher:subscription_succeeded', handleSetMembers);
                channelRef.current.unbind('pusher:member_added', handleAddMember);
                channelRef.current.unbind('pusher:member_removed', handleRemoveMember);
            }
        }
    }, [handleSetMembers, handleAddMember, handleRemoveMember])
}