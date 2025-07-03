import ProfileForm from "@/app/features/settings/components/ProfileForm"
import { getUserProfile } from '@/lib/queries'; 
import { redirect } from 'next/navigation';
import type { SessionUser } from '@/types';


export default async function ProfileSettingsPage() {
   
    const userProfile = await getUserProfile();

    if (!userProfile) {
        redirect('/auth/login');
    }

    const shouldStartInEditMode = !userProfile.has_completed_onboarding;

    return (
        <div>
            <ProfileForm
                user={userProfile as SessionUser}
                startInEditMode={shouldStartInEditMode}
            />
        </div>
    );
}
