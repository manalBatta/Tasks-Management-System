import { useRef, useState, useCallback, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useAuth } from "../context/AuthContext";

//I must get the users from the DB
const Chat = () => {
  const [contacts, setContacts] = useState([]);
  const [chatContact, setChatContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();

  // Use your local backend WebSocket server
  const [socketUrl] = useState("ws://localhost:5000");
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  const messagesEndRef = useRef(null);

  // Fetch users from backend
  async function fetchUsers() {
    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
        query {
          users {
            id
            username
            role
            universityID
          }
        }
      `,
        }),
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      const { data } = await response.json();
      return data.users;
    } catch (err) {
      alert("Error fetching users: " + err.message);
      console.error("Error fetching users:", err);
      return [];
    }
  }

  const loadContacts = async () => {
    try {
      const userID = user.id;
      const users = await fetchUsers();
      console.log("Fetched users:", users);
      const filteredContacts = users.filter((u) => u.id !== userID);
      setContacts(filteredContacts);

      if (filteredContacts.length > 0) {
        loadChat(filteredContacts[0].id);
      }
    } catch (err) {
      alert("Error loading contacts: " + err.message);
    }
  };

  const loadChat = async (contactId) => {
    try {
      const users = await fetchUsers();
      const contact = users.find((contact) => contact.id === contactId);
      setChatContact(contact);

      const userId = user.id;
      console.log("Fetching messages for:", userId, contactId);
      const fetchedMessages = await fetchMessages(userId, contactId);
      setMessages(fetchedMessages);
      console.log("Fetched messages:", fetchedMessages);
    } catch (err) {
      alert("Error loading chat: " + err.message);
    }
  };

  async function fetchMessages(senderId, receiverId) {
    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
          query {
            messages(senderId: "${senderId}", receiverId: "${receiverId}") {
              id
              senderId
              receiverId
              message
              timestamp
            }
          }
        `,
        }),
      });
      if (!response.ok) throw new Error("Failed to fetch messages");
      const { data } = await response.json();
      return data.messages;
    } catch (err) {
      alert("Error fetching messages: " + err.message);
      console.error("Error fetching messages:", err);
      return [];
    }
  }

  const sendMessages = () => {
    if (chatContact) {
      try {
        const input = document.getElementById("message-input");
        const text = input.value.trim();
        if (!text) return;

        input.value = "";
        // Remove localStorage usage for chat, only use WebSocket and backend
        const newMessage = {
          senderId: user.id,
          receiverId: chatContact.id,
          message: text,
          timestamp: new Date().toISOString(),
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        sendMessage(JSON.stringify(newMessage));
      } catch (err) {
        alert("Error sending message: " + err.message);
      }
    }
  };

  // Handle incoming WebSocket messages (Blob-safe)
  useEffect(() => {
    if (lastMessage !== null && chatContact) {
      if (lastMessage.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const parsed = JSON.parse(reader.result);
            handleIncomingMessage(parsed);
          } catch (err) {
            console.error("Invalid WebSocket message format:", err);
          }
        };
        reader.readAsText(lastMessage.data);
      } else {
        try {
          const parsed = JSON.parse(lastMessage.data);
          handleIncomingMessage(parsed);
        } catch (err) {
          console.error("Invalid WebSocket message format:", err);
        }
      }
    }
  }, [lastMessage, chatContact]);

  const handleIncomingMessage = (parsed) => {
    const currentUserId = user.id;
    if (
      parsed.receiverId === currentUserId &&
      parsed.senderId === chatContact?.id
    ) {
      setMessages((prev) => [...prev, parsed]);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

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
              onClick={() => {
                loadChat(contact.id);
                setChatContact(contact);
              }}
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
          {messages.map((message, idx) => (
            <li key={message.id} className="w-full my-2 h-12">
              <p
                className={`h-full w-fit px-6 py-3 text-base rounded ml-1 ${
                  message.senderId === user.id
                    ? "bg-[#027bff] float-right"
                    : "bg-[#1e1e1e]"
                }`}
              >
                {message.message}
              </p>
              {/* Attach ref to the last message */}
              {idx === messages.length - 1 && <span ref={messagesEndRef} />}
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
              if (event.key === "Enter") sendMessages();
            }}
          />
          <button
            className="ml-2 px-4 py-3 bg-[#4caf50] text-white rounded text-base cursor-pointer"
            onClick={sendMessages}
          >
            Send
          </button>
        </div>
        <div className="absolute bottom-24 left-[2%] text-white">
          WebSocket: {connectionStatus}
        </div>
      </section>
    </main>
  );
};

export default Chat;
