'use client'
import ProfileForm from "@/app/features/settings/components/ProfileForm"
import { useSession } from "@/providers/SessionProvider"

export default function ProfilePage() {
    const user = useSession()

    return (
        <div className="flex flex-col h-screen">

            {user ? (
                <ProfileForm user={user} />
            ) : (
                <p className="text-red-500">You are not logged in.</p>
            )}
        </div>
    )
}