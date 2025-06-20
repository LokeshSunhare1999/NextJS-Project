import React from 'react';

interface PrivacyPolicyModalProps {
  onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8 text-left overflow-y-auto max-h-[80vh]">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
        aria-label="Close"
      >
        &times;
      </button>
      <main>
        <h1 className="text-3xl font-bold mb-4 text-center">PRIVACY POLICY</h1>
        <p>
          Saathi is a commercial app by Saathi WorldAPP Private Limited (formerly GreyBlue Ventures Private Limited) ("Saathi"). This page is used to inform visitors regarding our policies with the collection, use, and disclosure of Personal Information for anyone using the app and website of Saathi ("Saathi Platform"). By using Saathi Platform, you consent to the terms of our privacy policy ("Privacy Policy") in addition to our Terms of Service. We encourage you to read this Privacy Policy regarding the collection, use, and disclosure of your information from time to time to keep yourself updated with the changes & updates that we make to this Privacy Policy.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Personal Identification Information</h2>
        <p>
          If you choose to use our Service, then you agree to the collection and use of information in relation to this policy. The Personal Identification Information that we collect is used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy.
        </p>
        <p>
          The personal information you provide on Saathi Platform when you fill out your profile is public, such as your name, location, gender, profile picture, education and professional info including where you are working. This is hereinafter called Public Profile. Your Public Profile will be published on Saathi Platform. Your Public Profile can:
        </p>
        <ul className="list-disc ml-8 mb-2">
          <li>Be associated with you on the internet.</li>
          <li>Show up when someone does a search on search engine.</li>
        </ul>
        <p>
          We also use your Public Profile, to access growth opportunities. We may collect Personal Identification Information of users including the information that is available on the internet, such as from Truecaller, Facebook, LinkedIn, Twitter and Google, or publicly available information that we acquire from service providers. We collect this information to identify users for better communication, processing and personalization of the Services provided by the third party service provider, who may have access to the data so collected.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Non-personal Identification Information</h2>
        <p>
          We may collect non-personal identification information about users whenever they interact with our site. Non-personal identification information may include the type of mobile phone and technical information about users, such as the operating system and the Internet service providers utilized including IP address and other similar information.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Usage and Technical Information</h2>
        <p>
          We collect the information about how you interact with our Service. This information may include your IP address, geographical location, browser type, referral source, length of visit, pages viewed and items clicked.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Information Collection</h2>
        <p>
          For a better experience, while using our Service, you are required to provide us with certain personally identifiable information for your Public Profile, including but not limited to:
        </p>
        <ul className="list-disc ml-8 mb-2">
          <li>Identity information, such as your first name, last name, gender, date of birth, username and/or similar as may be verified by voter ID card, Aadhar Card, PAN or driving license;</li>
          <li>Contact information, such as your mobile number, postal address, email address and telephone number;</li>
          <li>Professional information, such as your education, work experience, skills, salary, photo, city, area and other relevant details. Professional information helps you to get more from our Services, including helping employers find you. Please do not post or add personal data to your resume that you would not want to be publicly available.</li>
          <li>Feedback and correspondence, such as information you provide when you respond to surveys, participate in market research activities, report a problem with Service, receive customer support or otherwise correspond with us;</li>
          <li>Usage information, such as information about how you use the Service and interact with us; and</li>
          <li>Marketing information, such as your preferences for receiving marketing communications and details about how you engage with them.</li>
        </ul>
        <p>
          Saathi Platform's mission is to provide skilling courses and content for better job opportunities, connect talent to job opportunities and employers to quality talent. We are committed to be transparent about the data we collect about you, how it is used and with whom it is shared.
        </p>
        <p>
          When you use the services of our customers and partners, such as employers or prospective employers and applicant tracking systems, we share your Public Profile (e.g., your job title and name of the company where you work) with prospective employers to enable you to get job interviews.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Information We Collect</h2>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Contacts List</h3>
          <p>
            When you sync your contacts with our Services, we import and store the contacts list to our servers. You have the option to deny us the access to your contacts list. We also receive personal data (including contact information) about you when others import or sync their contacts with our Services.
          </p>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Location Information</h3>
          <p>
            When you give location permission, we access information that is derived from your GPS. We may use third-party cookies and similar technologies to collect some of this information.
          </p>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Storage</h3>
          <p>
            When you opt-in for storage permission, we access your device storage like gallery photos, files etc.
          </p>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Camera</h3>
          <p>
            Granting camera permission allows us to access the photo that you click to be displayed on your resume.
          </p>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Microphone</h3>
          <p>
            Voice and audio information when you use audio features.
          </p>
        </div>

