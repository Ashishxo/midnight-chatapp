import React from 'react'
import { Virtuoso } from 'react-virtuoso';
import Message from './Message';

function ChatList({ messages, user, fetchOlderChats, hasMore, loadingMore, skip, atBottom, setAtBottom, virtuosoRef }) {


    return (
      <Virtuoso
        ref={virtuosoRef}
        data={messages}
        firstItemIndex={100000 - skip}
        itemContent={(index, msg) => (
          <Message
            key={msg._id}
            message={msg.message}
            createdAt={new Date(msg.createdAt)}
            userId={msg.userId.username}
            user={user}
          />
        )}
        startReached={() => {
          if (hasMore && !loadingMore) {
            fetchOlderChats();
          }
        }}
  
        atBottomStateChange={(isAtBottom) => setAtBottom(isAtBottom)}
        followOutput={atBottom ? 'smooth' : false}
        
        initialTopMostItemIndex={messages.length - 1}
        components={{
          Header: () =>
            loadingMore ? (
              <div className="flex justify-center py-2 text-white text-sm opacity-60">
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Loading older messages...
              </div>
            ) : null,
        }}
        style={{ height: '100%', width: '100%', overflowX:'hidden' }}
      />
    );
  }

export default ChatList