import { useState, useRef, useEffect } from "react";
import { Avatar } from "antd";
import { UserOutlined, RobotOutlined, SendOutlined } from "@ant-design/icons";

const AIAssistant = ({ darkMode }) => {
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', text: 'Hello! How can I help you manage your candidates today? I can help you filter candidates, write job descriptions, or analyze resumes.' }
  ]);
  const [inputText, setInputText] = useState("");
  const endOfMessagesRef = useRef(null);

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    const userMsg = { id: Date.now(), role: 'user', text: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");

    // Simulate AI response
    setTimeout(() => {
      const aiMsg = { 
        id: Date.now() + 1, 
        role: 'ai', 
        text: `I'm an AI mockup. I've received your request: "${userMsg.text}". In a real deployment, I would process this through an LLM to give you actionable candidate insights!` 
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const bg = darkMode ? '#1e293b' : '#fff';
  const border = darkMode ? '#334155' : '#e2e8f0';
  const textCol = darkMode ? '#f8fafc' : '#1e293b';

  return (
    <div style={{ height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column', maxWidth: 900, margin: '0 auto', width: '100%', paddingBottom: 24 }}>
       <div style={{ marginBottom: 24, textAlign: 'center' }}>
          <h2 style={{ color: textCol, margin: 0, fontWeight: 800, fontSize: 28 }}>AI Recruiter</h2>
          <p style={{ color: darkMode ? '#94a3b8' : '#64748b', margin: '8px 0 0' }}>Your intelligent recruitment sidekick</p>
       </div>

       <div style={{ 
            flex: 1, 
            background: bg, 
            borderRadius: 24, 
            padding: 24, 
            border: `1px solid ${border}`, 
            display: 'flex', 
            flexDirection: 'column',
            boxShadow: darkMode ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.05)',
            overflow: 'hidden'
       }}>
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: 8, display: 'flex', flexDirection: 'column', gap: 20 }}>
             {messages.map(msg => {
                const isAI = msg.role === 'ai';
                return (
                  <div key={msg.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexDirection: isAI ? 'row' : 'row-reverse' }}>
                     <Avatar 
                        icon={isAI ? <RobotOutlined /> : <UserOutlined />} 
                        style={{ 
                          background: isAI ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : (darkMode ? '#334155' : '#e2e8f0'),
                          color: isAI ? '#fff' : (darkMode ? '#f8fafc' : '#475569')
                        }} 
                     />
                     <div style={{ 
                       background: isAI ? (darkMode ? '#0f172a' : '#f8fafc') : 'linear-gradient(135deg,#6366f1,#8b5cf6)', 
                       padding: '12px 18px', 
                       borderRadius: 18, 
                       borderTopLeftRadius: isAI ? 4 : 18,
                       borderTopRightRadius: !isAI ? 4 : 18,
                       maxWidth: '80%',
                       color: isAI ? textCol : '#fff',
                       fontSize: 15,
                       lineHeight: 1.5,
                       boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                     }}>
                         {msg.text}
                     </div>
                  </div>
                );
             })}
             <div ref={endOfMessagesRef} />
          </div>

          <div style={{ marginTop: 24, padding: '8px', background: darkMode ? '#0f172a' : '#f8fafc', borderRadius: 20, display: 'flex', alignItems: 'center', border: `1px solid ${border}` }}>
             <input 
               type="text" 
               value={inputText}
               onChange={e => setInputText(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && handleSend()}
               placeholder="Ask the AI about your candidates..." 
               style={{ 
                 flex: 1, 
                 padding: '12px 16px', 
                 border: 'none', 
                 outline: 'none',
                 background: 'transparent',
                 color: textCol,
                 fontSize: 15
               }} 
             />
             <button 
               onClick={handleSend}
               style={{
                 background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                 color: '#fff',
                 border: 'none',
                 borderRadius: '50%',
                 width: 44,
                 height: 44,
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 cursor: 'pointer',
                 boxShadow: '0 4px 10px rgba(99,102,241,0.4)',
                 transition: 'transform 0.2s'
             }}>
                 <SendOutlined />
             </button>
          </div>
       </div>
    </div>
  );
};

export default AIAssistant;
