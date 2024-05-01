import Message from "./Message";

const Messages = () => {
	return (
		<div className='px-4 flex-1 overflow-auto'> 
		{/* overflow auto gives scrollbar when the message overflows and we are able to scroll */}
			<Message />
			<Message />
			<Message />
			<Message />
			<Message />
			<Message />
			<Message />
			<Message />
			<Message />
			<Message />
			<Message />
			<Message />
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