'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Session } from '@e2b/sdk';

export default function Terminal(props) {
  const [commands, setCommands] = useState([
    { command: "Welcome to flash terminal!", result: "This is a disposable terminal execution environment with Ubuntu 22 bash and Node.js. \nOnce you refresh the page or close the webpage, the environment will be automatically cleaned up. \nType '/help' to get help info."}
  ]);
  const [currentCommand, setCurrentCommand] = useState("");
  const terminalRef = useRef(null);
  const inputRef = useRef(null); // 

  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [session, setSession] = useState();
  const [currentOutput, setCurrentOutput] = useState("");


  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands, currentOutput]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const func = async () => {
      try {
        const session = await Session.create({
          id: 'Nodejs',
          apiKey: process.env.NEXT_PUBLIC_E2B_API_KEY,
        });
  
        setSession(session);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
    func();

    return () => {
      if (session) {
        session.close();
      }
    }
  }, [])

  const handleInputChange = (e) => {
    setCurrentCommand(e.target.value);
  }

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      await executeCommand(currentCommand);
      setCurrentCommand('');
    }
  }

  const executeCommand = async (command) => {
    let result = "";

    switch (command) {
      case "/help":
        result = "Available commands: \n/host: get public URL to this session. \n/host3000: get public URL to this session 3000 port. \n/exit: back to homepage.";
        break;
      case "/exit":
        await session.close();
        router.push('/');
        break;
      case "/host":
        console.log('https://' + session.getHostname());
        result = 'https://' + session.getHostname();
        setCommands([...commands, { command, result }]);
        break;
      case "/host3000":
        console.log('https://' + session.getHostname(3000));
        result = 'https://' + session.getHostname(3000);
        setCommands([...commands, { command, result }]);
        break;
      default:
        setCurrentOutput("");
        session.process.start({
          cmd: command,
          onStdout: output => {
            console.log(output.line);
            setCurrentOutput(prevOutput => prevOutput + output.line + "\n");
          },
          onStderr: output => {
            console.log(output.line);
            setCurrentOutput(prevOutput => prevOutput + output.line + "\n");
          },
        }).then(async (processInit) => {
          await processInit.finished;
          // 假设 processInit 有一个 finished 属性表示进程是否完成
          if (processInit.finished) {
            setCommands(pre => {
              const finalOutput = processInit.output.stdout + processInit.output.stderr;
              console.log('finalOutput', processInit, processInit.output.stdout);
              const _pre = [...pre];
              _pre.push({ command, result: finalOutput });
              return _pre;
            });
            setCurrentOutput(""); // 执行完命令后再次清空输出
            console.log('command', commands);
          }
        });
        break;
    }

  }

  if (loading) {
    return <div className="fixed top-0 left-0 w-screen h-screen bg-black text-green-500 flex items-center justify-center">
      loading...
    </div>
  }

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black text-green-500 flex flex-col justify-end p-4" onClick={()=>{
      // if (inputRef.current) {
      //   inputRef.current.focus();
      // }
    }}>
      <div ref={terminalRef} className="overflow-y-scroll mb-2 max-h-[95%]">
        {commands.map((cmd, idx) => (
          <div key={idx}>
            <div className="whitespace-pre">$ {cmd.command}</div>
            <div className="whitespace-pre">{cmd.result}</div>
          </div>
        ))}
        <div className="whitespace-pre">{currentOutput}</div>
      </div>
      <div className="flex items-center">
        <span className="mr-2">$</span>
        <input
          type="text"
          ref={inputRef}
          value={currentCommand}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="bg-black focus:outline-none w-full text-green-500"
        />
      </div>
    </div>
  );
}
