import { AnalysisResult } from '../types/contract';

export const SAMPLE_CONTRACTS: Record<string, AnalysisResult> = {
  internship: {
    id: 'sample-internship',
    documentTitle: 'Engineering Internship Offer Letter',
    filename: 'Internship_Offer_Letter.pdf',
    contractType: 'Employment / Internship Agreement',
    jurisdiction: 'Employment / Internship Agreement • Indian Contract Act & Statutory Norms',
    safetyScore: 44,
    verdictLabel: 'High Risk — 2 Critical Clauses Flagged',
    summary:
      'This agreement contains severe unilateral termination clauses and an unlawful upfront security deposit forfeiture. Revisions to clauses 4, 7, and 9 are strongly advised before signing.',
    fullText: `APEX DIGITAL TECHNOLOGIES PVT. LTD.
INTERNSHIP OFFER LETTER & ENGAGEMENT AGREEMENT

Dated: November 10, 2026
Candidate Name: Rohan Sharma
Position: Software Engineering Intern
Location: Bengaluru, Karnataka, India

Dear Rohan,

We are pleased to offer you an internship position at Apex Digital Technologies Pvt. Ltd. ("Company"). Your internship shall commence on December 1, 2026. This letter outlines the terms and conditions governing your engagement.

1. Role and Responsibilities
The Intern agrees to devote full professional time, skill, and attention to assigned projects under the supervision of the Engineering Lead. The Intern shall adhere to all internal codes of conduct, data confidentiality protocols, and operational workflows established by the Company.

2. Term of Internship
The duration of this internship engagement shall be six (6) months, concluding on May 31, 2027, unless terminated earlier in accordance with the provisions outlined herein.

3. Stipend & Disbursement
A monthly stipend of ₹15,000 will be credited directly to the intern's verified bank account on or before the 5th day of every calendar month, subject to verified biometric attendance and satisfactory completion of assigned engineering tasks.

4. Termination
The company may terminate this agreement at any time, without cause, and without any payment of stipend or other compensation. The Intern shall have no right to dispute such immediate cessation of engagement.

5. Confidential Information
The Intern acknowledges that during the course of the internship, they may gain access to proprietary software code, system architectures, customer lists, and business strategies. Such information must remain confidential perpetually.

6. Intellectual Property
All software programs, scripts, documentation, and technical artifacts created by the Intern during the term of this engagement shall belong exclusively to the Company as work-for-hire from the instant of creation.

7. Non-Compete
You agree not to join any competing company for a period of 2 years after the end of this internship anywhere in India. This restriction applies to all software, technology, and IT consulting enterprises operating within the national territory.

8. Working Hours & Leave Policy
The Intern is expected to work Monday through Friday from 9:30 AM to 6:30 PM IST. Any casual leave must be requested at least 48 hours in advance and remains at the sole discretion of the reporting manager.

9. Security Deposit
A mandatory security deposit of ₹10,000 shall be deducted from the candidate prior to onboarding, non-refundable in the event of early disengagement or perceived underperformance.

10. Governing Law & Jurisdiction
This agreement shall be construed in accordance with the laws of India, and the courts of Bengaluru shall possess exclusive territorial jurisdiction over any disputes arising out of or in connection with this agreement.

IN WITNESS WHEREOF, the parties hereto have executed this Internship Agreement as of the date first above written.

For Apex Digital Technologies Pvt. Ltd.
Authorized Signatory

Accepted & Agreed:
Rohan Sharma`,
    clauses: [
      {
        id: 'c-int-1',
        clauseNumber: '4',
        category: 'Termination',
        riskLevel: 'high',
        oneLineSummary: 'Unilateral termination without notice, cause, or earned stipend payment.',
        exactQuote: 'The company may terminate this agreement at any time, without cause, and without any payment of stipend or other compensation.',
        whyRisky:
          'Under Indian Contract Act principles and fair labor standards, denying accrued compensation for work already performed is predatory and legally unenforceable. You could work for 25 days and be dismissed with ₹0.',
        financialLegalImpact:
          'Loss of up to 100% of accumulated monthly earnings (₹15,000) and zero notice security to find alternate employment.',
        recommendedRevision:
          'Either party may terminate this agreement with fourteen (14) days prior written notice. In the event of early termination, the Company shall disburse pro-rata stipend for all days worked up to the termination date.',
      },
      {
        id: 'c-int-2',
        clauseNumber: '7',
        category: 'Non-Compete',
        riskLevel: 'medium',
        oneLineSummary: '2-year nationwide post-internship non-compete restriction.',
        exactQuote: 'You agree not to join any competing company for a period of 2 years after the end of this internship anywhere in India.',
        whyRisky:
          'Section 27 of the Indian Contract Act, 1872 explicitly voids post-employment non-compete covenants. However, employers frequently use this language as an intimidation tactic to block career progression or demand settlements.',
        financialLegalImpact:
          'Potential threat of legal notices and severe hindrance in securing junior software developer roles across the Indian tech ecosystem.',
        recommendedRevision:
          'Delete post-employment restriction. Replace with: "During the internship term, the Intern shall not engage in concurrent employment with direct competitors. No post-internship employment restrictions shall apply."',
      },
      {
        id: 'c-int-3',
        clauseNumber: '9',
        category: 'Security Deposit',
        riskLevel: 'high',
        oneLineSummary: 'Unlawful ₹10,000 onboarding deposit subject to discretionary forfeiture.',
        exactQuote: 'A mandatory security deposit of ₹10,000 shall be deducted from the candidate prior to onboarding, non-refundable in the event of early disengagement or perceived underperformance.',
        whyRisky:
          'Demanding upfront monetary deposits or training bonds for employment or internships violates labor guidelines and constitutes an illegal clawback mechanism disguised as security.',
        financialLegalImpact:
          'Immediate out-of-pocket loss of ₹10,000 with arbitrary company discretion over what constitutes "perceived underperformance".',
        recommendedRevision:
          'Remove this clause entirely. Employment cannot be made contingent upon cash deposits or upfront security payments.',
      },
      {
        id: 'c-int-4',
        clauseNumber: '3',
        category: 'Stipend Disbursement',
        riskLevel: 'safe',
        oneLineSummary: 'Standard monthly stipend disbursement on or before the 5th of each month.',
        exactQuote: "A monthly stipend of ₹15,000 will be credited directly to the intern's verified bank account on or before the 5th day of every calendar month,",
        whyRisky:
          'This clause is standard, clear, and fair. The disbursement timeline adheres to standard industry payroll cycles.',
        financialLegalImpact:
          'Guaranteed monthly payout date with direct bank transfer verification.',
        recommendedRevision:
          'Standard clause — no amendment required.',
      },
    ],
    counterOfferEmail: {
      polite: `Dear Apex Digital Technologies HR Team,

Thank you very much for offering me the Software Engineering Intern position. I am enthusiastic about the opportunity to contribute to your engineering team.

Upon reviewing the formal offer letter, I would like to request three reasonable adjustments to ensure mutual clarity and fairness:

1. Clause 4 (Termination): Could we include a mutual 14-day notice period and clarify that pro-rata stipend will be paid for all days worked prior to termination?
2. Clause 7 (Non-Compete): In accordance with standard junior internship practices and Section 27 of the Indian Contract Act, I request removing the 2-year post-internship non-compete restriction.
3. Clause 9 (Security Deposit): I kindly request waiving the ₹10,000 upfront security deposit requirement, as upfront monetary bonds are not standard for internship roles.

Thank you very much for your understanding. Once these adjustments are reflected, I will be delighted to sign and return the agreement.

Warm regards,
Rohan Sharma`,
      firm: `Dear Apex Digital Technologies HR Team,

Thank you for the Software Engineering Intern offer. 

Before I can execute this agreement, the following predatory and non-standard terms must be amended:

1. Clause 4 (Termination): Must provide a 14-day mutual notice period with guaranteed pro-rata compensation for all days completed.
2. Clause 7 (Non-Compete): Post-employment restrictions are void under Section 27 of the Indian Contract Act, 1872 and must be stricken in full.
3. Clause 9 (Security Deposit): The ₹10,000 upfront deposit is unacceptable and must be removed entirely prior to onboarding.

Please issue a revised agreement reflecting these corrections so we may proceed.

Sincerely,
Rohan Sharma`,
    },
    analyzedAt: 'Just now',
    mode: 'sample',
  },

  rental: {
    id: 'sample-rental',
    documentTitle: 'Residential Lease Agreement',
    filename: 'Residential_Rental_Agreement.pdf',
    contractType: 'Residential Tenancy Lease',
    jurisdiction: 'Residential Tenancy Lease • Indian Rent & Tenancy Statutory Norms',
    safetyScore: 58,
    verdictLabel: 'Caution — 1 High Risk & 1 Caution Clause',
    summary:
      'The agreement imposes a 6-month lock-in period with total deposit forfeiture and unilateral 15% annual rent hikes. Clarification on notice rights and inspection protocols is required.',
    fullText: `RESIDENTIAL LEASE AND LICENSE AGREEMENT

This Agreement of Lease is made on this 1st day of November 2026, by and between:
Mr. Arvind Menon ("Landlord / Licensor"), residing at Indiranagar, Bengaluru,
AND
Ms. Priya Kulkarni ("Tenant / Licensee"), currently residing at Whitefield, Bengaluru.

WHEREAS the Landlord is the absolute lawful owner of Apartment 402, Green Meadows Heights, 100 Feet Road, Indiranagar, Bengaluru ("Premises").

NOW THIS AGREEMENT WITNESSETH AS FOLLOWS:

1. Term of Lease
The tenancy shall be for a period of eleven (11) months commencing from December 1, 2026 to October 31, 2027.

2. Monthly Rent & Maintenance
The Tenant shall pay a monthly rent of ₹38,000 (Rupees Thirty-Eight Thousand only), payable in advance on or before the 5th day of each calendar month. Society maintenance fees of ₹4,500 shall be paid directly by the Tenant to the Resident Welfare Association.

3. Lock-in Period & Forfeiture
The Tenant covenants to a mandatory lock-in period of 6 months. In the event of vacation prior to 6 months, the entire security deposit of ₹1,20,000 shall be unconditionally forfeited by the Landlord.

4. Notice Period
Post the lock-in period, either party may terminate this agreement by providing thirty (30) days prior written notice to the other party.

5. Rent Escalation & Property Inspection
The Landlord reserves the absolute right to escalate the monthly rent by 15% upon completion of 11 months, and may enter and inspect the premises at any hour without prior notice.

6. Utilities & Upkeep
The Tenant shall be responsible for all electricity, piped gas, and internet utility bills incurred during the tenancy period. Minor repairs up to ₹1,500 shall be borne by the Tenant.

7. Refund of Security Deposit
Upon peaceful handover of the vacant possession of the premises at the end of the tenancy, the Landlord shall refund the refundable security deposit of ₹1,20,000 within seven (7) banking days, subject to deduction of unpaid utility bills and verified painting charges.

IN WITNESS WHEREOF, the parties have signed and delivered this Agreement on the day, month, and year first written above.

Landlord: Arvind Menon
Tenant: Priya Kulkarni`,
    clauses: [
      {
        id: 'c-rent-1',
        clauseNumber: '3',
        category: 'Lock-in & Deposit Forfeiture',
        riskLevel: 'high',
        oneLineSummary: 'Mandatory 6-month lock-in with 100% security deposit forfeiture upon early exit.',
        exactQuote: 'The Tenant covenants to a mandatory lock-in period of 6 months. In the event of vacation prior to 6 months, the entire security deposit of ₹1,20,000 shall be unconditionally forfeited by the Landlord.',
        whyRisky:
          'Liquidated damages must reflect genuine pre-estimated losses. Forfeiting the entire ₹1,20,000 deposit for early departure—even if a replacement tenant is found immediately—is punitive and disproportionate.',
        financialLegalImpact:
          'Loss of ₹1,20,000 in personal liquidity if relocated due to emergency, job transfer, or medical exigency.',
        recommendedRevision:
          'In the event of vacation prior to 6 months, the Tenant shall pay rent until a replacement tenant is secured, capped at a maximum deduction of one (1) month rent (₹38,000) from the deposit.',
      },
      {
        id: 'c-rent-2',
        clauseNumber: '5',
        category: 'Escalation & Inspection',
        riskLevel: 'medium',
        oneLineSummary: 'Unilateral 15% annual rent hike and unannounced landlord entry rights.',
        exactQuote: 'The Landlord reserves the absolute right to escalate the monthly rent by 15% upon completion of 11 months, and may enter and inspect the premises at any hour without prior notice.',
        whyRisky:
          'A 15% hike exceeds prevailing Bengaluru market standards (5-8%). Furthermore, unannounced entry breaches the tenant’s fundamental right to quiet enjoyment and privacy.',
        financialLegalImpact:
          'Uncontrolled rent surges adding ₹5,700/month on renewal and invasive privacy violations.',
        recommendedRevision:
          'Rent renewal escalation shall be mutually agreed, not exceeding 7% per annum. Inspection of premises shall require at least twenty-four (24) hours prior written notice and occur during reasonable daytime hours (10 AM to 6 PM).',
      },
      {
        id: 'c-rent-3',
        clauseNumber: '4',
        category: 'Notice Period',
        riskLevel: 'safe',
        oneLineSummary: 'Mutual 30-day notice period following lock-in duration.',
        exactQuote: 'Post the lock-in period, either party may terminate this agreement by providing thirty (30) days prior written notice to the other party.',
        whyRisky:
          'This clause provides equal, balanced reciprocal notice rights for both parties.',
        financialLegalImpact:
          'Sufficient 30-day runway to relocate or arrange alternate accommodations.',
        recommendedRevision:
          'Standard clause — no amendment required.',
      },
    ],
    counterOfferEmail: {
      polite: `Dear Mr. Menon,

Thank you for sharing the draft Residential Lease Agreement for Apartment 402, Green Meadows Heights. We are looking forward to moving into the home.

Before finalizing the agreement, I would like to kindly propose two standard refinements:

1. Clause 3 (Lock-in Period): While I fully intend to stay long-term, unforeseen work relocation may occur. Could we cap early exit liability to one month's rent (₹38,000) rather than forfeiting the full ₹1,20,000 security deposit?
2. Clause 5 (Escalation & Inspection): Could we align the annual rent escalation to the city standard 7% upon renewal? Additionally, could we specify that property visits will be scheduled with at least 24 hours prior notice at mutually convenient daytime hours?

Thank you for your consideration. I am eager to sign the updated draft.

Warm regards,
Priya Kulkarni`,
      firm: `Dear Mr. Menon,

I have completed the legal review of the draft Lease Agreement for Apartment 402. The following terms must be brought into line with standard residential tenancy norms:

1. Clause 3 (Lock-in): Forfeiture of the entire ₹1,20,000 deposit is punitive. Early exit deductions must be capped at 1 month's rent.
2. Clause 5 (Rent Escalation & Right of Entry): Annual rent increases must be capped at 7%. Furthermore, unannounced entry infringes on lawful tenant privacy; a mandatory 24-hour advance written notice requirement must be inserted.

Please update the agreement so we can proceed with signing and deposit transfer.

Regards,
Priya Kulkarni`,
    },
    analyzedAt: 'Just now',
    mode: 'sample',
  },

  freelance: {
    id: 'sample-freelance',
    documentTitle: 'Master Freelance Services Agreement',
    filename: 'Freelance_Services_Contract.pdf',
    contractType: 'Commercial / Freelance Contract',
    jurisdiction: 'Commercial / Freelance Contract • General Commercial Law Norms',
    safetyScore: 51,
    verdictLabel: 'High Risk — 2 Critical Clauses Flagged',
    summary:
      'Contract conditions contractor payment on third-party client sign-off (Pay-if-Paid) and demands full IP transfer with infinite free revisions prior to payment clearance.',
    fullText: `MASTER FREELANCE PROFESSIONAL SERVICES AGREEMENT

This Freelance Services Agreement ("Agreement") is executed on October 25, 2026, by and between:
Velocity Brand Labs LLC ("Client"), having its registered office in Dover, Delaware,
AND
David Chen Consulting ("Contractor"), independent software architecture consultant.

1. Scope of Work
The Contractor shall design and deliver cloud-native microservices backend components as outlined in Project Statement of Work 01 attached hereto.

2. Milestone Deliverables
Deliverables shall be submitted in accordance with the project milestone schedule specified in Exhibit A, accompanied by written release notes and staging environment deployment validation.

3. Invoicing and Payment Terms
Invoices shall be payable within ninety (90) days of submission, strictly contingent upon the Client receiving final written acceptance and full payment from its end-customer. Should the end-customer withhold funds, Client bears no liability to pay Contractor.

4. Revisions & Acceptance Criteria
The Contractor agrees to execute unlimited rounds of revisions until the Client is satisfied. All intellectual property rights shall irrevocably vest in the Client upon generation of the work, regardless of pending payment disputes.

5. Warranties & Indemnification
The Contractor warrants that all delivered deliverables are original work and free of third-party copyright claims. Contractor agrees to indemnify and hold harmless Client against any claims, losses, or legal fees resulting from delivered code.

6. Termination
Either party may terminate this agreement upon fifteen (15) days written notice. Contractor shall immediately cease all development work upon receipt of notice.

IN WITNESS WHEREOF, the parties hereto have caused this Agreement to be signed by their authorized representatives.

Velocity Brand Labs LLC
Authorized Signatory

David Chen Consulting
David Chen`,
    clauses: [
      {
        id: 'c-free-1',
        clauseNumber: '3',
        category: 'Payment Terms & Pay-if-Paid',
        riskLevel: 'high',
        oneLineSummary: 'Net-90 payment terms strictly contingent on third-party end-customer payment.',
        exactQuote: 'Invoices shall be payable within ninety (90) days of submission, strictly contingent upon the Client receiving final written acceptance and full payment from its end-customer.',
        whyRisky:
          'A "Pay-if-Paid" clause shifts third-party credit and default risk entirely onto the freelance contractor. If the client’s customer delays or disputes an unrelated issue, you will not receive payment for months—or ever.',
        financialLegalImpact:
          'Extreme cash flow strain (90+ day delay) and severe vulnerability to non-payment for completed deliverables.',
        recommendedRevision:
          'Invoices shall be due and payable within thirty (30) days of invoice receipt (Net-30). Contractor compensation is independent of any third-party billing, acceptance, or collection status.',
      },
      {
        id: 'c-free-2',
        clauseNumber: '4',
        category: 'Revisions & IP Transfer',
        riskLevel: 'high',
        oneLineSummary: 'Unlimited free revisions and immediate IP transfer prior to payment receipt.',
        exactQuote: 'The Contractor agrees to execute unlimited rounds of revisions until the Client is satisfied. All intellectual property rights shall irrevocably vest in the Client upon generation of the work, regardless of pending payment disputes.',
        whyRisky:
          'Unlimited revisions lead to catastrophic scope creep without compensation. Transferring IP upon creation leaves you zero legal leverage to recover unpaid invoices since the client already owns the source code.',
        financialLegalImpact:
          'Uncapped uncompensated labor hours and total loss of IP retention leverage in dispute scenarios.',
        recommendedRevision:
          'Contractor includes up to two (2) rounds of revisions within scope. Additional changes billed at $95/hour. Intellectual property rights shall transfer to Client strictly upon receipt of full and final payment.',
      },
      {
        id: 'c-free-3',
        clauseNumber: '2',
        category: 'Milestones & Deliverables',
        riskLevel: 'safe',
        oneLineSummary: 'Clear milestone schedule and staging deployment validation procedure.',
        exactQuote: 'Deliverables shall be submitted in accordance with the project milestone schedule specified in Exhibit A, accompanied by written release notes',
        whyRisky:
          'Clear specification of deliverables and structured staging reviews is healthy and protects both parties.',
        financialLegalImpact:
          'Objective benchmarks for phase completion and delivery verification.',
        recommendedRevision:
          'Standard clause — no amendment required.',
      },
    ],
    counterOfferEmail: {
      polite: `Hi Team Velocity Brand Labs,

Thank you for sending over the Master Freelance Services Agreement. I am thrilled to collaborate on the microservices architecture for this project.

To align the contract with standard engineering consulting practices, I would like to request two critical adjustments:

1. Clause 3 (Payment Terms): I request standard Net-30 payment terms independent of third-party end-customer sign-offs, as independent contractor compensation should not be tied to downstream client receivables.
2. Clause 4 (Revisions & IP Assignment): I propose scoping two (2) rounds of revisions per milestone, with additional requests handled under our agreed hourly rate. Furthermore, IP transfer should occur upon full settlement of invoice amounts.

I appreciate your collaboration and look forward to finalizing this so we can kick off development.

Best regards,
David Chen`,
      firm: `Hi Team Velocity Brand Labs,

I have reviewed the Master Freelance Services Agreement. Prior to beginning architectural work, the following revisions are mandatory:

1. Clause 3 (Payment Terms): Net-90 and "pay-if-paid" conditions are unacceptable. Invoices must be payable on standard Net-30 terms independent of third-party client collections.
2. Clause 4 (Scope & IP): Unlimited revisions must be capped at 2 review cycles per deliverable. Crucially, all intellectual property rights remain with the Contractor until full and final invoice payment is cleared.

Please provide an updated agreement with these standard terms so we can proceed.

Sincerely,
David Chen`,
    },
    analyzedAt: 'Just now',
    mode: 'sample',
  },
};