        <h2 className="text-xl font-semibold mt-6 mb-2">How We Use It</h2>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Contacts List</h3>
          <p>
            We collect your contacts to help you keep growing your network by suggesting connections for you and your friends.
          </p>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Location Information</h3>
          <p>
            To provide you with location-based services like finding jobs near you.
          </p>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Storage</h3>
          <p>
            To allow you to select your profile picture from your existing photos in the gallery. A good resume photo helps you stand out among other candidates.
          </p>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Camera</h3>
          <p>
            To allow you to click your profile picture. A good resume photo helps you stand out among other candidates.
          </p>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Microphone</h3>
          <p>
            To allow you to send audio messages within the app.
          </p>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Call</h3>
          <p>
            To allow calling into the Saathi support system and to connect with potential employers.
          </p>
        </div>

        <p className="mb-4">
          To effectively provide and introduce any new Services to you, we collect and use certain information, including, but not limited to, such as:
        </p>

        <ul className="list-disc ml-8 mb-4">
          <li>We may use your email id to send you updates on upskilling courses and job opportunities.</li>
          <li>We log your visits and use of our Services.</li>
          <li>We receive data from your devices and networks, including location data.</li>
          <li>We may further request and store additional information.</li>
          <li>To monitor usage or traffic patterns (including to track users' movements around the Services) and gather demographic information.</li>
          <li>To communicate directly with you, including by sending you information about new products and services.</li>
          <li>To deliver you a personalized experience. May come in the form of messages, delivering tailor-made ads based on your interest and browsing history.</li>
        </ul>

        <p>
          To the extent permitted by the applicable law, we may record and monitor your communications with us to ensure compliance with our legal and regulatory obligations and our internal policies. This may include the recording of telephone conversations.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">How We Protect Your Information</h2>
        <p>
          We adopt appropriate data collection, storage and processing practices and security measures to protect against unauthorized access, alteration, disclosure or destruction of your personal information, username, password, transaction information and data stored on our app. The data is stored securely on our servers.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Sharing Your Personal Information</h2>
        <p>
          We do not sell, trade, or rent users personal identification information to any third party. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates and advertisers for the purposes outlined above. The app does use third-party services that may collect information used to identify you.
        </p>

        <h3 className="font-semibold mt-4 mb-2">Link to Privacy Policy of Third-Party Service Providers Used by the App</h3>
        <ul className="list-disc ml-8 mb-4">
          <li>Google Play Services: <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy</a></li>
          <li>Firebase: <a href="https://firebase.google.com/support/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://firebase.google.com/support/privacy</a></li>
          <li>Hyperverge: <a href="https://hyperverge.co/privacy-policy/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://hyperverge.co/privacy-policy/</a></li>
          <li>Clevertap: <a href="https://clevertap.com/privacy-policy/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://clevertap.com/privacy-policy/</a></li>
          <li>Amazon Web Services: <a href="https://aws.amazon.com/privacy/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://aws.amazon.com/privacy/</a></li>
          <li>Sentry: <a href="https://sentry.io/terms/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://sentry.io/terms/</a></li>
          <li>Netcore: <a href="https://netcorecloud.com/privacy-policy/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://netcorecloud.com/privacy-policy/</a></li>
          <li>Gupshup: <a href="https://www.gupshup.io/privacy-policy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.gupshup.io/privacy-policy</a></li>
          <li>Juspay: <a href="https://juspay.io/privacy-policy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://juspay.io/privacy-policy</a></li>
          <li>Videocrypt: <a href="https://www.videocrypt.com/pages/privacy-policy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.videocrypt.com/pages/privacy-policy</a></li>
          <li>Cloudflare: <a href="https://www.cloudflare.com/en-in/privacypolicy/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.cloudflare.com/en-in/privacypolicy/</a></li>
        </ul>

        <p className="mb-4">
          We do not disclose, transfer or share your personal information with others except with:
        </p>

        <ul className="list-disc ml-8 mb-4">
          <li>Our affiliates and group companies to the extent required for our internal business and/or administrative purposes and/or general corporate operations and for provision of services aimed at helping you in your career enhancement;</li>
          <li>Companies, in the event you have posted jobs on Saathi Platform on behalf of such companies;</li>
          <li>Candidates who have applied to the job posted by you on the Saathi Platform if you are a prospective employer and/or job poster, if we determine that the requirements of the job post, match with the resume of the candidate. By registering on the Saathi Platform and consenting to the terms of this Privacy Policy, you agree that we may contact you or share your contact details with the candidates for the purpose of the Services;</li>
          <li>Potential recruiters/ job posters if you are a candidate and/or job seeker if we determine that your resume matches a particular job description/ vacancy available with such recruiters. By registering on the Saathi Platform and consenting to the terms of this Privacy Policy, you agree that we may contact you or forward your resume to potential recruiters;</li>
          <li>Third parties including enforcement, regulatory and judicial authorities, if we determine that disclosure of your personal information is required to a) respond to court orders, or legal process, or to establish or exercise our legal rights or defend against legal claims; or b) investigate, prevent, or take action regarding illegal activities, suspected fraud, situations involving potential threats to the physical safety of any person, violations of our Terms of Service or as otherwise required by law;</li>
          <li>In the event of a merger, acquisition, financing, or sale of assets or any other situation involving the transfer of some or all of our business assets we may disclose personal information to those involved in the negotiation or transfer.</li>
          <li>Third party service providers and marketing partners that we engage to a) provide services over the Platform on our behalf including but not limited to background verification and check; b) maintain the Platform and mailing lists; or c) communicate with you on our behalf about offers relating to its products and/or services. We will take reasonable steps to ensure that these third-party service providers are obligated to protect your personal information and are also subject to appropriate confidentiality / non-disclosure obligations.</li>
        </ul>

        <p className="mb-4">
          You, hereby agree and acknowledge that you will use the information shared with you only for the purpose of the Services. You shall not use such information for any personal or other business purposes. In the event you are found to be misusing the information shared with you, we shall, at our sole discretion, delete your account with immediate effect and you will be blocked from using/ accessing Saathi Platform in future.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Log Data</h2>
        <p>
          Whenever you use our Service, including our sites, app and platform technology, such as when you view or click on content (e.g., learning video/course) or perform a search, install or update one of our mobile apps, post messages or apply for jobs and in a case of an error in the app we collect data and information (through third-party products) on your phone called Log Data. This Log Data may include information such as log-ins, cookies, your device Internet Protocol ("IP") address, device name, operating system version, the configuration of the app when utilizing our Service, the time and date of your use of the Service, and other statistics to identify you and log your use.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Cookies</h2>
        <p>
          Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. These are sent to your browser from the websites that you visit and are stored on your device's internal memory. This Service does not use these "cookies" explicitly. However, the app may use third party code and libraries that use "cookies" to collect information and improve their services. You have the option to either accept or refuse these cookies and know when a cookie is being sent to your device. If you choose to refuse our cookies, you may not be able to use some portions of this Service.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Service Providers</h2>
        <p>
          We may employ third-party companies and individuals due to the following reasons:
        </p>
        <ul className="list-disc ml-8 mb-4">
          <li>To facilitate our Service;</li>
          <li>To provide the Service on our behalf;</li>
          <li>To perform Service-related services; or</li>
          <li>To assist us in analyzing how our Service is used.</li>
        </ul>
        <p>
          We want to inform users of this Service that these third parties have access to your Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">One-to-One Messages</h2>
        <p>
          Saathi has access to the one-to-one messages of users of the app and we review these messages periodically for moderation of trust and safety related concerns. However, Saathi never shares this data with any third-party.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Security</h2>
        <p>
          We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security. Additionally, you agree and acknowledge that you will not share any personal information or personally identifiable information including but not limited to bank account details, credit/debit card details, Aadhar number, passwords and other such personal information with Saathi bhAI.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Links to Other Sites</h2>
        <p>
          This Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Children's Privacy</h2>
        <p>
          These Services do not address anyone under the age of 18. We do not knowingly collect personally identifiable information from minors under 18. In case we discover that a minor under 18 has provided us with personal information, we immediately delete this from our servers. If you are a parent or guardian and you are aware that your minor has provided us with personal information, please contact us so that we will be able to do necessary actions.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">No Impersonation or False Information to be Provided</h2>
        <p>
          You have to use your actual name on the Platform, you are required to input your correct phone number to use our Services. You will be getting access to the courses, Saathi Services and job based on your Saathi account. You will not falsely represent yourself as another person or representative of another person to use our Services. You will not lie about your details, for any reason.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Trust and Safety</h2>
        <p>
          Saathi takes the trust and safety of all its users seriously. We do not allow content that promotes abuse, fraud, MLM/network marketing, job openings that charge fees, suicide, self-harm, or is intended to shock or disgust users. Strict action is taken against such content and with people posting such messages/content in the group. To ensure the best possible experience for all the users of the app, we have established some basic guidelines called the Community Guidelines. The Community Guidelines gets updated periodically. You will be notified when this happens.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Disclaimer</h2>
        <p>
          Saathi does not hold any responsibility for any incident, fraud, cheat or crime that may happen to any users. We advise you to check and verify information of other users before proceeding with any transactions or interaction among users. Also, do not share your private information on group, to prevent the use of such information for any un-safe purposes.
        </p>
        <p>
          When you see something inappropriate or come across an offending content, please use the provided option to 'report' post. This will alert the Saathi Platform about the post and allows for necessary action to be taken.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">What to Do If You Find Suicide & Self-Injury Related Content</h2>
        <p>
          If you come across content in which someone expresses suicidal thoughts or is engaging in self-harm, please use the provided option to 'report' post. This will alert the Saathi Platform about the post and allows for necessary action to be taken.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately after they are posted on this page.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Contact Us</h2>
        <p>
          If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at: 5th Floor, TOWER-A, MILLENNIUM PLAZA, 503, Sector-27, Gurugram, Haryana 122009
        </p>
      </main>
    </div>
  </div>
);

export default PrivacyPolicyModal;