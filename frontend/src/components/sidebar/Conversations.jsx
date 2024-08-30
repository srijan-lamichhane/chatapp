import useGetConversations from "../../hooks/useGetConversations";
import Conversation from "./Conversation";
import { getRandomEmoji } from "../../utils/emojis";

const Conversations = () => {
	const { loading, conversations } = useGetConversations();

	// Check if conversations has a users property
	const users = conversations.users || [];

	// console.log("USERS:", users);

	return (
		<div className='py-2 flex flex-col overflow-auto'>
			{users.length === 0 ? (
				<p>No conversations found.</p>
			) : (
				users.map((conversation, idx) => (
					<Conversation
						key={conversation._id}
						conversation={conversation}
						emoji={getRandomEmoji()}
						lastIdx={idx === users.length - 1}
					/>
				))
			)}

			{loading ? <span className='loading loading-spinner'></span> : null}
		</div>
	);
};
export default Conversations;
