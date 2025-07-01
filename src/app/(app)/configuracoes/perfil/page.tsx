'use client'
import { useSession } from "@/providers/SessionProvider"

export default function ProfilePage() {
    const session = useSession()

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Profile Page</h1>
            {session ? (
                <div className="text-center">
                    <p className="mb-2">Welcome, {session.email}!</p>
                    <p className="text-gray-500">This is your profile page.</p>
                </div>
            ) : (
                <p className="text-red-500">You are not logged in.</p>
            )}
        </div>
    )
}