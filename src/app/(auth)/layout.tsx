import Banner, { MobileBanner } from "../features/auth/components/banner";
import Footer from "@/components/shared/footer";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col lg:flex-row min-h-screen justify-between bg-white dark:bg-zinc-900">
            <Banner />
            <MobileBanner />
            <div className="flex flex-col w-full justify-between flex-1/6  lg:w-7/12">
                <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto grid w-[350px] md:w-[500px] gap-6">
                        {children}
                    </div>
                </div>

                <Footer />
            </div>
        </div>
    )
}