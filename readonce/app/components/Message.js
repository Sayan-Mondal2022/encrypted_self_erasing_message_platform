export default function Message({ text, sender }) {
  return (
    <div
      className={`p-2 rounded-lg max-w-xs ${
        sender === "You"
          ? "bg-blue-500 text-white self-end ml-auto"
          : "bg-gray-200 text-black"
      }`}
    >
      <p className="text-sm">{text}</p>
      <span className="block text-xs mt-1 opacity-70">{sender}</span>
    </div>
  );
}
