"use client";
import React from 'react';

interface TermsModalProps {
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div className="relative bg-white rounded-2xl shadow-xl max-w-5xl w-full p-8 text-left overflow-y-auto max-h-[80vh]">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
        aria-label="Close"
      >
        &times;
      </button>
      <main>
        <h1 className="text-3xl font-bold mb-4 text-center">USER TERMS OF SERVICE</h1>
        <div className="prose max-w-none text-sm">
          <ol className="list-decimal list-inside space-y-4 text-justify">
            <li>
              <strong>Usage of Saathi</strong>
              <p>The "Saathi Platform" (including any mobile based applications, website and web applications) is provided by Saathi WorldAPP Private Limited (formerly GreyBlue Ventures Private Limited) either directly or through its affiliates collectively referred to as ("Saathi "). Through the Saathi Platform any person with a verified account can view, access and participate in the services provided by Saathi.</p>
              <ol className="list-[lower-alpha] pl-4">
                <li>A User accessing the Saathi Platform shall be bound by these Terms of Service, and all other rules, regulations and terms of use referred to herein or provided by Saathi in relation to any services provided via the Saathi Platform ("Services").</li>
                <li>Saathi shall be entitled to modify these Terms of Service, rules, regulations and terms of use referred to herein or provided by Saathi in relation to any Saathi Services, at any time, by posting the same on the Saathi Platform. Use of the Saathi Platform and Services constitutes the User's acceptance of such modified Terms of Service, rules, regulations and terms of use referred to herein or provided by Saathi in relation to any Services, as may be amended from time to time. Saathi may, at its sole discretion, also notify the User of any change or modification in these Terms of Service, rules, regulations and terms of use referred to herein or provided by Saathi, by way of sending an email to the User's registered email address or posting notifications in the User accounts or through any other mode of communication. The User may then exercise the options provided in such an email or notification to indicate (non-)acceptance of the modified Terms of Service, rules, regulations and terms of use referred to herein or provided by Saathi on support@saathi.in. If such options are not exercised by the User within the time frame prescribed in the email or notification, the User will be deemed to have accepted the modified Terms of Service, rules, regulations and terms of use referred to herein or provided by Saathi.</li>
                <li>Certain Services being provided on Saathi Platform may be subject to additional rules and regulations set down in that respect. To the extent that these Terms of Service are inconsistent with the additional conditions set down, the additional conditions shall prevail.</li>
                <li>Saathi may, at its sole and absolute discretion:
                  <ol className="list-[lower-roman] pl-4">
                    <li>Restrict, suspend, or terminate any User's access to all or any part of the Saathi Platform or Services;</li>
                    <li>Change, suspend, or discontinue all or any part of the Platform or Services;</li>
                    <li>Reject, move, or remove any material that may be submitted by a User;</li>
                    <li>Move or remove any content that is available on the Saathi Platform;</li>
                    <li>Deactivate or delete a User's account and all related information and files on the account;</li>
                    <li>Establish general practices and limits concerning use of Saathi Platform;</li>
                    <li>Assign its rights and liabilities to all User accounts hereunder to any entity (post such assignment, intimation of such assignment shall be sent to all Users to their registered, mobile phone numbers and/or email ids, and/or by posting and/or on the Saathi platform and/or through such other modes of written communication as Saathi deems fit).</li>
                  </ol>
                </li>
                <li>In the event any User breaches, or if Saathi reasonably believes that such User has breached these Terms of Service, or has illegally or improperly used the Saathi Platform or Services, Saathi may, at its sole and absolute discretion, and without any notice to the User, restrict, suspend or terminate such User's access to all or any part of the Saathi Platform, deactivate or delete the User's account and all related information on the account, delete any content posted by the User on Saathi and further, take technical and legal steps as it deemed necessary.</li>
                <li>If Saathi charges its Users a platform fee in advance in respect of any Saathi Services, Saathi shall, without delay, repay such platform fee in the event of suspension or removal of the User's account or Saathi Services on account of any negligence or deficiency on the part of Saathi, but not if such suspension or removal is effected due to:
                  <ol className="list-[lower-roman] pl-4">
                    <li>any breach or inadequate performance by the User of any of these Terms of Service; or</li>
                    <li>any circumstances beyond the reasonable control of Saathi.</li>
                  </ol>
                </li>
                <li>By accepting these Terms of Service, Users are providing their consent to receiving all forms of communications including but not limited to announcements, administrative messages and advertisements from Saathi or any of its partners, licensors or associates.</li>
              </ol>
            </li>
            <li>
              <strong>Participation</strong>
              <p>When accessing and interacting with the Saathi Platform and Services a User will be able to view and take skilling courses and other Services offered by Saathi as well as apply for jobs posted by potential employers, interact with other Saathi Users etc. Jobs are posted by independent third parties not related to or affiliated with Saathi.</p>
              <ol className="list-[lower-alpha] pl-4">
                <li>In order to access and interact with the Saathi Platform and utilise the Services a User will be required to create a user ID ("True ID") on the Saathi Platform. Further, the User shall pay the applicable fee for the True ID ("Platform Fees/ Service Fees") in order to access the features and Services offered by Saathi on the Saathi Platform. The User acknowledges and agrees that Saathi shall have the right to modify the Platform and Service Fees, modify the paid features, add and/or remove content, add and/or remove premium content with additional fees, and any other Services offered, and create additional qualifications to access the Saathi Platform and the Services offered on the Saathi Platform at its sole discretion at anytime.</li>
                <li>To view and take a course, other Services and apply for a job a User may be required to provide information about their education, qualifications, past experience and skills or any other information required by Saathi. Saathi may use the information provided by the User, the results of the courses and/or tests taken by a User and any other information that may be relevant and available to Saathi to develop a rating for the User ("Saathi Rating"). The Saathi Rating shall be calculated on the basis of a multitude of factors, including but not limited to psychometric analyses, relevant qualifications, level of education and courses completed through the Saathi platform.</li>
                <li>While Saathi does not tolerate or allow for discrimination on the basis of gender, certain jobs that might be posted by potential employers might be gender specific and/or might be available only to persons of a certain gender. The User understands and acknowledges that such stipulations as to gender specifications for a certain job are not mandated by Saathi and that such stipulation is made by the job poster.</li>
                <li>The User agrees and acknowledges that upon creation of the True ID Saathi may conduct checks (including but not limited to checks for past experience, qualifications, criminal antecedents etc.) (such checks shall collectively be referred to as "Background Verification") as deemed appropriate by Saathi. If the Background Verification of the User fails or is incomplete, Saathi reserves the right to update the True ID to reflect such incomplete or failure status of the Background Verification and further reserves the right to communicate such failure or incomplete status to third parties (including, and especially to employers, whether current or potential) who rely on or intend to rely on the True ID of the User. For avoidance of doubt, a user shall at all times be able to access the Saathi Platform avail other Services offered by Saathi at Saathi's sole discretion irrespective of the status of their Background Verification.</li>
                <li>In the case of incomplete and/or failed Background Verification, Saathi shall, as it deems fit in its sole discretion, allow such number of further attempts to complete or conduct the Background Verification again. Upon successful completion of Background Verification, Saathi reserves the right to conduct re-verification upon such cadence as it deems fit in its sole discretion.</li>
                <li>By agreeing to these Terms of Service and accessing the Saathi Platform as well as applying for a job through the Saathi Platform, Users undertake that all information shared will, at all times, be accurate and not be misleading. The User understands and acknowledges that any incorrect information or misrepresentations made by the User will affect the reputation, credibility and efficacy of the Saathi Platform and Services offered by Saathi and that Saathi shall have the right to suspend the User's account if it is found that the information shared by the User is false or misleading.</li>
                <li>The job applications by the Users on the Saathi Platform shall remain active only for such periods of time as Saathi deems fit in its sole discretion. The validity of a job application may vary depending on multiple factors such as the nature and type of job, individual requirements of potential employers, the number of applications received to a particular job posting etc. The validity of a job application shall be calculated from the first date on which such job application is made. Saathi may set terms for the validity of such job application from time to time.</li>
                <li>Users agree that they shall at all times be bound by and adhere to the <a href="#">Code of Conduct</a> while accessing the Saathi Platform and while using the Services.</li>
                <li>Saathi may, from time to time and at its sole discretion, offer a program that allows Users to refer other potential users ("Saathi Referral Program"). Users participating in a relevant Saathi Referral Program, agree and acknowledge that they shall be bound by the terms of such Saathi Referral Program. The terms of a particular Referral Program shall be applicable once the User signs up on the Saathi Platform and creates a True ID and shall be eligible to participate in such Saathi Referral Program.</li>
                <li>All Platform/Service Fees charged by Saathi shall be refundable within such periods of time as communicated to Users from time-to-time. Any payments due and payable to a User in relation to a Saathi Referral Program shall be independent of any refunds of Platform/Service Fees and vice versa. In the event any person referred by a User to the Saathi platform claims a refund of the Platform/Service Fees paid by such referred person within the stipulated timeframe for claiming a refund and the User who referred such person has withdrawn the amount due and payable by Saathi for making the referral (each a "Referral Fee") Saathi, in its sole discretion, reserves the right to net off any future Referral Fees owed to the particular User against future referrals made by such User.</li>
                <li>Once the refund request is approved, the refund amount will be processed and credited within 5 days to the original mode of payment. In case of any issues, Users can reach out to Saathi at support@saathi.in.</li>
                <li>As part of the Services, users may be able to access artificial intelligence based natural/large language models which can make suggestions in relation to queries that a User might have in relation to various topics such as job/growth opportunities, access to financing, financial planning etc. ("Saathi bhAI") Users understand and acknowledge that Saathi bhAI being an artificial intelligence based natural/large language models might make mistakes in the responses that it generates. Users further understand and acknowledge that the responses generated by Saathi bhAI are not meant to be advice (whether legal, financial or otherwise) in any form or manner whatsoever. Saathi accepts no responsibility or liability whatsoever for any actions that a user might take pursuant to any actions taken based on the responses generated by Saathi bhAI.</li>
              </ol>
            </li>
            <li>
              <strong>Intellectual Property</strong>
              <ol className="list-[lower-alpha] pl-4">
                <li>The intellectual property rights ("Intellectual Property Rights") in all software underlying the Saathi Platform and the Services and material published on the Saathi Platform, including (but not limited to) software, advertisements, content (whether written, audio and/or visual), photographs, graphics, images, illustrations, graphs, charts, marks, logos, audio or video clippings, animations etc. is owned by Saathi, its affiliates, partners, licensors and/or associates. Users may not modify, publish, transmit, participate in the transfer or sale of, reproduce, create derivative works of, distribute, publicly perform, publicly display, or in any way exploit any of the materials or content on Saathi either in whole or in part without express written license from Saathi.</li>
                <li>Users are solely responsible for all materials (whether publicly posted or privately transmitted) that they upload, post, e-mail, transmit, or otherwise make available via the Saathi Platform ("User's Content"). Each User represents and warrants that they own all Intellectual Property Rights in the User's Content and that no part of the User's Content infringes any third-party rights. Users further confirm and undertake to not display or use the names, logos, marks, labels, trademarks, copyrights or intellectual and proprietary rights of any third party on the Saathi Platform, without written authorization from such third party. Users agree to indemnify and hold harmless Saathi, its directors, employees, affiliates and assigns against all costs, damages, loss and harm including towards litigation costs and counsel fees, in respect of any third party claims that may be initiated including for infringement of Intellectual Property Rights arising out of such display or use of the names, logos, marks, labels, trademarks, copyrights or intellectual and proprietary rights on the Saathi Platform, by such User or through the User's commissions or omissions</li>
                <li>Users hereby grant to Saathi and its affiliates, partners, licensors and associates a worldwide, irrevocable, royalty-free, non-exclusive, sub-licensable license to use, reproduce, create derivative works of, distribute, publicly perform, publicly display, transfer, transmit, and/or publish User's Content for any of the following purposes:
                  <ol className="list-[lower-roman] pl-4">
                    <li>displaying User's Content on Saathi Platform</li>
                    <li>distributing User's Content, either electronically or via other media, to potential employers/ recruiters , and/or</li>
                    <li>storing User's Content in a remote database accessible by end users, for a charge.</li>
                    <li>This license shall apply to the distribution and the storage of User's Content in any form, medium, or technology.</li>
                  </ol>
                </li>
                <li>All names, logos, marks, labels, trademarks, copyrights or intellectual and proprietary rights on the Saathi Platform belonging to any person (including a User), entity or third party are recognized as proprietary to the respective owners and any claims, controversy or issues against these names, logos, marks, labels, trademarks, copyrights or intellectual and proprietary rights must be directly addressed to the respective parties under notice to Saathi.</li>
              </ol>
            </li>
            <li>
              <strong>Third Party Sites, Services and Products</strong>
              <ol className="list-[lower-alpha] pl-4">
                <li>Links to other internet sites or mobile applications owned and operated by third parties may be provided via the Saathi Platform. The User's use of each of those sites is subject to the conditions, if any, posted by those sites and third parties. Saathi does not exercise control over any internet sites or mobile applications apart from the Saathi Platform and cannot be held responsible for any content residing in any third-party internet site or mobile application. Saathi's inclusion of third-party content or links to third-party internet sites or mobile applications is not an endorsement by Saathi of such third-party internet site or mobile application.</li>
                <li>A User's correspondence, transactions/offers or related activities with third parties including but not limited to potential employers, payment providers, and verification service providers, are solely between the User and the third party. A User's correspondence, transactions, and usage of the services/offers of such third party shall be subject to the terms and conditions, policies, and other service terms adopted/implemented by such third party, and the User shall be solely responsible for reviewing the same prior to transacting or availing the services/offers of such third party. The User agrees that Saathi will not be responsible or liable for any direct, indirect, or consequential loss or damage of any sort incurred as a result of any such transactions/offers with third parties. Any questions, complaints, or claims related to any third-party product or service should be directed to the appropriate vendor.</li>
                <li>The Saathi Platform contains content that is created by Saathi as well as content provided by third parties (including potential candidates). Saathi does not guarantee the accuracy, integrity, or quality of the content provided by third parties and such content may not be relied upon by the Users in utilizing the Services provided on the Saathi Platform.</li>
              </ol>
            </li>
            <li>
              <strong>Privacy Policy</strong>
              <ol className="list-[lower-alpha] pl-4">
                <li>All information collected from Users, such as registration (including but not limited to email addresses, mobile phone numbers, government identity documentation) and payment information, is subject to Saathi's Privacy Policy.</li>
                <li>Saathi does not share personal information of any individual with other companies/entities without obtaining permission. Saathi may share all such information that it has in its possession in accordance with the Privacy Policy.</li>
                <li>Once the personal information has been shared with the User, the User shall, at all times, be responsible to secure such information.</li>
                <li>User warrants and represents that User shall not disclose or transfer personal information shared by Saathi without ensuring that adequate and equivalent safeguards to the personal information.</li>
                <li>User hereby agrees and acknowledges that User will use the information shared with the User only for the purpose of availing the Services. User shall not use such information for any personal or other business purposes. In the event User is found to be misusing the information shared with User, Saathi shall, at its sole discretion, delete User's account with immediate effect and User will be blocked from using/accessing the Saathi Platform in the future.</li>
              </ol>
            </li>
            <li>
              <strong>User Conduct</strong>
              <ol className="list-[lower-alpha] pl-4">
                <li>
                  Users agree to abide by these Terms of Service and all other rules, regulations, and terms of use of the Saathi Platform and Services. In the event a User does not abide by these Terms of Service and all other rules, regulations, and terms of use, Saathi may, at its sole and absolute discretion, take necessary remedial action, including but not limited to:
                  <ol className="list-[lower-roman] pl-4">
                    <li>Restricting, suspending, or terminating any User's access to all or any part of the Saathi Platform and Services;</li>
                    <li>Deactivating or deleting a User's account and all related information and files on the account;</li>
                    <li>Any amount added by a User to the User's account created on the Saathi Platform, which is meant to be used for future payments towards the Platform/Service Fees or for any Saathi Services, remaining unused in the User's account on the date of deactivation or deletion, shall be transferred to the User's bank account on record with Saathi, subject to a processing fee (if any) applicable on such transfers as set out herein. Any unclaimed Referral Fees shall be forfeited at Saathi's sole discretion.</li>
                  </ol>
                </li>
                <li>User agrees to provide true, accurate, current, and complete information at the time of registration and at all other times (as required by Saathi). User further agrees to update and keep updated their registration information and other information as may be required by Saathi.</li>
                <li>A User shall not register or operate more than one User account with Saathi.</li>
                <li>User agrees to ensure that they can receive all communication from Saathi either by email, SMS, WhatsApp, or any other mode of communication. Saathi shall not be held liable if any communication sent to the User by Saathi remains unread and/or misinterpreted by the User.</li>
                <li>Any password issued by Saathi to a User may not be revealed to anyone else. Users may not use anyone else's password. Users are responsible for maintaining the confidentiality of their accounts and passwords. Users agree to immediately notify Saathi of any unauthorized use of their passwords or accounts or any other breach of security.</li>
                <li>Users agree to exit/log-out of their accounts at the end of each session. User shall be responsible for any loss or damage that may result if the User fails to comply with these requirements.</li>
                <li>Users agree not to use cheats, exploits, automation, software, bots, hacks, or any unauthorized third-party software designed to modify or interfere with the Saathi Services and/or Saathi experience or assist in such activity.</li>
                <li>Users agree not to copy, modify, rent, lease, loan, sell, assign, distribute, reverse engineer, grant a security interest in, or otherwise transfer any right to the technology or software underlying the Saathi Platform or Services.</li>
                <li>Users agree that without Saathi's express written consent, they shall not modify or cause to be modified any files or software that are part of Saathi's Services or the Saathi Platform.</li>
                <li>Users agree not to disrupt, overburden, or aid or assist in the disruption or overburdening of (a) any computer or server used to offer or support the Saathi Platform or Services (each a "Server"); or (b) the enjoyment of Services by any other User or person.</li>
                <li>Users agree not to institute, assist, or become involved in any type of attack, including without limitation to distribution of a virus, denial of service, or other attempts to disrupt Saathi Services or any other person's use or enjoyment of Saathi Services.</li>
                <li>Users shall not attempt to gain unauthorized access to User accounts, Servers, or networks connected to the Saathi Platform or Services by any means other than the User interface provided by Saathi, including but not limited to, by circumventing or modifying, attempting to circumvent or modify, or encouraging or assisting any other person to circumvent or modify, any security, technology, device, or software that underlies or is part of the Saathi Platform or Services.</li>
                <li>A User shall not publish any content that is patently false and untrue, and is written or published in any form, with the intent to mislead or harass a person, entity, or agency for financial gain or to cause any injury to any person.</li>
                <li>User shall not disparage Saathi and Saathi's representatives.</li>
                <li>
                  Without limiting the foregoing, Users agree not to use the Saathi Platform for any of the following:
                  <ol className="list-[lower-roman] pl-4">
                    <li>To engage in any obscene, offensive, indecent, racial, communal, anti-national, objectionable, defamatory, or abusive action or communication;</li>
                    <li>To harass, stalk, threaten, or otherwise violate any legal rights of other individuals;</li>
                    <li>To publish, post, upload, e-mail, distribute, or disseminate (collectively, "Transmit") any inappropriate, profane, defamatory, infringing, obscene, indecent, or unlawful content;</li>
                    <li>To Transmit files that contain viruses, corrupted files, or any other similar software or programs that may damage or adversely affect the operation of another person's computer, any software, hardware, or telecommunications equipment;</li>
                    <li>To advertise, offer or sell any goods or services for any commercial purpose and/or in order to mislead or conduct any fraudulent activities on the Saathi Platform including but not limited to multi-level marketing for a third party, promoting business of a third party, selling financial products such as loans, insurance, promoting demat account openings, without the express written consent of Saathi;</li>
                    <li>To download any file, decompile or disassemble or otherwise affect Saathi's products that User knows or reasonably should know cannot be legally obtained in such manner;</li>
                    <li>To falsify or delete any author attributions, legal or other proper notices or proprietary designations or labels of the origin or the source of software or other material;</li>
                    <li>To restrict or inhibit any other User from using and enjoying any public area within Saathi's sites;</li>
                    <li>To collect or store personal information about other Users;</li>
                    <li>To collect or store information about potential employers or recruiters;</li>
                    <li>To collect or store information about other candidates;</li>
                    <li>To mine information relating to potential recruiters with the aim of creating a database of potential recruiters whether or not such database is used or meant to be used by the User or any third party associated with the User or to whom such User makes such mined information available, for either a commercial purpose or for the User's own use at a future date;</li>
                    <li>To copy and store Saathi's content available on the Saathi Platform including but not limited to all the Intellectual Property Rights owned by Saathi;</li>
                    <li>To interfere with or disrupt the Saathi Services and/or the Saathi Platform, Saathi servers, or Saathi networks;</li>
                    <li>To impersonate any person or entity, including, but not limited to, a representative of Saathi, or falsely state or otherwise misrepresent User's affiliation with a person or entity;</li>
                    <li>To forge headers or manipulate identifiers or other data in order to disguise the origin of any content transmitted through Saathi or to manipulate User's presence on the Saathi Platform;</li>
                    <li>To take any action that imposes an unreasonably or disproportionately large load on Saathi's infrastructure;</li>
                    <li>To engage in any illegal activities;</li>
                    <li>To engage in any action that threatens the unity, integrity, defence, security, or sovereignty of India, friendly relations with foreign States, or public order, or causes incitement to the commission of any cognisable offence or prevents investigation of any offence or is insulting other nations.</li>
                  </ol>
                </li>
                <li>If a User chooses a username that, in Saathi's considered opinion is obscene, indecent, abusive or that might subject Saathi to public disparagement or scorn, or a name which is an official team/league/franchise names and/or name of any sporting personality, as the case may be, Saathi reserves the right, without prior notice to the User, to restrict usage of such names, which in Saathi's opinion falls within any of the said categories and/or change such username and intimate the User or delete such username and posts from Saathi Platform, deny such User access to Saathi Platform and Services, or any combination of these options.</li>
                <li>Unauthorized access to the Saathi Platform is a breach of these Terms of Service, and a violation of the law. Users agree not to access the Saathi Platform by any means other than through the interface that is provided by Saathi via the Saathi Platform for use in accessing the Saathi Platform. Users agree not to use any automated means, including, without limitation, agents, robots, scripts, or spiders, to access, monitor, or copy any part of the Saathi Platform, Saathi Services or any information available for access through the Saathi Platform or Saathi Services, except those automated means that Saathi has approved in advance and in writing.</li>
                <li>Use of the Saathi Platform is subject to existing laws and legal processes. Nothing contained in these Terms of Service shall limit Saathi's right to comply with governmental, court, and law-enforcement requests or requirements relating to Users' use of Saathi Platform and Services.</li>
                <li>Persons below the age of eighteen (18) years are not allowed to register with the Saathi Platform. All persons interested in becoming Users on the Saathi Platform might be required by Saathi to disclose their age at the time of getting access to the Saathi Platform. If a person declares a false age, Saathi shall not be held responsible and such person shall, in addition to forfeiting any and all rights over their Saathi account, shall indemnify and hold Saathi, its Directors, officers, employees, agents, affiliates harmless of any and all losses that may be suffered by Saathi, its Directors, officers, employees, agents, affiliates by virtue of such false declaration being made. In case the person making the false declaration is below the age of 18 years such person's legal guardians shall indemnify and hold Saathi, its Directors, officers, employees, agents, affiliates harmless of any and all losses that may be suffered by Saathi, its Directors, officers, employees, agents, affiliates by virtue of such false declaration having been made by said person.</li>
                <li>Saathi shall not be held responsible for any content contributed by Users on the Saathi Platform.</li>
              </ol>
            </li>
            <li>
              <strong>Eligibility</strong>
              <ol className="list-[lower-alpha] pl-4">
                <li>The Saathi Platform is open only to persons above the age of 18 years.</li>
                <li>The Saathi Platform is open only to persons, currently residing in India.</li>
                <li>Persons who wish to register must have a valid email address and/or mobile phone number.</li>
                <li>Saathi may on receipt of information bar a person from accessing their Saathi account if such person is found to be in violation of any part of these Terms of Service or the Code of Conduct.</li>
                <li>Only those Users who have successfully registered on the Saathi Platform shall be eligible to post, view, and/or apply for jobs via the Saathi Platform.</li>
              </ol>
            </li>
            <li>
              <strong>Dispute and Dispute Resolution</strong>
              <ol className="list-[lower-alpha] pl-4">
                <li>If any dispute arising out of, or in connection with, the Saathi Services provided by Saathi via the Saathi Platform, the construction, validity, interpretation and enforceability of these Terms of Service, or the rights and obligations of the User(s) or Saathi, as well as the exclusive jurisdiction to grant interim or preliminary relief in case of any dispute referred to arbitration as given below arises between the User(s) and Saathi ("Dispute"), the disputing parties hereto shall endeavour to settle such Dispute amicably. The attempt to bring about an amicable settlement shall be considered to have failed if not resolved within 30 (thirty) days from the date of communicating the Dispute in writing.</li>
                <li>If the parties are unable to amicably settle the Dispute as mentioned above, any party to the Dispute shall be entitled to serve a notice invoking Arbitration. The Dispute shall be referred to and finally resolved by arbitration. The Arbitration shall be conducted by an Arbitral Tribunal consisting of a sole arbitrator in accordance with the Rules of the Delhi International Arbitration Centre ("DIAC Rules"), which rules are deemed to be incorporated by reference in this clause. The seat of the arbitration shall be New Delhi. The Tribunal shall consist of one arbitrator mutually elected by the parties. The language of the arbitration shall be English. The law governing the arbitration shall be Indian Law.</li>
                <li>Nothing shall preclude any party from seeking interim or permanent, equitable or injunctive relief, or both, from the competent courts at New Delhi, having jurisdiction to grant relief on any Disputes. The pursuit of equitable or injunctive relief shall not be a waiver of the duty of the Parties to pursue any remedy (including for monetary damages) through the arbitration described herein.</li>
              </ol>
            </li>
            <li>
              <strong>Release and Limitations of Liability</strong>
              <ol className="list-[lower-alpha] pl-4">
                <li>Users shall access the Saathi Services provided via the Saathi Platform voluntarily and at their own risk. Saathi shall, under no circumstances be held responsible or liable on account of any loss or damage sustained by Users or any other person or entity during the course of access to the Saathi Platform. Additionally, while engaging in the Saathi Referral Program, the Users are responsible for such participation and Saathi shall under no circumstances be liable for any acts of fraud, misrepresentation, negligence, misconduct or gross negligence on account of any third parties.</li>
                <li>By accessing the Saathi Platform and Services provided therein, Users hereby release from and agree to indemnify Saathi, and/or any of its directors, employees, partners, associates and licensors, from and against all liability, cost, loss or expense arising out of their access of the Saathi Platform and the Saathi Services (which includes Saathi bhAI) including (but not limited to) personal injury and damage to property and whether direct, indirect, consequential, foreseeable, due to some negligent act or omission on their part, or otherwise.</li>
                <li>Saathi accepts no liability, whether jointly or severally, for any errors or omissions, whether on behalf of itself or third parties in relation to the data/information collated and published on the Saathi Platform.</li>
                <li>Users shall be solely responsible for any consequences which may arise due to their access of Saathi Platform and Services by conducting an illegal act or due to non-conformity with these Terms of Service and other rules and regulations in relation to Saathi Services, including provision of incorrect personal details. Users also undertake to indemnify Saathi and their respective officers, directors, employees and agents on the happening of such an event (including without limitation cost of attorney, legal charges etc.) on full indemnity basis for any loss/damage suffered by Saathi on account of such act on the part of the Users.</li>
                <li>Users shall indemnify, defend, and hold Saathi harmless from any third party/entity/organization claims arising from or related to such User's engagement with the Saathi Platform. In no event shall Saathi be liable to any User for acts or omissions arising out of or related to User's engagement with the Saathi Platform.</li>
                <li>In consideration of Saathi allowing Users to access the Saathi Platform, to the maximum extent permitted by law, the Users waive and release each and every right or claim, all actions, causes of actions (present or future) each of them has or may have against Saathi, its affiliates, respective agents, directors, officers, business associates, group companies, sponsors, employees, or representatives for all and any injuries, losses, damages (whether actual, consequential or anticipated), accidents, or mishaps (whether known or unknown) or (whether anticipated or unanticipated) arising out of the provision of Saathi Platform and Services.</li>
                <li>Under no circumstances whatsoever shall Saathi's liability, if any, to a User or to any third party who might make a claim against Saathi for or on behalf of a User exceed the total Platform/Service Fees paid by such User in the twelve (12) months preceding the occurrence of the circumstances which gave rise to the claim being made against Saathi by such User or third party acting for or on behalf of such User.</li>
              </ol>
            </li>
            <li>
              <strong>Disclaimers</strong>
              <ol className="list-[lower-alpha] pl-4">
                <li>To the extent permitted under law, neither Saathi nor its parent/holding company, subsidiaries, affiliates, directors, officers, professional advisors, employees shall be responsible for the deletion, the failure to store, the mis-delivery, or the untimely delivery of any information or material.</li>
                <li>To the extent permitted under law, Saathi shall not be responsible for any harm resulting from downloading or accessing any information or material, the quality of servers, products, Saathi Services or sites.</li>
                <li>Any material accessed, downloaded or otherwise obtained through the Saathi Platform is done at the User's discretion, competence, acceptance and risk, and the User will be solely responsible for any potential damage to User's computer system, mobile device or loss of data that results from a User's download of any such material.</li>
                <li>Saathi shall make best endeavours to ensure that Saathi Platform is error-free and secure, however, neither Saathi nor any of its partners, licensors or associates makes any warranty that:
                  <ol className="list-[lower-roman] pl-4">
                    <li>the Saathi Platform will meet Users' requirements,</li>
                    <li>Saathi Platform will be uninterrupted, timely, secure, or error free</li>
                    <li>the results that may be obtained from the use of Saathi Platform will be accurate or reliable; and</li>
                    <li>the quality of any products, Saathi Services, information, or other material that Users purchase or obtain through the Saathi Platform will meet Users' expectations.</li>
                  </ol>
                </li>
                <li>In case Saathi discovers any error or otherwise, Saathi reserves the right (exercisable at its sole discretion) to rectify the error in such manner as it deems fit, including through a set-off of the erroneous payment from amounts due to the User or deduction from the User's account of the amount of erroneous payment. In case of exercise of remedies in accordance with this clause, Saathi may use reasonable methods in order to notify the User of the error and of the exercise of the remedy(ies) to rectify the same.</li>
                <li>To the extent permitted under law, neither Saathi nor its partners, licensors or associates shall be liable for any direct, indirect, incidental, special, or consequential damages arising out of the use of or inability to use Saathi's sites, even if Saathi has been advised of the possibility of such damages.</li>
                <li>Any Saathi Services being hosted or provided, or intended to be hosted on the Saathi Platform and requiring specific permission or authority from any statutory authority or any state or the central government, or the board of directors shall be deemed cancelled or terminated, if such permission or authority is either not obtained or denied either before or after the availability of the relevant Saathi Services are hosted or provided.</li>
                <li>To the extent permitted under law, in the event of suspension or closure of any Saathi Services, Users shall not be entitled to make any demands, claims, of any nature whatsoever.</li>
                <li>The user understands and agrees that the Saathi Content and all other information, data, or other material downloaded or otherwise obtained through or from the Platform or Certificate is obtained at the user's own discretion and risk, and that the user will be solely responsible for any damage to the user, the user's mobile phone, electronic device or any loss of data that results from the download of such material or data.</li>
                <li>Under no circumstances will Saathi be liable in any way for use of any Saathi Content or any other information, data, or other material downloaded or otherwise obtained through or from the Platform, or Certificates including any errors or omissions, or any loss or damage or defamation of any kind incurred as a result of your use of or reliance on such information or data. No advice or information, whether oral or written, obtained by the user from Saathi or through or from the services, shall create any warranty by Saathi.</li>
                <li>In the event you find any information provided on the Platform, advertisement, or, Certificate is incorrect or obscene, or if you are the owner of any information or content and wish that such information or content is not displayed on the Platform or Programs, kindly notify us at the address provided at the bottom of the page.</li>
                <li>All content on the application is for informational purposes only. All advertisements, referral programs, testimonials, reviews, and success stories, including but not limited to claims regarding salary hikes, promotions, job placements, or career advancements, appearing on the Platform are individual experiences shared by users of our products and/or services. Results may vary based on multiple factors, including but not limited to individual effort, market conditions, employer policies, and economic factors. We do not claim that such outcomes are typical or assured for all consumers. The testimonials and endorsements presented are applicable only to the individuals sharing them and do not necessarily represent the experiences of all users of our products and/or services.</li>
                <li>All promotional content, including advertisements, complies with the Advertising Standards Council of India (ASCI) Code and relevant Indian consumer protection laws. Any claims made in advertisements are based on available data at the time of publication and should not be construed as a promise or guarantee of specific results. We encourage prospective users to exercise discretion and conduct independent research before making any decisions based on advertisements, testimonials, or reviews featured on our Platform.</li>
                <li>There might be trademarks, logos and brand names of other companies including EPs featured or referred on the website ("Third Party IP"). Use of these names, trademarks and brands or Third Party IP does not imply endorsement. These are the property of their respective trademark holders.</li>
                <li>You may not use any of these Third Party IP, or any variations thereof, without the owner's prior written consent, for promotional purposes, or in any way that deliberately or inadvertently claims, suggests, or, in the owner's sole judgment, gives the appearance or impression of a relationship with or endorsement by the owner, and nothing contained on the Platform should be construed as granting, by implication, estoppel, or otherwise, any license or right to use any Third Party IP displayed on the Platform without the written permission of the owner of the applicable Third Party IP.</li>
              </ol>
            </li>
            <li>
              <strong>Lucky Draw</strong>
              <ol className="list-[lower-alpha] pl-4">
                <li>Participation in the lucky draw is open to eligible users who meet the specified criteria. By entering, participants consent to the use of their name and likeness for promotional purposes. We reserve the right to cancel or modify the draw if necessary. For full details, please refer to our Lucky Draw Policy.</li>
              </ol>
            </li>
            <li>
              <strong>Grievance Redressal Mechanism</strong>
              <ol className="list-[lower-alpha] pl-4">
                <li>In case a User has any complaints or grievances pertaining to (i) any Content that a User believes violates these Terms (other than an infringement of Intellectual Property Rights), (ii) Users' access to the Saathi Platform, (iii) any Content which a User believes is, prima facie, in the nature of any material which is obscene, defamatory towards the complainant or any person on whose behalf such User is making the complaint, or is in the nature of impersonation in an electronic form, including artificially morphed images of such individual. Please share the same with us by writing to: <a href="mailto:grievance@saathi.in" className="text-blue-600 underline">grievance@saathi.in</a>.</li>
                <li>In the complaint or grievance, the User shall include the following information:
                  <ol className="list-[lower-roman] pl-4">
                    <li>Name and contact details: name, address, contact number and email address;</li>
                    <li>Relation to the subject matter of the complaint, i.e., complainant or person acting on behalf of an affected person;</li>
                    <li>The name and age of the person aggrieved or affected by the subject matter of the complaint, in case the User is acting on behalf of such person and a statement that the User is authorized to act on behalf of such person and to provide such person's personal information to Saathi in relation to the complaint/grievance;</li>
                    <li>Description of the complaint or grievance with clear identification of the Content in relation to which such complaint or grievance is made;</li>
                    <li>A statement that the User believes, in good faith, that the Content violates these Terms and Conditions;</li>
                    <li>A statement that the information provided in the complaint or grievance is accurate.</li>
                  </ol>
                </li>
                <li>Saathi respects the Intellectual Property Rights of others. All names, logos, marks, labels, trademarks, copyrights or intellectual and proprietary rights on the Saathi Platform belonging to any person (including Users), entity, or third party are recognized as proprietary to the respective owners. Users are requested to send Saathi a written notice/intimation if Users notice any act of infringement on the Saathi Platform, which must include the following information:
                  <ol className="list-[lower-roman] pl-4">
                    <li>A clear identification of the copyrighted work allegedly infringed;</li>
                    <li>A clear identification of the allegedly infringing material on the Saathi Platform;</li>
                    <li>Contact details: name, address, e-mail address, and phone number;</li>
                    <li>A statement that the User believes, in good faith, that the use of the copyrighted material allegedly infringed on the Saathi Platform is not authorized by the User's agent or the law;</li>
                    <li>A statement that the information provided in the notice is accurate and that the signatory is authorized to act on behalf of the owner of an exclusive copyright right that is allegedly infringed;</li>
                    <li>User's signature or a signature of the User's authorized agent.</li>
                  </ol>
                </li>
                <li>The aforesaid notices can be sent to the Company by email at: <a href="mailto:legal@saathi.in" className="text-blue-600 underline">legal@saathi.in</a></li>
                <li>On receiving such complaint, grievance, or notice, Saathi reserves the right to investigate and/or take such action as Saathi may deem appropriate. Saathi may reach out to the User to seek further clarification or assistance with the investigation, or verify the statements made in the complaint, grievance, or notice, and the User acknowledges that timely assistance with the investigation would facilitate the redressal of the same.</li>
                <li>If at any time a User wishes to delete the data in their account on the Saathi Platform or delete their account from the Saathi Platform in its entirety they can do so by accessing the following links:
                  <ul className="list-disc pl-4">
                    <li>Delete data: <a href="https://webapp.saathi.in/customer/delete-data" target="_blank" className="text-blue-600 underline">https://webapp.saathi.in/customer/delete-data</a></li>
                    <li>Delete account: <a href="https://webapp.saathi.in/customer/customer-delete" target="_blank" className="text-blue-600 underline">https://webapp.saathi.in/customer/customer-delete</a></li>
                  </ul>
                </li>
                <li>The name and title of the Grievance Redressal Officer is as follows:
                  <ul className="list-disc pl-4">
                    <li>Name: Hemant Sharma</li>
                    <li>Email: <a href="mailto:hemant.sharma@saathi.in" className="text-blue-600 underline">hemant.sharma@saathi.in</a></li>
                    <li>Address: 5th Floor, Tower – A, Millennium Plaza, 503, Sector – 27, Gurugram – 122009, Haryana, India</li>
                  </ul>
                </li>
                <li>The Grievance Officer identified above pursuant to the provisions of applicable laws including but not limited to the Information Technology Act, 2000 and the Consumer Protection Act, 2019, and the Rules enacted under those laws. The Company reserves the right to replace the Grievance Redressal Officer at its discretion through publication of the name and title of such replacement on the website, which replacement shall come into effect immediately upon publication.</li>
              </ol>
            </li>
          </ol>
        </div>
      </main>
    </div>
  </div>
);

export default TermsModal;
