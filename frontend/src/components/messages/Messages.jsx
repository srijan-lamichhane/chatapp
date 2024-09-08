import { useEffect, useRef } from "react";
import useGetMessages from "../../hooks/useGetMessage";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";
import useListenMessage from "../../hooks/useListenMessage";

const Messages = () => {
	const { loading, messages } = useGetMessages();
	useListenMessage();
	const lastMessageRef = useRef();

	useEffect(() => {
		setTimeout(() => {
			lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });	
		}, 100)
	}, [messages]); // whenever the messages changes, this useEffect will run
	return (
		<div className='px-4 flex-1 overflow-auto'>
			{/* overflow auto gives scrollbar when the message overflows and we are able to scroll */}

			{/* if there are messages then: */}
			{!loading && messages.length > 0 && messages.map((message) => (
				<div key={message._id} ref={lastMessageRef}>
					<Message message={message} />
				</div>
			))}
			{loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
			{/* if there is no messages then: */}
			{!loading && messages.length === 0 && (
				<p className='text-center'>send the message to start the conservation</p>
			)}
		</div>
	);
};
export default Messages;

//messages(frontend)
// import Message from "./Message";

// const Messages = () => {
// 	return (
// 		<div className='px-4 flex-1 overflow-auto'>
// 		{/* overflow auto gives scrollbar when the message overflows and we are able to scroll */}
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 		</div>
// 	);
// };
// export default Messages;