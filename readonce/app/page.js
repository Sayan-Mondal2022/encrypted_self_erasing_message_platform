import Link from "next/link";

export default function Home() {
  return (
   <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-3xl font-bold">Welcome to ReadOnce</h1>
      <Link
        href="/chat"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
      >
        Go to Chat
      </Link>
    </div>
  );
}
