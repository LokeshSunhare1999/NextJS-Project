import LoginSideComponent from "@/components/LoginSideComponent";
import { LOGIN_BANNER_BENEFITS, LOGIN_BANNER_HEADER } from "@/constants";
import MembershipBanner from "@/components/MembershipBanner/Index";
import ExternalHeader from "@/components/ExternalHeader";
import MwebMembershipBanner from "@/components/MwebMembershipBanner";
import LoginClientComponent from "./LoginClientComponent";

async function fetchEmployerSubscription() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/subscription/api/v1/employer`
  );
  const employerSubscription = await response.json();
  if (!response.ok) {
    throw new Error("Failed to fetch employer subscription data");
  }
  return employerSubscription;
}

export default async function LoginComponent() {
  const employerSubscriptionData = await fetchEmployerSubscription();

  return (
    <div className="flex flex-col-reverse md:flex-row h-auto">
      <div className="w-full h-[650px] md:h-screen md:w-1/3 md:block md:min-w-[400px] lg:min-w-[500px] flex-shrink-0">
        <LoginSideComponent />
      </div>
      <div className="md:w-2/3 w-full relative flex h-[580px] md:min-h-screen flex-col justify-center items-center">
        <div className="top-0 w-full absolute flex items-center justify-center hidden md:block">
          {employerSubscriptionData && (
            <MembershipBanner
              title={LOGIN_BANNER_HEADER}
              actualPrice={employerSubscriptionData?.actualPrice}
              loginPageTexts={LOGIN_BANNER_BENEFITS}
            />
          )}
        </div>
        <div className="top-0 z-10 w-full absolute flex flex-col items-center justify-center md:hidden">
          <ExternalHeader />
          <div className="w-full md:hidden">
            {employerSubscriptionData && (
              <MwebMembershipBanner
                title={LOGIN_BANNER_HEADER}
                actualPrice={employerSubscriptionData?.actualPrice}
                loginPageTexts={LOGIN_BANNER_BENEFITS}
              />
            )}
          </div>
        </div>
        <LoginClientComponent />
      </div>
    </div>
  );
}
