import React, { useState } from 'react';
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: `${process.env.REACT_APP_OPENAI_API_KEY}`, dangerouslyAllowBrowser: true });

const ChatApp = () => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedModel, setSelectedModel] = useState("gpt-3.5-turbo");
  const [systemRole, setSystemRole] = useState("You are a helpful assistant.");

  const chat = async (chatPrompt, model) => {
    var message = [
      { role: "system", content: `${systemRole}` },
      { role: "user", content: chatPrompt}
    ]
    const completion = await openai.chat.completions.create({
      messages: message,
      model: model,
    });
    console.log(message)
    return completion.choices[0].message.content;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call the chat function with the user input
    const response = await chat(userInput, selectedModel, systemRole);

    // Update the chat history with the user input and response
    setChatHistory([...chatHistory, { user: userInput, response }]);
    
    // Clear the input field
    setUserInput('');
  };

  const handleSystemRoleSubmit = (e) => {
    e.preventDefault();
    // Set the system role
    setSystemRole(systemRoleInput);
    // Clear the system role input field
    setSystemRoleInput('');
  };
  const [systemRoleInput, setSystemRoleInput] = useState('');

  return (
    <div>
      <div style={{
          position: 'sticky',
          top: 0,
          background: '#fff',
          zIndex: 1000,
          paddingBottom: "20px"
        }}>
        <p>GPT Role: {systemRole}</p>
        <form onSubmit={handleSystemRoleSubmit}>
          <input
            type="text"
            value={systemRoleInput}
            onChange={(e) => setSystemRoleInput(e.target.value)}
          />
          <button type="submit">Set System Role</button>
        </form>
      </div>
      <div>
        {chatHistory.map((entry, index) => (
          <div key={index}>
            <strong>User:</strong> {entry.user}
            <br />
            <strong>Response:</strong> {entry.response}
            <hr />
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          style={{ width: '100%' }}
        />
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          <option value="gpt-3.5-turbo">GPT 3.5</option>
          <option value="gpt-4">GPT 4</option>
        </select>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ChatApp />
      </header>
    </div>
  );
}

export default App;
