'use client';
import React, { useState, useRef, useEffect } from 'react';

export default function Terminal(props) {
  const [commands, setCommands] = useState([]);
  const [currentCommand, setCurrentCommand] = useState("");
  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  const handleInputChange = (e) => {
    setCurrentCommand(e.target.value);
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      executeCommand(currentCommand);
      setCurrentCommand('');
    }
  }

  const executeCommand = (command) => {
    let result = "";

    switch (command) {
      case "hello":
        result = "world!";
        break;
      default:
        result = `Unknown command: ${command}`;
    }

    setCommands([...commands, { command, result }]);
  }

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black text-green-500 flex flex-col justify-end p-4">
      <div ref={terminalRef} className="overflow-y-scroll mb-2 max-h-[95%]">
        {commands.map((cmd, idx) => (
          <div key={idx}>
            <div className="whitespace-pre">$ {cmd.command}</div>
            <div className="whitespace-pre">{cmd.result}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center">
        <span className="mr-2">$</span>
        <input
          type="text"
          value={currentCommand}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="bg-black focus:outline-none w-full text-green-500"
        />
      </div>
    </div>
  );
}
