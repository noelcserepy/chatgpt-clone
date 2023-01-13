import { FormEvent, useEffect, useState } from "react";

const Home = () => {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([
    { user: "gpt", message: "How can I help you today?" },
  ]);
  const [isResponding, setIsResponding] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setChatLog([...chatLog, { user: "me", message: `${input}` }]);
    console.log("chatlog", chatLog);
    setInput("");
    setIsResponding(true);
  };

  const handleNewChat = () => {
    setChatLog([]);
  };

  useEffect(() => {
    if (!isResponding) return;
    const postData = async () => {
      const message = chatLog
        .map((item) => `${item.user}: ${item.message} \n`)
        .join("");

      const res = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: message }),
      });

      const jsonRes = await res.json();
      const botResp = jsonRes.message;
      console.log("botResp", botResp);
      setChatLog([...chatLog, { user: "gpt", message: `${botResp}` }]);
    };

    postData();
    setIsResponding(false);
  }, [isResponding]);

  return (
    <div className="absolute top-0 left-0 bottom-0 right-0 flex">
      {/* Menu */}
      <aside className="h-full w-60 bg-gray-900 p-4">
        <button
          className=" w-full rounded border p-4 text-white"
          onClick={handleNewChat}
        >
          New Chat
        </button>
      </aside>

      <main className="flex h-full w-full flex-col items-center justify-between bg-gray-500">
        {/* Chat log */}
        <div className="h-full w-full">
          {chatLog.map((item, i) => {
            return (
              <div
                key={i}
                className={`w-full ${
                  item.user === "me" ? "bg-gray-600" : "bg-gray-400"
                }`}
              >
                <div className="mx-auto flex max-w-[80%] justify-start">
                  <div className="flex w-full justify-start">
                    <p className="h-10 w-10 text-white">{item.user}</p>
                    <p className="h-10 w-full text-white">{item.message}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input area */}
        <div className=" mb-8 w-[80%] rounded bg-gray-300">
          <form onSubmit={(e) => handleSubmit(e)}>
            <input
              className="h-full w-full bg-transparent"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            ></input>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Home;
