import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { getConversations, getMessages, sendChat } from "../api/api";
import socket, { connectSocket } from "../api/socket";
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  ChevronRight,
  MessageSquare,
} from "lucide-react";

function Avatar({ src, initials, size = 40, online = false }) {
  const API_BASE_URL = "http://localhost:4000";
  const fullSrc = src ? (src.startsWith('http') ? src : `${API_BASE_URL}/${src}`) : null;

  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: size, height: size }}
    >
      {fullSrc ? (
        <img
          src={fullSrc}
          alt=""
          className="rounded-full object-cover w-full h-full"
        />
      ) : (
        <div
          className="rounded-full flex items-center justify-center font-bold text-white shadow-inner"
          style={{
            width: size,
            height: size,
            background:
              "linear-gradient(135deg,var(--color-primary),var(--color-primary-600))",
            fontSize: size * 0.38,
          }}
        >
          {initials}
        </div>
      )}
      {online && (
        <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white ring-1 ring-black/5" />
      )}
    </div>
  );
}

const Chat = () => {
  const [activeId, setActiveId] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [mobileView, setMobileView] = useState("list");
  const messagesContainerRef = useRef(null);

  // Fetch conversations
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await getConversations();
        const chatData = response.data.data.map(chat => ({
          id: chat.id,
          name: chat.name || "مستخدم",
          avatar: chat.avatar,
          lastMsg: chat.lastMsg || "بدء محادثة جديدة",
          time: chat.time ? new Date(chat.time).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : "",
          initials: (chat.name || "U")[0],
          online: false,
          unread: chat.unread || 0,
        }));
        setContacts(chatData);
        if (chatData.length > 0 && !activeId) setActiveId(chatData[0].id);
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChats();
  }, []);

  // Socket Connection and Real-time listener
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.id) {
      connectSocket(user.id);
    }

    const handleNewMessage = (newMsg) => {
      // If the message is from the active contact, add it to messages
      if (activeId && (newMsg.senderId === activeId || newMsg.receiverId === activeId)) {
        setMessages(prev => {
          // Avoid duplicates if already added by handleSendMessage
          if (prev.find(m => m.id === newMsg.id)) return prev;
          return [...prev, {
            ...newMsg,
            time: new Date(newMsg.time).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
          }];
        });
      }

      // Update contacts list last message
      setContacts(prev => prev.map(c => 
        (c.id === newMsg.senderId || c.id === newMsg.receiverId)
        ? { 
            ...c, 
            lastMsg: newMsg.text, 
            time: "الآن",
            unread: (activeId === c.id) ? c.unread : (c.unread + 1)
          } 
        : c
      ));
    };

    socket.on("receive_message", handleNewMessage);
    return () => {
      socket.off("receive_message", handleNewMessage);
    };
  }, [activeId]);

  // Fetch messages when active contact changes
  useEffect(() => {
    if (!activeId) return;
    const fetchMsgs = async () => {
      try {
        const response = await getMessages(activeId);
        const mappedMsgs = response.data.data.map(m => ({
          ...m,
          time: new Date(m.time).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        }));
        setMessages(mappedMsgs);
        
        // Clear unread for this contact
        setContacts(prev => prev.map(c => c.id === activeId ? { ...c, unread: 0 } : c));
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };
    fetchMsgs();
  }, [activeId]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const activeContact = contacts.find((c) => c.id === activeId);
  const filteredContacts = contacts.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || (c.lastMsg && c.lastMsg.toLowerCase().includes(search.toLowerCase())),
  );

  const handleSendMessage = async () => {
    const text = input.trim();
    if (!text || !activeId) return;

    try {
      const response = await sendChat(activeId, text);
      const newMsg = {
        id: response.data.data.id,
        text,
        mine: 1,
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, newMsg]);
      setInput("");

      // Update local last message for contact
      setContacts(prev => prev.map(c => c.id === activeId ? { ...c, lastMsg: text, time: "الآن" } : c));
    } catch (error) {
      toast.error("فشل إرسال الرسالة");
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <section
      dir="rtl"
      className="bg-slate-50 flex items-stretch justify-center px-2 py-4 lg:py-6 h-[calc(100vh-80px)] overflow-hidden"
      style={{ fontFamily: "'Cairo', 'Segoe UI', sans-serif" }}
    >
      <div className="max-w-6xl w-full flex flex-col lg:flex-row gap-4 h-full">

        {/* Mobile Toggle */}
        <div className="lg:hidden bg-white rounded-xl p-1 grid grid-cols-2 gap-1 shadow-sm border border-slate-200">
          <button
            onClick={() => setMobileView("list")}
            className={`py-2.5 rounded-lg text-sm font-bold transition-all ${mobileView === "list" ? "bg-primary text-white shadow-md" : "text-slate-600"}`}
          >
            المحادثات
          </button>
          <button
            onClick={() => setMobileView("chat")}
            className={`py-2.5 rounded-lg text-sm font-bold transition-all ${mobileView === "chat" ? "bg-primary text-white shadow-md" : "text-slate-600"}`}
          >
            الرسائل
          </button>
        </div>

        {/* Conversation List (Right) */}
        <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col w-full lg:w-[340px] ${mobileView === "chat" ? "hidden lg:flex" : "flex"}`}>
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-800">الرسائل</h2>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <MessageSquare size={18} />
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-100 focus-within:border-primary/30 transition-all">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="بحث في المحادثات..."
                className="bg-transparent text-sm w-full outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {filteredContacts.length > 0 ? filteredContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => { setActiveId(contact.id); setMobileView("chat"); }}
                className={`w-full flex items-center gap-3 px-4 py-4 transition-all ${activeId === contact.id ? "bg-primary/5 border-l-4 border-l-primary" : "hover:bg-slate-50"}`}
              >
                <Avatar src={contact.avatar} initials={contact.initials} size={48} online={contact.online} />
                <div className="flex-1 min-w-0 text-right">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-bold text-slate-800 truncate">{contact.name}</span>
                    <span className="text-[10px] whitespace-nowrap text-slate-400 font-medium">{contact.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-slate-500 truncate">{contact.lastMsg}</p>
                    {contact.unread > 0 && (
                      <span className="min-w-[18px] h-[18px] flex items-center justify-center bg-primary text-white rounded-full text-[10px] font-bold px-1 animate-pulse">
                        {contact.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            )) : (
              <div className="p-10 text-center text-slate-400 text-sm">لا توجد محادثات</div>
            )}
          </div>
        </div>

        {/* Chat Area (Left) */}
        <div className={`flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col ${mobileView === "list" ? "hidden lg:flex" : "flex"}`}>
          {activeContact ? (
            <>
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md z-10">
                <div className="flex items-center gap-3">
                  <button onClick={() => setMobileView("list")} className="lg:hidden p-2 -mr-2 text-slate-400">
                    <ChevronRight size={20} />
                  </button>
                  <Avatar src={activeContact.avatar} initials={activeContact.initials} size={42} online={activeContact.online} />
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm leading-none">{activeContact.name}</h3>
                    <p className="text-[10px] text-green-500 font-bold mt-1 uppercase tracking-wider">نشط الآن</p>
                  </div>
                </div>
                <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>

              {/* Messages Container */}
              <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto px-5 py-6 bg-slate-50/50 flex flex-col gap-4 scroll-smooth"
              >
                {messages.map((msg, i) => (
                  <div key={msg.id || i} className={`flex flex-col ${msg.mine ? "items-start" : "items-end"}`}>
                    <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm transition-all ${msg.mine
                      ? "bg-primary text-white rounded-tl-none"
                      : "bg-white text-slate-700 rounded-tr-none border border-slate-100"
                      }`}>
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 mx-1 font-medium">{msg.time}</span>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-slate-100 bg-white">
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-1.5 focus-within:border-primary/20 transition-all">
                  <button className="p-2.5 text-slate-400 hover:text-primary transition-colors">
                    <Paperclip size={20} />
                  </button>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="اكتب رسالتك هنا..."
                    className="flex-1 bg-transparent text-sm py-2 px-1 outline-none text-right"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!input.trim()}
                    className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all ${input.trim() ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-slate-200 text-slate-400"
                      }`}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-4 p-10 bg-slate-50/30">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                <MessageSquare size={40} />
              </div>
              <p className="text-sm font-bold">ابدأ محادثة جديدة مع زملائك</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Chat;
