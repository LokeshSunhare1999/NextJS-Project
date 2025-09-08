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
      <main className='text-black'>
        <h1 className="text-3xl font-bold mb-4 text-center">Terms and Conditions</h1>
        <div className="prose max-w-none text-sm text-justify">
          <p>Effective Date: 23-July-2025</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">1. Introduction:</h2>
          <ol className="list-[lower-alpha] pl-6 space-y-2">
            <li>
              These Terms and Conditions ("Terms") constitute a legally binding
              agreement entered into by and between you, the Employer, User,
              company, business, or other legal entity accessing or using the Saathi
              Employer Platform ("You", "Your", or "Employer"), and Saathi WorldApp
              Pvt. Ltd. ("Saathi"), a company incorporated and existing under the
              Companies Act, 2013, having its registered office at 5th floor, Tower
              A, Millennium Plaza, Sector-27, Gurugram, Haryana - 122009 India ,
              hereinafter referred to as "Saathi", "We", "Us", or "Our".
            </li>
            <li>
              These Terms govern Your access to and use of the Saathi Employer
              Platform (the "Platform") and all associated services made available
              by Us. By accessing, browsing, registering, or otherwise using the
              Platform, You signify Your unequivocal and irrevocable acceptance of
              these Terms and Our Privacy Policy. If You do not agree with any of
              the provisions herein, You must refrain from using the Platform.
            </li>
          </ol>

          <h2 className="text-xl font-semibold mt-6 mb-2">2. Definitions:</h2>
          <ol className="list-[lower-alpha] pl-6 space-y-2">
            <li>
              <strong> "Account"</strong> means the registered profile used by the
              Employer to access and manage services on the Platform.
            </li>
            <li>
              <strong>"Candidate"</strong> means a / User seeking employment through
              jobs posted on the Platform.
            </li>
            <li>
              <strong>"Employer"</strong> refers to the individual or entity using
              the Platform to post jobs and interact with job seekers.
            </li>
            <li>
              <strong>"Platform"</strong> means the Saathi Employer Platform and all
              related services, applications, and systems.
            </li>
            <li>
              <strong>"User"</strong> refers to the individual or entity using the
              Platform to seek jobs.
            </li>
          </ol>

          <h2 className="text-xl font-semibold mt-6 mb-2">3. Eligibility:</h2>
          <ol className="list-[lower-alpha] pl-6 space-y-2">
            <li>
              By registering on the Platform, You represent and warrant that You are
              competent to enter into a valid contract under the Indian Contract
              Act, 1872, and are authorised by the organisation or entity You
              represent to create an account and engage in recruitment-related
              activities.
            </li>
            <li>
              You agree to provide true, accurate, current, and complete information
              during the registration process, including verification via One-Time
              Password (OTP) sent to a valid Indian mobile number. You shall
              maintain the confidentiality of Your login credentials and shall be
              solely responsible for any use or misuse of Your account.
            </li>
            <li>
              Saathi may on receipt of information bar a person from accessing their
              Saathi account if such person is found to be in violation of any part
              of these Terms of Service or the 
              <a href="https://terms.saathi.in/code-of-conduct.html" className='text-[#3b82f6] underline'> Code of Conduct</a>.
            </li>
            <li>
              We reserve the absolute right to deny, suspend, or terminate Your
              access to the Platform without notice if the information provided is
              false, misleading, incomplete, or in violation of applicable laws or
              these Terms.
            </li>
          </ol>

          <h2 className="text-xl font-semibold mt-6 mb-2">4. Use Of Platform And Employer Obligations:</h2>
          <ol className="list-[lower-alpha] pl-6 space-y-2">
            <li>
              Subject to these Terms, the Platform is made available to Employers
              solely for the purpose of facilitating lawful recruitment and talent
              acquisition activities. In particular, the Platform enables Employers
              to:
            </li>
            <li>
              Create, publish, and manage job listings for open positions within
              their organization;
            </li>
            <li>
              Receive, organize, and process applications submitted by candidates
              through the Platform, including but not limited to assigning
              recruitment statuses such as "Shortlisted," "AI Interview," "Final
              Stage," or any other status as may be supported by the Platform from
              time to time;
            </li>
            <li>
              Access and view candidate profiles and contact information to the
              extent such access is permitted by the features of the Platform and
              subject to any applicable data privacy controls or candidate consent
              mechanisms;
            </li>
            <li>
              Initiate and conduct communication with candidates through the
              Platform, where such functionality is provided, and always in
              compliance with applicable data protection laws, communication
              regulations, and any relevant consent obtained from the candidates.
            </li>
            <li>
              Undertake and agree to use the Platform in full compliance with all
              applicable laws, rules, and regulations of India, including but not
              limited to, The Equal Remuneration Act, 1976, The Rights of Persons
              with Disabilities Act, 2016, and any other labour,
              anti-discrimination, employment, data protection, or information
              technology laws that may be applicable.
            </li>
            <li>
              Without prejudice to the generality of the foregoing, you expressly
              agree and undertake that you shall not, directly or indirectly:
            </li>
            <li>
              Post any job listing or employment opportunity that is false,
              misleading, fraudulent, discriminatory, defamatory, or otherwise
              unlawful, including listings that discriminate based on gender,
              religion, caste, disability, or any other protected category under
              applicable law;
            </li>
            <li>
              Solicit or require any form of payment, service, or work (including
              but not limited to unpaid internships or training) from candidates as
              a condition of applying to or securing a job, or require candidates to
              sign bonds or agreements that are in contravention of Indian labour
              laws;
            </li>
            <li>
              Access, use, store, or process candidate information, including
              contact details, résumés, or personal data, for any purpose other
              than lawful recruitment activities, or in any manner that violates
              applicable data protection laws or breaches the privacy expectations
              of the candidate;
            </li>
            <li>
              Attempt to reverse engineer, decompile, disassemble, tamper with,
              bypass, or otherwise interfere with the source code, software, data
              structures, or security mechanisms of the Platform;
            </li>
            <li>
              Engage in any activity that constitutes spam, phishing, unauthorized
              marketing, or any other deceptive or abusive practice that may
              compromise the integrity, performance, or reputation of the Platform
              or its operator;
            </li>
            <li>
              Use the Platform in any manner that could damage, disable,
              overburden, impair, or compromise the security or functionality of the
              Platform, or interfere with other Employer/ Users' access to or use of
              the Platform.
            </li>
          </ol>

          <h2 className="text-xl font-semibold mt-6 mb-2">5. Grant of Consent</h2>
          <p>By signing up to the Platform, You, herby, expressly consent to:</p>
          <ol className="list-[lower-alpha] pl-6 space-y-2">
            <li>
              receive communications, including but not limited to telephone
              calls, text messages (SMS), WhatsApp messages, and other forms of
              electronic communication, for the purposes of promotional offers,
              transactional updates, and payment-related information, from Saathi
              and its authorized representatives, agents, or service providers, at
              the contact details provided by You.
            </li>
            <li>
              granting Saathi a non-exclusive, royalty- free, worldwide
              irrevocable license to use Your name, logo, trademarks, and brand
              identifiers in Saathi's promotional, marketing, advertising, and
              public relations materials, including but not limited to websites,
              brochures, social media platform, presentations, etc, solely for the
              purpose of identifying You as a user or partner of Our product and
              services.
            </li>
          </ol>

          <h2 className="text-xl font-semibold mt-6 mb-2">6. Intellectual Property</h2>
          <p>
            All Intellectual Property ("IP") rights, including but not limited to
            copyrights, trademarks, patents, trade secrets, and proprietary rights,
            arising from or related to the Platform and its associated features,
            functionalities, content, software, and databases (collectively referred
            to as "Platform IP"), shall remain solely and exclusively owned by
            Saathi, with no rights granted to Employers, Users, or third parties
            except as expressly provided under these Terms and Conditions. Saathi
            grants Employers and authorized Users a non-exclusive, non-transferable,
            revocable license to access and use the employer Platform solely for
            purposes such as posting jobs, viewing job applications, managing
            candidate stages, and other permitted activities under these Terms and
            Conditions, without conveying any ownership or proprietary interest in
            the Platform IP. By posting jobs, job applications, or any other content
            ("Employer/ User Content") on the Platform, employers represent and
            warrant that they possess all necessary rights and permissions for such
            Employer/ User Content, and they agree that Saathi may use, reproduce,
            modify, adapt, publish, and distribute the Employer/ User Content for
            purposes related to the operation and improvement of the Platform, in
            compliance with applicable privacy laws. Employers and Employer/ Users
            are prohibited from copying, reproducing, distributing, modifying,
            reverse engineering, decompiling, or disassembling any portion of the
            Platform IP or using it for purposes beyond the scope of these Terms and
            Conditions. The Platform may also contain elements, software, or content
            owned by third parties ("Third-Party IP"), which remain the property of
            their respective owners, and Employer/ Users are required to comply with
            all restrictions related to such Third-Party Intellectual Property.
            Saathi reserves the right to enforce its intellectual property rights to
            the fullest extent permissible by law, including pursuing legal remedies
            in the event of unauthorized use, with this clause surviving the
            termination or expiration of this Agreement.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">7. Indemnity</h2>
          <p>
            Employers and Employer/ Users of the Platform agree to indemnify,
            defend, and hold harmless Saathi, its affiliates, officers, directors,
            employees, agents, licensors, and service providers from and against any
            and all claims, liabilities, damages, losses, costs, or expenses,
            including reasonable attorneys' fees, arising out of or related to: (i)
            any breach or alleged breach of these Terms and Conditions by the
            employer or Employer/ User; (ii) the posting, submission, or
            transmission of any content or information by the Employer/ User through
            the Platform, including but not limited to claims of infringement or
            violation of intellectual property rights, privacy rights, or other
            rights of any third party; (iii) any misuse or unauthorized use of the
            Platform by the Employer/ User, or their representatives; (iv) the
            Employer/ User's failure to comply with applicable laws, rules, or
            regulations in connection with their use of the Platform; or (v) any
            disputes or claims arising between the Employer/ User and a third party
            in connection with their activities on or through the Platform. Saathi
            reserves the right to assume the exclusive defense and control of any
            matter subject to indemnification under this clause, and Employer/ Users
            agree to cooperate with Saathi's defense of such claims.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">8. Limitation of Liability:</h2>
          <p>
            To the fullest extent permitted under applicable law, Saathi and its
            affiliates, officers, directors, employees, agents, licensors, and
            service providers shall not be liable for any direct, indirect,
            incidental, consequential, special, punitive, or exemplary damages,
            including but not limited to damages for loss of profits, revenue, data,
            business opportunities, goodwill, or other intangible losses, arising
            out of or related to the employer or Employer/ User's access to or use
            of the Platform, inability to access or use the portal, or reliance on
            any content or information provided through the portal, even if Saathi
            has been advised of the possibility of such damages. Saathi shall not be
            responsible for any third-party actions, content, or services, including
            communications or transactions between employers and job seekers outside
            the portal. Employers and Employer/ Users acknowledge and agree that
            their sole and exclusive remedy for any dissatisfaction with the portal
            is to discontinue its use. Under no circumstances shall Saathi's total
            liability exceed the amount, if any, paid by the employer or Employer/
            User to Saathi for access to the portal during the twelve months
            preceding the claim.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">9. Privacy and Data Protection:</h2>
          <p>
            Saathi is committed to safeguarding the privacy and protection of all
            personal data collected, processed, and stored through its employer
            portal, in compliance with applicable Indian laws, including but not
            limited to the Digital Personal Data Protection Act, 2023 (DPDPA). By
            accessing or using the employer portal, employers and Employer/ Users
            consent to the collection, use, storage, and processing of their
            personal data as outlined in Saathi's Privacy Policy. Saathi shall
            ensure that all personal data is processed lawfully, fairly, and
            transparently for legitimate purposes directly related to the operation
            and improvement of the employer portal. Saathi shall collect only the
            personal data necessary for these purposes and retain it for no longer
            than required, in compliance with applicable retention policies.
          </p>
          <p>
            Employers and Employer/ Users acknowledge that personal data shared
            through the portal, including candidate information, job postings, and
            communications, shall be handled in accordance with data protection
            principles, including purpose limitation, data minimization, and
            confidentiality. Saathi employs appropriate technical and organizational
            measures to secure personal data against unauthorized access,
            alteration, disclosure, or destruction. In the event of a personal data
            breach, Saathi shall notify affected individuals and relevant
            authorities as mandated under applicable laws.
          </p>
          <p>
            Employers and Employer/ Users further agree to act as independent data
            controllers with respect to any personal data they collect or process
            outside the portal, and they shall ensure compliance with applicable
            data protection obligations, including obtaining necessary consents from
            data subjects. Saathi shall not be liable for any misuse or unauthorized
            processing of personal data by employers or Employer/ Users outside the
            portal.
          </p>
          <p>
            Employers and Employer/ Users have the right to access, rectify, and
            erase their personal data, as well as other rights granted under the
            DPDPA. Saathi may process personal data with the explicit consent of
            data subjects or as otherwise permitted by applicable law. Any queries
            or requests regarding personal data should be directed to Saathi's Data
            Protection Officer (DPO) at 
            <a href="mailto:sravan.s@saathi.in" className='text-[#3b82f6] underline'> sravan.s@saathi.in</a>. This clause
            shall survive the termination or expiration of this agreement and shall
            be read in conjunction with Saathi's Privacy Policy.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">10. Disclaimers:</h2>
          <p>
            The employer portal provided by Saathi is offered on an "as-is" and
            "as-available" basis without any warranties, express or implied,
            including but not limited to warranties of merchantability, fitness for
            a particular purpose, non-infringement, or the accuracy, reliability, or
            completeness of any content or information provided through the portal.
            Saathi does not warrant that the portal will be uninterrupted,
            error-free, secure, or free from viruses or other harmful components.
            Employers and Employer/ Users acknowledge that their use of the portal
            is at their own risk, and Saathi shall not be held responsible for any
            technical issues, data loss, or disruptions resulting from their access
            or use of the portal. Saathi disclaims any liability for third-party
            content, communications, or transactions facilitated through or outside
            the portal, including interactions between Employers and job seekers.
            Saathi reserves the right to modify, suspend, or discontinue any
            features or functionalities of the portal at any time without prior
            notice. Employers and Employer/ Users agree that Saathi's disclaimers
            are a fundamental condition of their use of the portal and accept that
            Saathi shall not be liable for any reliance on or use of the portal
            beyond the scope permitted under these Terms and Conditions.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">11. Governing Law and Jurisdiction:</h2>
          <p>
            This Agreement and any dispute or claim arising out of or in connection
            with it or its subject matter or formation (including non-contractual
            disputes or claims) shall be governed by, and construed in accordance
            with, the laws of Republic of India. The parties irrevocably agree that
            the courts of Gurugram, Haryana shall have exclusive jurisdiction to
            settle any dispute or claim arising out of or in connection with this
            Agreement or its subject matter or formation (including non-contractual
            disputes or claims).
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">12. Grievance Redressal Mechanism:</h2>
          <ol className="list-[lower-alpha] pl-6 space-y-4">
            <li>
              In case any Employer/ User has any complaints or grievances pertaining to 
              <ol className="list-[lower-roman] pl-6 mt-2 space-y-2">
                <li>
                  any Content that a Employer/ User believes violates these Terms
                  (other than an infringement of Intellectual Property Rights)
                </li>
                <li>Employer/ Users' access to the Saathi Platform</li>
                <li>
                  any Content which a Employer/ User believes is, prima facie, in
                  the nature of any material which is obscene, defamatory towards
                  the complainant or any person on whose behalf such Employer/ User
                  is making the complaint, or is in the nature of impersonation in
                  an electronic form, including artificially morphed images of such
                  individual.
                </li>
              </ol>
              Please share the same with us by writing to:
              <a href="mailto:grievance@saathi.in" className='text-[#3b82f6] underline'> grievance@saathi.in</a>.
            </li>
            <li>
              In the complaint or grievance, the Employer/ User shall include the
              following information:
              <ol className="list-[lower-roman] pl-6 mt-2 space-y-2">
                <li>
                  Name and contact details: name, address, contact number and email
                  address;
                </li>
                <li>
                  Relation to the subject matter of the complaint, i.e., complainant
                  or person acting on behalf of an affected person;
                </li>
                <li>
                  The name and age of the person aggrieved or affected by the subject
                  matter of the complaint, in case the Employer/ User is acting on
                  behalf of such person and a statement that the Employer/ User is
                  authorized to act on behalf of such person and to provide such
                  person's personal information to Saathi in relation to the
                  complaint/grievance;
                </li>
                <li>
                  Description of the complaint or grievance with clear identification
                  of the Content in relation to which such complaint or grievance is
                  made;
                </li>
                <li>
                  A statement that the Employer/ User believes, in good faith, that
                  the Content violates these Terms and Conditions;
                </li>
                <li>
                  A statement that the information provided in the complaint or
                  grievance is accurate.
                </li>
              </ol>
            </li>
            <li>
              Saathi respects the Intellectual Property Rights of others. All names, logos, marks,
              labels, trademarks, copyrights or intellectual and proprietary rights on the Saathi
              Platform belonging to any person (including Employer/ Users), entity, or third party
              are recognized as proprietary to the respective owners. Employer/ Users are
              requested to send Saathi a written notice/intimation if Employer/ Users notice any
              act of infringement on the Saathi Platform, which must include the following
              information:
              <ol className="list-[lower-roman] pl-6 mt-2 space-y-2">
                <li>A clear identification of the copyrighted work allegedly infringed;</li>
                <li>A clear identification of the allegedly infringing material on the Saathi Platform;</li>
                <li>Contact details: name, address, e-mail address, and phone number;</li>
                <li>
                  A statement that the Employer/User believes, in good faith, that the use of
                  the copyrighted material allegedly infringed on the Saathi Platform is not
                  authorized by the Employer/User's agent or the law;
                </li>
                <li>
                  A statement that the information provided in the notice is accurate and that
                  the signatory is authorized to act on behalf of the owner of an exclusive
                  copyright right that is allegedly infringed;
                </li>
                <li>Employer/User's signature or a signature of the Employer/User's authorized agent.</li>
                <li> The aforesaid notices can be sent to the Company by email at:
                   <a href="mailto:legal@saathi.in" className='text-[#3b82f6] underline'> legal@saathi.in</a></li>
              </ol>
            </li>
            <li>On receiving such complaint, grievance, or notice, Saathi reserves the right to
              investigate and/or take such action as Saathi may deem appropriate. Saathi may reach
              out to the Employer/ User to seek further clarification or assistance with the
              investigation, or verify the statements made in the complaint, grievance, or notice,
              and the Employer/ User acknowledges that timely assistance with the investigation
              would facilitate the redressal of the same.</li>
            <li>If at any time a Employer/ User wishes to delete the data in their account on the
              Saathi Platform or delete their account from the Saathi Platform in its entirety they
              can do so by accessing the following links-
              <ol className="list-[lower-roman] pl-6 mt-2 space-y-2">
                <li>Delete data: <a href="https://webapp.saathi.in/customer/delete-data" className='text-[#3b82f6] underline'>https://webapp.saathi.in/customer/delete-data</a></li>
                <li>Delete account: <a href="https://webapp.saathi.in/customer/customer-delete" className='text-[#3b82f6] underline'>https://webapp.saathi.in/customer/customer-delete</a> </li>
              </ol>
            </li>
            <li>The name and title of the Grievance Redressal Officer is as follows:
              <ol className="list-[lower-roman] pl-6 mt-2 space-y-2">
                <li>Name: Hemant Sharma</li>
                <li>Email: <a href="mailto:hemant.sharma@saathi.in" className='text-[#3b82f6] underline'>hemant.sharma@saathi.in</a></li>
                <li>Address: 5th Floor, Tower – A, Millennium Plaza, 503, Sector – 27, Gurugram –
                  122009, Haryana, India</li>
              </ol>
            </li>
            <li>The Grievance Officer identified above pursuant to the provisions of applicable laws
              including but not limited to the Information Technology Act, 2000 and the Consumer
              Protection Act, 2019, and the Rules enacted under those laws. The Company reserves
              the right to replace the Grievance Redressal Officer at its discretion through
              publication of the name and title of such replacement on the website, which
              replacement shall come into effect immediately upon publication.</li>
          </ol>
          
          <h2 className="text-xl font-semibold mt-6 mb-2">13. Amendments and Changes</h2>
          <p>
            We reserve the right, at our sole discretion, to modify, amend, or
            update these Terms and Conditions at any time. Any such modifications,
            amendments, or updates shall become effective immediately upon posting
            on the Platform or as otherwise communicated to you.
          </p>
          <p>
            Your continued use of the Platform after such changes constitute your
            acceptance of the revised Terms and Conditions. It is your
            responsibility to regularly review these Terms and Conditions to stay
            informed of any updates.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">14. Dispute Resolution Clause</h2>
          <p>
            If any dispute arising out of, or in connection with, the Saathi
            Services provided by Saathi via the Saathi Platform, the construction,
            validity, interpretation and enforceability of these Terms of Service,
            or the rights and obligations of the Employer/ User(s) or Saathi, as
            well as the exclusive jurisdiction to grant interim or preliminary
            relief in case of any dispute referred to arbitration as given below
            arises between the Employer/ User(s) and Saathi ("Dispute"), the
            disputing parties hereto shall endeavour to settle such Dispute
            amicably. The attempt to bring about an amicable settlement shall be
            considered to have failed if not resolved within 30 (thirty) days from
            the date of communicating the Dispute in writing.
          </p>
          <p>
            If the parties are unable to amicably settle the Dispute as mentioned
            above, any party to the Dispute shall be entitled to serve a notice
            invoking Arbitration. The Dispute shall be referred to and finally
            resolved by arbitration. The Arbitration shall be conducted by an
            Arbitral Tribunal consisting of a sole arbitrator in accordance with the
            Rules of the Delhi International Arbitration Centre ( "DIAC Rules"),
            which rules are deemed to be incorporated by reference in this clause.
            The seat of the arbitration shall be New Delhi. The Tribunal shall
            consist of one arbitrator mutually elected by the parties. The language
            of the arbitration shall be English. The law governing the arbitration
            shall be Indian Law.
          </p>
          <p>
            Nothing shall preclude any party from seeking interim or permanent,
            equitable or injunctive relief, or both, from the competent courts at
            New Delhi, having jurisdiction to grant relief on any Disputes. The
            pursuit of equitable or injunctive relief shall not be a waiver of the
            duty of the Parties to pursue any remedy (including for monetary
            damages) through the arbitration described herein.
          </p>
        </div>
      </main>
    </div>
  </div>
);

export default TermsModal;