export default function ChatLayout({ children }) {
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Chat Header */}
      <header className="bg-blue-600 text-white p-4 text-lg font-bold">
        Secure Chat
      </header>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto">{children}</main>

      {/* Chat Footer */}
      <footer className="bg-gray-200 p-2 text-center text-sm">
        End-to-End Encrypted
      </footer>
    </div>
  );
}
