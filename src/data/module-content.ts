// Page content for the 14 module pages: purpose, how to use it, who uses it, and
// questions. Generated from docs/content (files 01, 04, 05, 06) and checked so
// that nothing still awaiting confirmation there reaches the site. To change the wording,
// edit this file; to add a module, add an entry keyed by its /features/<slug>.

export interface ModuleContent {
  seoTitle: string;
  metaDescription: string;
  headline: string;
  answer: string;
  purpose: string;
  problem: string;
  seeInside: string[];
  howTo: { stage: string; steps: string[] }[];
  example: string;
  roles: { who: string; what: string }[];
  outputs: string;
  connects: string;
  tips: string[];
  faqs: { q: string; a: string }[];
  next: string[]; // module names, then "Book a demo"
}

export const MODULE_CONTENT: Record<string, ModuleContent> = {
  "admissions": {
    "seoTitle": "School Admission Management Software",
    "metaDescription": "Run school admissions online: application forms, document checks, SMS and WhatsApp updates and enquiry-to-enrolment tracking. Book a free demo.",
    "headline": "Admissions that run themselves, from first enquiry to first day.",
    "answer": "ChaloSchools Admissions Management lets a school take online applications, verify documents, update parents by SMS and WhatsApp, and track every enquiry through to enrolment from one dashboard. An enrolled student carries straight into the Student Management record.",
    "purpose": "Admissions Management exists so that no family who shows interest in your school is lost, and so that every step from a first enquiry to a child's first day happens in one place. It turns a pile of forms, phone calls and spreadsheets into a single pipeline you can see.",
    "problem": "Enquiries are written in a register or a spreadsheet. Application forms are paper. Documents arrive in pieces and are chased by phone. Nobody knows how many enquiries became admissions, so nobody knows why the others did not.",
    "seeInside": [
      "Online application forms with the fields you choose, so parents apply from a phone.",
      "Document upload with a verification step, so nothing is checked from a paper pile.",
      "Status messages that go to parents by SMS and WhatsApp as an application moves along.",
      "An enquiry-to-admission view that shows how many applicants reach each stage.",
      "Sibling linking and a waitlist, so brothers and sisters and queues are handled properly.",
      "Bulk admission processing for the new academic year."
    ],
    "howTo": [
      {
        "stage": "Set up once, before the admission season",
        "steps": [
          "Build the application form. Choose the fields your school needs, including custom ones, so parents fill in exactly what you ask for.",
          "Decide the documents you require, so parents know what to upload.",
          "Set the messages parents receive as an application moves along, by SMS and WhatsApp.",
          "Set your sibling and waitlist rules, so brothers and sisters and a full class are handled the same way every time."
        ]
      },
      {
        "stage": "For every enquiry",
        "steps": [
          "Capture it. The parent applies online, or the front office enters the enquiry.",
          "The parent is kept informed automatically. Each change in status sends a message, so nobody phones to ask.",
          "Documents are uploaded and verified. The administrator checks each one in a verification step.",
          "The principal approves. If the class is full, the child joins the waitlist.",
          "Fees are paid online where the school collects an application or admission fee.",
          "The child is enrolled. The record moves into Student Management with nothing re-typed."
        ]
      },
      {
        "stage": "Each new academic year",
        "steps": [
          "Use bulk admission processing to handle the whole intake at once.",
          "Open the conversion view and read where applicants drop off: enquiry, application, documents, enrolment."
        ]
      }
    ],
    "example": "A parent enquires on a Monday evening through the online form. By morning she has had a message confirming the enquiry. She uploads the birth certificate from her phone. The administrator verifies it the same day and the principal approves on Wednesday. The family hears at every step and never calls the office.",
    "roles": [
      {
        "who": "Administrators",
        "what": "take enquiries, verify documents and keep the pipeline moving."
      },
      {
        "who": "Principals",
        "what": "approve admissions quickly instead of signing paper."
      },
      {
        "who": "School owners",
        "what": "watch conversion and see admissions beside fees and academics."
      }
    ],
    "outputs": "Every enquiry on record; documents stored and verified; parents updated without effort; and a conversion view that shows where you lose families, so you can fix that stage.",
    "connects": "Student Management (the enrolled child's record), Communication (the SMS and WhatsApp messages), Fee Management (online fees).",
    "tips": [],
    "faqs": [
      {
        "q": "Can parents apply online?",
        "a": "Yes. Application forms are online, with document upload and e-payment where the school asks for a fee."
      },
      {
        "q": "Can we see where applicants drop off?",
        "a": "Yes. Conversion tracking shows how enquiries turn into admissions."
      },
      {
        "q": "How are siblings and waiting lists handled?",
        "a": "Through sibling linking and waitlist management."
      },
      {
        "q": "What happens after a student is enrolled?",
        "a": "The record moves into Student Management, with no re-typing."
      }
    ],
    "next": [
      "Student Management",
      "Fee Management",
      "Book a demo"
    ]
  },
  "student": {
    "seoTitle": "Student Management System for Schools",
    "metaDescription": "One searchable record for every student, from admission to alumni: academic history, attendance, fees and documents in one place.",
    "headline": "Every student's full record, one click away.",
    "answer": "Student Management gives every student one searchable profile that holds their academic history, attendance, fees, documents and family details from admission onwards. Any record opens in seconds, with no files to dig through.",
    "purpose": "Student Management is the school's single source of truth about each child. Whoever needs to know something about a student, whether a teacher, the front office or a parent, finds the same answer in the same place.",
    "problem": "Records live in cupboards of files and in several spreadsheets. A mark sheet is in one place, a transfer certificate in another, a parent's phone number in a third. Finding anything takes time, and promoting a school to the next year takes days.",
    "seeInside": [
      "A profile with a photo ID for each student.",
      "Academic history across every year the student has been with you.",
      "Emergency contacts and medical notes, ready when they matter.",
      "Document storage for birth and transfer certificates and similar papers.",
      "Sibling linking, so families are connected across the school.",
      "Bulk promotion to the next academic year in one step."
    ],
    "howTo": [
      {
        "stage": "Set up once",
        "steps": [
          "Decide what a profile holds: details, a photo ID, emergency contacts and medical notes.",
          "Bring existing records in. New students arrive from Admissions; current students are loaded at onboarding, and data migration is part of every plan."
        ]
      },
      {
        "stage": "Every day",
        "steps": [
          "Find a student instantly by searching, and see everything about them on one profile.",
          "Keep it current: update contacts, add medical notes, upload documents such as birth and transfer certificates.",
          "Link siblings, so a family is one connected group across the school.",
          "Let history build itself. Attendance, marks and fees accumulate on the profile as the year goes on."
        ]
      },
      {
        "stage": "Every year",
        "steps": [
          "Use bulk promotion to move whole classes to the next academic year in one step.",
          "When a child leaves, their record and documents stay complete. For CBSE and State board schools the platform supports transfer certificate generation."
        ]
      }
    ],
    "example": "A parent calls to ask for a copy of last year's mark sheet. The front office searches the child's name, opens the profile and has the academic history on screen before the call ends.",
    "roles": [
      {
        "who": "Administrators",
        "what": "keep records accurate and documents filed."
      },
      {
        "who": "Teachers",
        "what": "see the students they teach."
      },
      {
        "who": "Parents",
        "what": "see their child's information in the app."
      }
    ],
    "outputs": "A complete, searchable record of every child from admission to alumni, with no files to dig through, and a year-end promotion that takes minutes.",
    "connects": "Admissions (where the record starts), Attendance, Fee Management, Academic & Examination (results feed the history), and the Parent & Student App.",
    "tips": [],
    "faqs": [
      {
        "q": "How fast can we find a student?",
        "a": "Instantly, through search."
      },
      {
        "q": "What documents can we store?",
        "a": "Certificates such as birth and transfer certificates sit on each student's profile."
      },
      {
        "q": "How do we move students to the next class?",
        "a": "Bulk promotion handles the whole year."
      },
      {
        "q": "Do we keep medical details?",
        "a": "Yes, emergency contacts and medical notes are on the profile."
      }
    ],
    "next": [
      "Attendance Management",
      "Academic & Examination",
      "Book a demo"
    ]
  },
  "staff-hr": {
    "seoTitle": "School Staff Management Software",
    "metaDescription": "Staff records, roles, attendance, leave approvals and appraisals for schools in one system, without spreadsheets. Book a free demo.",
    "headline": "Your whole team, in one place.",
    "answer": "Staff Management keeps every teaching and non-teaching staff record, document, leave request and appraisal in one system, with role-based access so each person sees only what they should.",
    "purpose": "Staff Management keeps everything about the people who run the school in one system: who they are, what they may do, whether they are present and how they are performing.",
    "problem": "Staff files are in a cabinet, leave is in a register, appraisals are on paper and nobody has the whole picture. Leave requests wait for a signature, and a teacher's absence is discovered at the last minute.",
    "seeInside": [
      "Complete staff records with their documents.",
      "A staff directory with contact details.",
      "Roles and permissions, so each user sees what their job needs.",
      "Staff attendance and leave in one place.",
      "A leave approval workflow that goes to the right person.",
      "Appraisal and performance tracking."
    ],
    "howTo": [
      {
        "stage": "Set up once",
        "steps": [
          "Create staff records and attach their documents.",
          "Set roles and access so each person sees only what their job needs.",
          "Set up the leave approval route, so each request goes to the right person."
        ]
      },
      {
        "stage": "Every day",
        "steps": [
          "Staff attendance and leave are recorded in the system.",
          "A staff member requests leave; the approver sees it and approves or declines.",
          "Use the directory to find any colleague's contact details."
        ]
      },
      {
        "stage": "Every term or year",
        "steps": [
          "Run appraisals and track performance in the same place.",
          "Check leave and attendance patterns before payroll."
        ]
      }
    ],
    "example": "A teacher applies for two days of leave. The principal approves from her phone. The timetable can then assign a substitute and payroll already knows.",
    "roles": [
      {
        "who": "Principals",
        "what": "see staff performance and leave at a glance and approve requests."
      },
      {
        "who": "School owners",
        "what": "see the team beside the rest of the school."
      },
      {
        "who": "Administrators",
        "what": "keep records and documents complete."
      }
    ],
    "outputs": "Complete staff records, fast leave approvals, a clear performance record and accurate inputs for payroll.",
    "connects": "Payroll (salary follows attendance and leave), Attendance, and AI Timetable (absence triggers a substitution).",
    "tips": [],
    "faqs": [
      {
        "q": "Can leave be approved online?",
        "a": "Yes, through the leave approval workflow."
      },
      {
        "q": "Who can see staff records?",
        "a": "Only the roles you allow, through role-based access."
      },
      {
        "q": "Does it track performance?",
        "a": "Yes, with appraisal and performance tracking."
      }
    ],
    "next": [
      "Payroll Management",
      "AI Timetable & Scheduling",
      "Book a demo"
    ]
  },
  "fees": {
    "seoTitle": "School Fee Management Software",
    "metaDescription": "Collect school fees online and at the counter, send automatic reminders, track defaulters and issue GST-ready receipts. Book a free demo.",
    "headline": "Collect fees on time, without chasing a single parent.",
    "answer": "ChaloSchools Fee Management lets parents pay online or at the counter, sends fee reminders by SMS and WhatsApp until dues are cleared, and reconciles every receipt daily, so management always sees what is collected and what is pending.",
    "purpose": "Fee Management makes sure the school collects what it is owed, on time, with a clear record of every rupee. It also gives parents an easy way to pay, and gives management a live view of collection against target.",
    "problem": "Fee follow-ups are done by phone and by hand. Receipts are matched against bank entries in a spreadsheet. Defaulters are discovered late. The principal asks \"how much have we collected?\" and the answer takes a day.",
    "seeInside": [
      "Multi-instalment fee plans with your own due dates.",
      "Concessions and scholarships applied to the right students.",
      "Transport, hostel and activity fees alongside tuition.",
      "Online payments through a gateway, with duplicate-proof reconciliation.",
      "Automatic reminders by SMS and WhatsApp, and a live defaulter list.",
      "GST-ready receipts and a ledger where every receipt is accounted for."
    ],
    "howTo": [
      {
        "stage": "Set up once, before the year",
        "steps": [
          "Build the fee plans: multi-instalment plans with your own due dates, for each class or category.",
          "Add the other fees that sit beside tuition: transport, hostel and activity fees.",
          "Set concessions and scholarships, so they are applied correctly to the right students.",
          "Connect the payment gateway, so parents can pay online. Connect Tally if your accountant uses it."
        ]
      },
      {
        "stage": "Every day",
        "steps": [
          "Parents pay online at any time through the gateway, or at the counter. Both are recorded in one ledger.",
          "A receipt is issued straight away, GST-ready.",
          "Reminders go out automatically by SMS and WhatsApp for dues that are approaching or overdue, until they are cleared.",
          "The accountant reconciles daily. Payments are matched to the right student, and duplicates are prevented."
        ]
      },
      {
        "stage": "Every month",
        "steps": [
          "Open the collection dashboard and compare against the target.",
          "Review the defaulter list with the principal.",
          "Pull reports for management and audit."
        ]
      }
    ],
    "example": "a school sets a monthly target of ₹17.4 lakh. By the 20th the dashboard shows ₹18.4 lakh collected, 5.7 per cent over target. Fourteen defaulters have already had reminders; the accountant sees the list without asking anyone.",
    "roles": [
      {
        "who": "Accountants",
        "what": "set up plans, reconcile, issue receipts and report."
      },
      {
        "who": "Parents",
        "what": "pay without queues and see their dues in the app."
      },
      {
        "who": "School owners",
        "what": "and principals watch collection against target."
      }
    ],
    "outputs": "Faster collection, no manual follow-ups, a ledger where every receipt is accounted for, and audit-ready reports.",
    "connects": "Tally ERP, the online payment gateway, WhatsApp and SMS (reminders), Transport (transport fees), Payroll, and the Parent & Student App.",
    "tips": [],
    "faqs": [
      {
        "q": "Can parents pay online?",
        "a": "Yes, at any time, through an integrated payment gateway."
      },
      {
        "q": "Do reminders go out by themselves?",
        "a": "Yes, by SMS and WhatsApp until the dues are cleared."
      },
      {
        "q": "Can we apply concessions and scholarships?",
        "a": "Yes. Concessions and scholarships are applied to the right students."
      },
      {
        "q": "Does it work with Tally?",
        "a": "Yes. ChaloSchools integrates with Tally ERP."
      }
    ],
    "next": [
      "Communication Management (reminders)",
      "Payroll Management",
      "Book a demo"
    ]
  },
  "timetable": {
    "seoTitle": "AI Timetable Generator for Schools",
    "metaDescription": "Build a conflict-free school timetable around every teacher and room, and cover absences with instant substitutions. Book a free demo.",
    "headline": "A conflict-free timetable, built for you.",
    "answer": "The AI timetable builder produces a school timetable that respects teacher availability, room limits and subject load, and assigns a substitute the moment a teacher is absent, so the school day is never disrupted.",
    "purpose": "The timetable module produces a school timetable that works: no teacher in two places, no room double-booked, and a fair load on every teacher. Then it keeps the day running when someone is absent.",
    "problem": "A timetable built by hand takes days of juggling in a spreadsheet. Clashes are found after printing. Every absence means a scramble to find cover.",
    "seeInside": [
      "A timetable generated by AI with no teacher or room clashes.",
      "Teacher workload balanced across the week, with their preferences respected.",
      "Multi-shift and multi-section schools handled in one plan.",
      "Instant substitution when a teacher is absent.",
      "Period planning that keeps loads even.",
      "Export to PDF, print or digital display boards."
    ],
    "howTo": [
      {
        "stage": "Set up once per term",
        "steps": [
          "Enter the facts: teachers, subjects, classes and sections, rooms, and shifts if you run more than one.",
          "State the constraints: teacher availability and preferences, room limits, and how many periods each subject needs.",
          "Choose how to balance workload across the week."
        ]
      },
      {
        "stage": "Generate",
        "steps": [
          "Let the AI build the timetable. It works around every constraint, with no clashes.",
          "Review and adjust. Fine-tune what you wish.",
          "Publish and export to PDF, print, or digital display boards."
        ]
      },
      {
        "stage": "Every day",
        "steps": [
          "A teacher is absent. The system assigns a substitute instantly.",
          "The substitute is alerted. The class is covered without a scramble."
        ]
      }
    ],
    "example": "A coordinator enters 40 teachers, 24 sections and the period needs for each subject. The AI returns a timetable with no clashes. The coordinator moves two periods by preference and prints it.",
    "roles": [
      {
        "who": "Coordinators",
        "what": "generate, adjust and publish."
      },
      {
        "who": "Teachers",
        "what": "receive their schedule and substitution alerts."
      },
      {
        "who": "Principals",
        "what": "see the school day run without disruption."
      }
    ],
    "outputs": "A clash-free timetable in a fraction of the time, balanced teacher loads, and instant cover for absences.",
    "connects": "Staff Management (leave and absence), Attendance, and Academic & Examination (exam scheduling).",
    "tips": [],
    "faqs": [
      {
        "q": "Does it avoid clashes?",
        "a": "Yes, it builds a conflict-free timetable around every constraint."
      },
      {
        "q": "What happens when a teacher is absent?",
        "a": "A substitute is assigned instantly."
      },
      {
        "q": "Can we print or display it?",
        "a": "Yes, as PDF, print or on display boards."
      },
      {
        "q": "Can it handle two shifts?",
        "a": "Yes, multi-shift and multi-section are supported."
      },
      {
        "q": "Can teachers state preferences?",
        "a": "Yes. Teacher availability and preferences are taken into account when the timetable is built."
      },
      {
        "q": "What if the AI's version isn't right?",
        "a": "You can adjust it."
      }
    ],
    "next": [
      "Attendance Management",
      "Staff Management",
      "Book a demo"
    ]
  },
  "attendance": {
    "seoTitle": "School Attendance Management System",
    "metaDescription": "Mark attendance in one tap or with biometric and RFID devices, and alert parents the moment a child is absent. Book a free demo.",
    "headline": "Attendance in one tap. Parents told in seconds.",
    "answer": "Attendance Management lets a teacher mark a whole class in one tap, works with your existing biometric and RFID devices, and sends parents an alert the moment their child is marked absent.",
    "purpose": "Attendance Management records who is in school, tells the right people at once when someone is not, and builds the attendance picture the principal and payroll need.",
    "problem": "Paper registers are slow and error-prone. Parents find out about an absence hours later, if at all. Staff attendance and leave sit in separate books, so payroll waits.",
    "seeInside": [
      "One-tap, class-wise attendance marking from the app.",
      "Biometric and RFID device support, so existing hardware keeps working.",
      "An instant absence message to the parent.",
      "Staff attendance and leave, with an approval workflow.",
      "Attendance analytics with trend reports.",
      "Class and school summaries for the principal."
    ],
    "howTo": [
      {
        "stage": "Set up once",
        "steps": [
          "Set up classes and sections with their student lists.",
          "Connect your biometric or RFID devices if you use them.",
          "Set the absence message parents will receive.",
          "Set the staff leave approval route."
        ]
      },
      {
        "stage": "Every day",
        "steps": [
          "Mark attendance. A teacher marks a whole class in one tap in the app. Where devices are connected, check-ins record attendance automatically.",
          "The parent is told. The moment a child is marked absent, an SMS or WhatsApp message goes to the parent.",
          "Staff attendance is recorded the same way, and leave is requested and approved in the system."
        ]
      },
      {
        "stage": "Every week and month",
        "steps": [
          "Read the attendance analytics and trend reports by class.",
          "Look at who is regularly absent and talk to the families.",
          "Pass staff attendance to payroll."
        ]
      }
    ],
    "example": "Example: Class 6B has 40 students. The teacher marks it in one tap by 8:45; two students are absent and two parents receive a message at once. By 9:00 the principal sees school-wide attendance at 96.8 per cent.",
    "roles": [
      {
        "who": "Teachers",
        "what": "mark and review in the app."
      },
      {
        "who": "Principals",
        "what": "see attendance in real time, school-wide."
      },
      {
        "who": "Parents",
        "what": "are alerted when a child is absent."
      }
    ],
    "outputs": "Accurate daily attendance, instant absence alerts, trend reports, and staff attendance that payroll can trust.",
    "connects": "Biometric and RFID devices, WhatsApp and SMS, Payroll (attendance-linked deductions), and the Parent & Student App.",
    "tips": [],
    "faqs": [
      {
        "q": "Can we use our existing biometric machines?",
        "a": "Yes, biometric and RFID devices are supported."
      },
      {
        "q": "How do parents find out about an absence?",
        "a": "An instant SMS or WhatsApp alert."
      },
      {
        "q": "Can we see trends?",
        "a": "Yes, attendance analytics show trends by class."
      }
    ],
    "next": [
      "Communication Management",
      "Payroll Management",
      "Book a demo"
    ]
  },
  "exams": {
    "seoTitle": "School Exam & Report Card Software",
    "metaDescription": "Schedule exams, enter marks digitally, generate board-format report cards automatically and publish results online. Book a free demo.",
    "headline": "From exam schedule to report card, with no spreadsheets.",
    "answer": "Academic & Examination manages the full exam cycle: scheduling, digital mark entry, automatic grade calculation, board-format report cards and online result publication, so parents see results in the app as soon as they are ready.",
    "purpose": "Academic & Examination runs the whole exam cycle and turns marks into results and report cards the way your board expects, then shows how students, subjects and classes are performing.",
    "problem": "Marks are collected on paper, totals and grades are calculated by hand, report cards take days to produce, and an error found at the end means starting again.",
    "seeInside": [
      "Flexible exam scheduling for every kind of test.",
      "Digital mark entry by teachers, with grades calculated for you.",
      "Report cards generated automatically in the board's format (CBSE, ICSE or State).",
      "Results published online to parents.",
      "Performance analytics by student, subject and class.",
      "Trends across terms and years."
    ],
    "howTo": [
      {
        "stage": "Set up once",
        "steps": [
          "Choose the grading format for your board: CBSE, ICSE or State.",
          "Create the exam structure: terms, unit tests and the subjects each covers."
        ]
      },
      {
        "stage": "For every exam",
        "steps": [
          "Schedule it with flexible exam scheduling.",
          "Teachers enter marks digitally. Grades are calculated automatically from the marks.",
          "Review the results for each class.",
          "Generate report cards. They are produced automatically in the board's format.",
          "Publish results online. Parents see them in the app as soon as they are published."
        ]
      },
      {
        "stage": "After the exam",
        "steps": [
          "Open performance analytics by student, subject and class.",
          "Compare terms and years to see the trend."
        ]
      }
    ],
    "example": "Example: after a unit test, each teacher enters marks from their phone. By the next morning the coordinator has every class's results and the report cards are ready to publish.",
    "roles": [
      {
        "who": "Teachers",
        "what": "enter marks and see grades appear."
      },
      {
        "who": "Coordinators",
        "what": "schedule exams and manage the academic calendar."
      },
      {
        "who": "Parents",
        "what": "view marks and progress in real time."
      }
    ],
    "outputs": "No manual calculation, board-format report cards generated automatically, results published online, and analytics that show where students need help.",
    "connects": "Student Management (history), the Parent & Student App, Reports & Analytics, and Performance Insights.",
    "tips": [],
    "faqs": [
      {
        "q": "Which grading formats are supported?",
        "a": "Board-specific formats for CBSE, ICSE and State boards."
      },
      {
        "q": "Are report cards automatic?",
        "a": "Yes, they are generated from the marks entered."
      },
      {
        "q": "When do parents see results?",
        "a": "As soon as they are published, in the app."
      }
    ],
    "next": [
      "Performance Insights",
      "Student Management",
      "Book a demo"
    ]
  },
  "whatsapp": {
    "seoTitle": "School Parent Communication App",
    "metaDescription": "Reach every parent on WhatsApp, SMS and voice from one console, with delivery and read receipts. Book a free demo for your school.",
    "headline": "Every parent, every notice, on time.",
    "answer": "Communication Management sends announcements, fee reminders and emergency alerts to parents on WhatsApp, SMS and voice from one console, and shows who has received and read each message.",
    "purpose": "Communication Management gives the school one official way to reach parents, so a message goes to exactly the right people on the channel they use, and the school can see who has received and read it.",
    "problem": "Updates are scattered across dozens of WhatsApp groups. Messages are missed, replies are lost, and nobody knows who has seen what.",
    "seeInside": [
      "WhatsApp Business messaging from the school's own number.",
      "Bulk SMS and voice broadcast.",
      "Delivery and read receipts for every message.",
      "Class-wise or school-wide announcements.",
      "Automatic fee and event reminders.",
      "Two-way messaging between parents and teachers."
    ],
    "howTo": [
      {
        "stage": "Set up once",
        "steps": [
          "Connect the channels: WhatsApp Business API, SMS and voice broadcast.",
          "Set the audiences: a class, several classes, or the whole school.",
          "Switch on the automatic messages you want: fee reminders, event reminders, absence alerts."
        ]
      },
      {
        "stage": "Every day",
        "steps": [
          "Write or paste a notice. AI Secretary can draft notices and circulars for you.",
          "Choose the audience and the channel, and send.",
          "Watch delivery and reads. See who received and who opened the message.",
          "Reply in conversation. Parents and teachers message each other directly."
        ]
      },
      {
        "stage": "For emergencies",
        "steps": [
          "Send an alert by WhatsApp, SMS and voice broadcast at the same time."
        ]
      }
    ],
    "example": "Example: the school announces a holiday for Class 8 only. The administrator picks Class 8, sends on WhatsApp and SMS, and ten minutes later sees that 94 per cent of parents have read it.",
    "roles": [
      {
        "who": "Principals",
        "what": "oversee what goes to parents."
      },
      {
        "who": "Teachers",
        "what": "message parents directly."
      },
      {
        "who": "Administrators",
        "what": "send announcements and alerts."
      }
    ],
    "outputs": "One official channel in place of many groups, proof that a message was read, and reminders that run themselves.",
    "connects": "WhatsApp Business API, Fee Management (reminders), Attendance (absence alerts), Transport (pickup and drop alerts), and AI Secretary (drafts the notices).",
    "tips": [],
    "faqs": [
      {
        "q": "Can we see who read a message?",
        "a": "Yes, through delivery and read tracking."
      },
      {
        "q": "Which channels are supported?",
        "a": "WhatsApp, SMS and voice."
      },
      {
        "q": "Can parents reply?",
        "a": "Yes, with two-way parent-teacher messaging."
      },
      {
        "q": "Can we send voice messages?",
        "a": "Yes, voice broadcast is included."
      },
      {
        "q": "Can we target one class?",
        "a": "Yes, class-wise or school-wide."
      }
    ],
    "next": [
      "Fee Management",
      "AI Secretary",
      "Book a demo"
    ]
  },
  "inventory": {
    "seoTitle": "School Inventory Management Software",
    "metaDescription": "Track books, uniforms, lab equipment and supplies in real time, scan items in and out, and get low-stock alerts. Book a free demo.",
    "headline": "Know what you have, where it is and when to reorder.",
    "answer": "Academic Inventory Tracking records every book, uniform, lab item and piece of equipment in real time, with barcode and QR scanning, check-in and check-out, and alerts before anything runs out.",
    "purpose": "Academic Inventory Tracking keeps a live count of the school's books, uniforms, lab equipment, sports gear and supplies, and who holds them, so nothing runs out unnoticed and nothing goes missing.",
    "problem": "Stock is counted by hand and written in registers. Items run out before anyone notices. Nobody knows which department or person holds a piece of equipment.",
    "seeInside": [
      "Real-time stock across every department.",
      "Barcode and QR scanning to move items in and out.",
      "Low-stock alerts and reorder reminders.",
      "Assets assigned, checked out and checked in.",
      "Purchase and vendor history.",
      "Depreciation tracking for equipment."
    ],
    "howTo": [
      {
        "stage": "Set up once",
        "steps": [
          "Set up departments and categories for your stock.",
          "Add each item with a barcode or QR label.",
          "Set the low-stock level for each item that you want to be warned about."
        ]
      },
      {
        "stage": "Every day",
        "steps": [
          "Scan items in when stock arrives and out when it is used.",
          "Assign equipment to a person or department and check it back in.",
          "Act on alerts. A low-stock alert and reorder reminder tells you before you run out."
        ]
      },
      {
        "stage": "Every term or year",
        "steps": [
          "Review purchase and vendor history before you reorder.",
          "Use depreciation tracking for equipment."
        ]
      }
    ],
    "example": "Example: the science lab's glassware drops below its set level. An alert reaches the administrator, who reorders from the vendor recorded in the history.",
    "roles": [
      {
        "who": "Administrators",
        "what": "manage stock and assets across departments."
      },
      {
        "who": "School owners",
        "what": "review purchasing history."
      }
    ],
    "outputs": "A real-time stock count, alerts before shortages, a record of who has what, and a purchase history for better buying.",
    "connects": "Library Management (books are stock too), Fee Management (uniform and book fees), barcode scanners.",
    "tips": [],
    "faqs": [
      {
        "q": "Can we scan items?",
        "a": "Yes, with barcode and QR scanning."
      },
      {
        "q": "Will we be warned before stock runs out?",
        "a": "Yes, through low-stock alerts and reorder reminders."
      },
      {
        "q": "Can we track equipment lent to staff?",
        "a": "Yes, through assignment and check-in or check-out."
      }
    ],
    "next": [
      "Library Management",
      "Payroll Management",
      "Book a demo"
    ]
  },
  "payroll": {
    "seoTitle": "School Payroll Software with PF, ESI, TDS",
    "metaDescription": "Run school salaries with PF, ESI and TDS calculated automatically, digital payslips and bank-ready payment files. Book a free demo.",
    "headline": "Salaries done right, every month.",
    "answer": "Payroll Management calculates salaries with PF, ESI and TDS automatically, links deductions to staff attendance, produces digital payslips in seconds and creates bank-ready payment files.",
    "purpose": "Payroll Management turns attendance, leave and salary structures into correct salaries every month, with the statutory deductions handled, and gives each staff member a payslip.",
    "problem": "Salaries are calculated by hand from attendance books. PF, ESI and TDS are easy to get wrong. Payslips take days, and the bank file is typed again.",
    "seeInside": [
      "Automatic salary calculation each month.",
      "PF, ESI and TDS handled for you.",
      "Deductions linked to staff attendance.",
      "Loan and advance tracking.",
      "Digital payslips, created and shared in seconds.",
      "Bank-ready payment files."
    ],
    "howTo": [
      {
        "stage": "Set up once",
        "steps": [
          "Define each salary structure.",
          "Set the statutory settings: PF, ESI and TDS.",
          "Record loans and advances where staff have them."
        ]
      },
      {
        "stage": "Every month",
        "steps": [
          "Bring in attendance and leave from Staff Management and Attendance.",
          "Run the calculation. Salaries, statutory deductions and attendance-linked deductions are calculated automatically.",
          "Review the figures before approval.",
          "Generate payslips and share them digitally in seconds.",
          "Download the bank-ready payment file and send it to the bank."
        ]
      }
    ],
    "example": "Example: on the 28th, the accountant runs payroll for 45 staff. Deductions follow each person's attendance. Payslips reach staff phones within seconds and the bank file is ready to upload.",
    "roles": [
      {
        "who": "Accountants",
        "what": "run payroll and send it to the bank."
      },
      {
        "who": "Administrators",
        "what": "confirm attendance and leave."
      },
      {
        "who": "Staff",
        "what": "receive their payslips digitally."
      }
    ],
    "outputs": "Accurate monthly salaries, statutory compliance, instant payslips and no retyping for the bank.",
    "connects": "Staff Management, Attendance (including biometric devices), and the bank file export.",
    "tips": [],
    "faqs": [
      {
        "q": "Are PF, ESI and TDS calculated automatically?",
        "a": "Yes. PF, ESI and TDS are calculated automatically each month."
      },
      {
        "q": "Do payslips go out digitally?",
        "a": "Yes, generated and shared in seconds."
      },
      {
        "q": "Does attendance affect salary?",
        "a": "Yes, deductions follow attendance."
      }
    ],
    "next": [
      "Staff Management",
      "Fee Management",
      "Book a demo"
    ]
  },
  "library": {
    "seoTitle": "School Library Management Software",
    "metaDescription": "Run your school library with barcode issue and return, an online catalogue, reservations and fine tracking. Book a free demo.",
    "headline": "A modern library, digitised and organised.",
    "answer": "Library Management gives a school a searchable digital catalogue, barcode-based issue and return, online reservations and automatic fine and overdue tracking, so students can find and reserve books from the app.",
    "purpose": "Library Management lets a school run its library without registers: students find and reserve books, the librarian issues and returns them by scanning, and fines and overdue books look after themselves.",
    "problem": "Issue registers make lending slow. Books are hard to find or reserve. Overdue books and fines are tracked by hand, so they are missed.",
    "seeInside": [
      "A digital catalogue with search.",
      "Barcode scanning for issue and return.",
      "Online reservations from the student's phone.",
      "Fine and overdue tracking, calculated for you.",
      "Inventory management of the book stock.",
      "Reading progress tracking."
    ],
    "howTo": [
      {
        "stage": "Set up once",
        "steps": [
          "Build the catalogue. Add each title and copy, and put a barcode on every book.",
          "Set the lending rules and the fine rate."
        ]
      },
      {
        "stage": "Every day",
        "steps": [
          "Issue and return by scanning the book and the student.",
          "Students search and reserve from the app, so the book is waiting for them.",
          "Overdue books and fines are tracked automatically, with a notice to the student."
        ]
      },
      {
        "stage": "Every term",
        "steps": [
          "Review reading progress and the most borrowed titles.",
          "Reconcile the book stock in the inventory."
        ]
      }
    ],
    "example": "Example: a student searches the catalogue from her phone, finds the title is out, reserves it, and is told when it returns. The librarian scans it back in and the reservation is ready.",
    "roles": [
      {
        "who": "Librarians",
        "what": "issue, return and manage fines."
      },
      {
        "who": "Students",
        "what": "search and reserve."
      }
    ],
    "outputs": "Faster lending, books students can find, no lost overdue tracking and a record of reading progress.",
    "connects": "Barcode scanners, the Parent & Student App, and Academic Inventory Tracking.",
    "tips": [],
    "faqs": [
      {
        "q": "Can students reserve books online?",
        "a": "Yes, from the app."
      },
      {
        "q": "How are fines handled?",
        "a": "Overdue tracking and fine calculation are automatic."
      },
      {
        "q": "Do we need special hardware?",
        "a": "Barcode scanning is used for issue and return."
      }
    ],
    "next": [
      "Academic Inventory Tracking",
      "Student Management",
      "Book a demo"
    ]
  },
  "transport": {
    "seoTitle": "School Bus Tracking & Transport Software",
    "metaDescription": "Track every school bus live with GPS, plan routes, manage drivers and alert parents at every stop. Book a free demo.",
    "headline": "Every bus visible. Every parent informed.",
    "answer": "Transport Management tracks every school bus in real time with GPS, helps plan routes, manages drivers and vehicles, and alerts parents at pickup and drop, with live bus location in the parent app.",
    "purpose": "Transport Management lets a school run its buses with confidence: every bus visible, every route planned, every driver and vehicle on record, and every parent told when their child's bus is near.",
    "problem": "Parents phone the school to ask where the bus is. Routes are planned on paper. Driver and vehicle details are scattered, and maintenance is remembered, not scheduled.",
    "seeInside": [
      "Real-time GPS tracking for the whole fleet.",
      "Route planning and optimisation.",
      "Live tracking for parents inside the app.",
      "Driver and attendant records.",
      "Pickup and drop notifications.",
      "Fleet maintenance tracking."
    ],
    "howTo": [
      {
        "stage": "Set up once",
        "steps": [
          "Record vehicles, drivers and attendants.",
          "Plan the routes and stops, improving them from real data.",
          "Assign students to routes and stops.",
          "Connect the GPS devices."
        ]
      },
      {
        "stage": "Every day",
        "steps": [
          "Watch the fleet live on one screen.",
          "Parents follow their child's bus in the app, and receive pickup and drop notifications.",
          "Handle exceptions: a late bus, a changed route."
        ]
      },
      {
        "stage": "Every month",
        "steps": [
          "Track fleet maintenance so vehicles are serviced on time.",
          "Review routes and transport fees in Fee Management."
        ]
      }
    ],
    "example": "Example: Bus 3 is two stops away. The parents at the next stop get a notification, step out as it arrives, and the school receives no phone calls.",
    "roles": [
      {
        "who": "The transport incharge",
        "what": "plans routes and watches the fleet."
      },
      {
        "who": "Parents",
        "what": "track the bus and get alerts."
      },
      {
        "who": "Principals",
        "what": "know that every child is accounted for."
      }
    ],
    "outputs": "A live view of every vehicle, calmer parents, better routes and vehicles that are maintained on time.",
    "connects": "GPS fleet tracking, the Parent & Student App, WhatsApp and SMS alerts, and Fee Management.",
    "tips": [],
    "faqs": [
      {
        "q": "Can parents see where the bus is?",
        "a": "Yes, live, in the app."
      },
      {
        "q": "Are parents told at each stop?",
        "a": "Yes, through pickup and drop notifications."
      },
      {
        "q": "Are parents alerted?",
        "a": "Yes, at pickup and drop."
      },
      {
        "q": "Can we manage drivers and vehicles here?",
        "a": "Yes. Driver, attendant and vehicle records are kept in one place."
      }
    ],
    "next": [
      "Communication Management",
      "Academic Inventory Tracking",
      "Book a demo"
    ]
  },
  "performance-insights": {
    "seoTitle": "School Performance Analytics Dashboard",
    "metaDescription": "Cross-module dashboards for academics, attendance, fees and staff, with cohort comparison and early warnings. Book a free demo.",
    "headline": "See how your whole school is performing.",
    "answer": "Performance Insights pulls academics, attendance, fee collection and staff data into one dashboard, compares classes, subjects and years, and flags at-risk students early, so leaders decide from facts instead of separate reports.",
    "purpose": "Performance Insights gives leaders one view across academics, attendance, fee collection and staff, so they can compare, spot trouble early and decide from facts.",
    "problem": "Standard reports show one area at a time. Comparing sections or years takes manual work. Struggling students are noticed late, after the damage is done.",
    "seeInside": [
      "Dashboards that combine academics, attendance, fees and staff.",
      "Academic trends by class and subject.",
      "Health scores for attendance and fee collection.",
      "Staff benchmarking.",
      "Custom KPIs you define.",
      "Insights exported for management reviews."
    ],
    "howTo": [
      {
        "stage": "Set up once",
        "steps": [
          "Choose the dashboards you want for each leader.",
          "Define your own KPIs, the numbers that matter to your school."
        ]
      },
      {
        "stage": "Every week",
        "steps": [
          "Open the school-wide view and read the headline figures.",
          "Compare cohorts: sections, subjects and years side by side.",
          "Check the health scores for attendance and fee collection.",
          "Read the early warnings and decide who needs help."
        ]
      },
      {
        "stage": "Every term",
        "steps": [
          "Benchmark staff performance.",
          "Export insights for the management review."
        ]
      }
    ],
    "example": "Example: Class 7 maths results fall two terms in a row while attendance dips. An early warning flags the section; the coordinator speaks to the teacher and the families before the exams.",
    "roles": [
      {
        "who": "School owners and principals",
        "what": "review the whole school."
      },
      {
        "who": "Coordinators",
        "what": "compare sections and subjects."
      }
    ],
    "outputs": "A decision-ready view of the whole school, trends by class and subject, early warnings for students at risk, and exports for meetings.",
    "connects": "Academic & Examination, Attendance, Fee Management, Staff Management and Reports & Analytics.",
    "tips": [],
    "faqs": [
      {
        "q": "How is this different from the standard reports?",
        "a": "Standard reports cover one area. This brings them together and compares them."
      },
      {
        "q": "Can it show which students need help?",
        "a": "Yes, early warnings flag at-risk students."
      },
      {
        "q": "Can we share it?",
        "a": "Yes, insights export for management reviews."
      },
      {
        "q": "Can we track our own measures?",
        "a": "Yes, with custom KPIs."
      }
    ],
    "next": [
      "AI Secretary",
      "Academic & Examination",
      "Book a demo"
    ]
  },
  "ai-secretary": {
    "seoTitle": "AI Secretary for School Management",
    "metaDescription": "Ask questions in plain language and get answers from your own school data, plus daily briefings, alerts and drafted notices.",
    "headline": "Ask your school a question. Get the answer.",
    "answer": "AI Secretary is an assistant built for school management. A principal asks in plain language, for example how many students were absent today, and gets an answer from the school's own data. It also sends daily and weekly briefings, flags unusual changes, drafts notices and circulars, and answers routine parent questions.",
    "purpose": "AI Secretary lets the people who run the school ask for what they need in plain language, and get it from the school's own data, without opening a report or waiting for someone to prepare one.",
    "problem": "One answer means opening several reports. Notices take time to draft. Parents ask the same routine questions, again and again.",
    "seeInside": [
      "A plain-language question box across your school data.",
      "Instant answers on attendance, fees and admissions.",
      "A daily or weekly briefing waiting for you.",
      "Alerts when something changes, such as a drop in attendance.",
      "Notices and circulars drafted in seconds.",
      "Routine parent questions answered automatically."
    ],
    "howTo": [
      {
        "stage": "Getting started",
        "steps": [
          "Open the management app and go to AI Secretary.",
          "Ask a question in your own words, about attendance, fees, admissions and more.",
          "Read the answer, which comes from your school's data."
        ]
      },
      {
        "stage": "Every day",
        "steps": [
          "Read the briefing waiting for you each morning, daily or weekly as you choose.",
          "Act on an alert when something unusual happens, such as an attendance drop.",
          "Draft a notice. Ask it to write a notice or circular, edit it, and send it through Communication Management."
        ]
      },
      {
        "stage": "For parents",
        "steps": [
          "Routine parent questions are answered automatically, so the front office is free for the ones that need a person."
        ]
      }
    ],
    "example": "Example: a principal types, \"How many students were absent today?\" and sees a count. She then asks about fee collection for the month, and then asks it to draft a notice about a holiday.",
    "roles": [
      {
        "who": "Principals and school owners",
        "what": "ask questions and read briefings."
      },
      {
        "who": "Administrators",
        "what": "draft notices and circulars."
      }
    ],
    "outputs": "Answers in seconds, briefings without effort, early warning of changes and notices drafted for you.",
    "connects": "Attendance, Fee Management, Admissions, Communication Management (notices go out through it), and Performance Insights.",
    "tips": [
      "Be specific about the date, class or area (\"today\", \"this month\", \"Class 7\").",
      "Ask one thing at a time; then ask the next.",
      "Treat a draft notice as a first draft and review it before it goes out."
    ],
    "faqs": [
      {
        "q": "What can I ask?",
        "a": "Questions about attendance, fees, admissions and more, in plain language."
      },
      {
        "q": "Can it write notices?",
        "a": "Yes, it drafts notices and circulars in seconds."
      },
      {
        "q": "Where do I use it?",
        "a": "Inside the management app."
      },
      {
        "q": "Does it use my school's own data?",
        "a": "Yes, answers come from your own data."
      }
    ],
    "next": [
      "Performance Insights",
      "Communication Management",
      "Book a demo"
    ]
  }
};
