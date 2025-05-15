import { useEffect, useState } from "react";

const Chat = () => {
  const [contacts, setContacts] = useState([]);
  const [chatContact, setChatContact] = useState(null);
  const [messages, setMessages] = useState([]);

  const loadChat = (contactId) => {
    const data = JSON.parse(localStorage.getItem("data"));
    const contact = data.users.find((contact) => contact.id === contactId);
    setChatContact(contact);

    const userId = JSON.parse(localStorage.getItem("user")).id;
    const filteredMessages = data.chat.filter(
      (message) =>
        (message.senderId === userId && message.receiverId === contactId) ||
        (message.senderId === contactId && message.receiverId === userId)
    );
    setMessages(filteredMessages);
  };

  const loadContacts = () => {
    const userID = JSON.parse(localStorage.getItem("user")).id;
    const data = JSON.parse(localStorage.getItem("data"));
    const filteredContacts = data.users.filter((user) => user.id !== userID);
    setContacts(filteredContacts);

    // Automatically load the first contact's chat
    if (filteredContacts.length > 0) {
      loadChat(filteredContacts[0].id);
    }
  };

  const sendMessage = () => {
    if (chatContact) {
      const input = document.getElementById("message-input");
      const text = input.value;
      const data = JSON.parse(localStorage.getItem("data"));

      input.value = "";
      const newMessage = {
        id: data.chat.length + 1,
        senderId: JSON.parse(localStorage.getItem("user")).id,
        receiverId: chatContact.id,
        message: text,
        timestamp: new Date().toISOString(),
      };

      const updatedData = {
        ...data,
        chat: [...data.chat, newMessage],
      };
      localStorage.setItem("data", JSON.stringify(updatedData));
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  return (
    <main className="w-full h-full flex">
      <aside className="w-1/4 p-4">
        <h1 className="mt-0 text-xl font-bold">List of Students</h1>
        <ul
          id="contacts-list"
          className="list-none p-4 overflow-y-scroll max-h-[67vh]"
          style={{ scrollbarWidth: "none" }}
        >
          {contacts.map((contact) => (
            <li
              key={contact.id}
              className="mb-2 py-3 pl-4 text-base rounded bg-[#444444] hover:bg-[#027bff] cursor-pointer"
              onClick={() => loadChat(contact.id)}
            >
              {contact.username}
            </li>
          ))}
        </ul>
      </aside>

      <section
        className="bg-[#2a2a2a] border w-3/4 h-full rounded p-6 relative"
        style={{ borderColor: "#2a2a2a" }}
      >
        <h2 id="chat-header" className="text-base font-light">
          {chatContact
            ? `Chatting with ${chatContact.username}...`
            : "Start a conversation"}
        </h2>

        <ul
          id="messages-list"
          className="list-none p-4 overflow-y-scroll max-h-[55vh] absolute bottom-24 w-[96%] left-[2%]"
          style={{ scrollbarWidth: "none" }}
        >
          {messages.map((message) => (
            <li key={message.id} className="w-full my-2 h-12">
              <p
                className={`h-full w-fit px-6 py-3 text-base rounded ml-1 ${
                  message.senderId ===
                  JSON.parse(localStorage.getItem("user")).id
                    ? "bg-[#027bff] float-right"
                    : "bg-[#1e1e1e]"
                }`}
              >
                {message.message}
              </p>
            </li>
          ))}
        </ul>

        <div className="absolute bottom-0 left-[2%] w-[96%] p-4 flex items-center">
          <input
            type="text"
            id="message-input"
            className="w-11/12 p-3 bg-[#444444] text-white border rounded text-sm placeholder-gray-400"
            style={{ borderColor: "#9b9b9bb2" }}
            placeholder="Type your message ..."
            onKeyDown={(event) => {
              if (event.key === "Enter") sendMessage();
            }}
          />
          <button
            className="ml-2 px-4 py-3 bg-[#4caf50] text-white rounded text-base cursor-pointer"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </section>
    </main>
  );
};

export default Chat;
