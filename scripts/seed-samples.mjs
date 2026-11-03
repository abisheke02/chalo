// Tops up each content section to five items with clearly labelled samples (every title starts with "Sample:"),
// so the pages are not empty while the real content is being written. Nothing here is a real customer, number or claim.
// Items are created only if their address (slug) is missing, so running it twice changes nothing, and it never edits real content.
// Usage: node scripts/seed-samples.mjs        (uses DATABASE_URL, like the site does)
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();
const day = (s) => new Date(`${s}T09:00:00.000Z`);
const NOTE = '\n\n_This is sample text, shown so the page is not empty. Replace it in the admin before launch._';

const blogs = [
  ['sample-plan-a-school-timetable-without-clashes', 'Sample: How to Plan a School Timetable Without Clashes', 'Timetable', '2026-10-30',
    'A timetable clashes when a teacher, a room or a class is booked twice. Here is a simple order of work that avoids it, and where software helps.',
    '## Start with the fixed things\n\nList the periods in a day, the rooms and labs, and which teachers are available on which days. Anything that cannot move goes in first.\n\n## Place the heavy subjects early\n\nSubjects that need a lab or a long block are hardest to place, so schedule them before the flexible ones.\n\n## Balance the load\n\nCheck that no teacher has too many periods in a row and that no class has the same subject at the same hour every day.\n\n## Plan for absences\n\nDecide in advance who covers when a teacher is away. A short list of available teachers for each period saves a scramble every morning.\n\nA timetable tool can check these rules for you and suggest a substitute when something changes.'],
  ['sample-checklist-for-online-admissions', 'Sample: A Simple Checklist for Online Admissions', 'Admissions', '2026-10-27',
    'Moving admissions online is easier with a clear list: the form, the documents, the follow-up and the handover to the student record.',
    '## The enquiry\n\nRecord every enquiry in one place, with the date, the class asked for and how the family heard about you.\n\n## The application form\n\nKeep it short. Ask only for what you will use, and let parents upload documents instead of bringing copies.\n\n## Verify the documents\n\nDecide who checks which document, and record the result so nobody checks twice.\n\n## Follow up\n\nA reminder after two or three days keeps most enquiries from going cold.\n\n## Enrol\n\nWhen a family accepts, the application should become the student record without anyone typing the details again.'],
  ['sample-five-ways-to-cut-paperwork-in-a-school-office', 'Sample: Five Ways to Cut Paperwork in a School Office', 'Administration', '2026-10-24',
    'Registers, receipt books and photocopies take hours every week. These five changes remove most of the repeat work.',
    '## 1. Mark attendance once\n\nA single entry should serve the register, the parent alert and the report.\n\n## 2. Issue receipts automatically\n\nWhen a fee is paid, the receipt should be made and sent without anyone writing it.\n\n## 3. Keep one student record\n\nAddress, documents and fee status belong in one place, not three registers.\n\n## 4. Send notices from one place\n\nOne message to the right class replaces a phone tree.\n\n## 5. Produce reports from the same data\n\nIf reports come from the records you already keep, nobody rebuilds them in a spreadsheet.'],
  ['sample-keeping-parents-informed', 'Sample: Keeping Parents Informed Without Ten WhatsApp Groups', 'Communication', '2026-10-21',
    'Parents want to know what is happening at school. A single official channel works better than many separate groups.',
    '## The problem with many groups\n\nMessages get lost, the same notice is posted more than once, and nobody can tell who has seen it.\n\n## One official channel\n\nPut notices, homework and fee reminders where parents already look, and keep private chats for private matters.\n\n## Send to the right people\n\nA notice for Class 6B should reach Class 6B only. Targeting by class or section keeps messages relevant.\n\n## Know it was received\n\nDelivery tracking tells you who has not seen an important notice, so you can follow up.'],
  ['sample-what-to-ask-before-choosing-a-school-erp', 'Sample: What to Ask Before Choosing a School ERP', 'School ERP', '2026-10-18',
    'A school ERP touches every department. These questions help you compare options on what matters to your school.',
    '## What will it replace?\n\nList the registers, spreadsheets and tools in use today, and ask which of them the system takes over.\n\n## Who will use it every day?\n\nTeachers and the front office use it most. Ask them to try it, not only the person buying it.\n\n## How does it handle your board and your reports?\n\nAsk to see your own report card format, not a demo one.\n\n## What happens to our existing data?\n\nAsk how records are moved in, who does it and how long it takes.\n\n## How is data protected?\n\nAsk about access by role, an audit trail and how data is stored.'],
];

const cases = [
  ['sample-case-study-multi-branch-group', 'Sample case study: A multi-branch school group', 'Sample School Group', 'To be added', 'CBSE', '2026-10-15',
    'A sample story about a school group that moved admissions and fees onto one system.',
    '## The situation\n\nA group of schools kept admissions and fees in separate registers at each branch.\n\n## What changed\n\nAdmissions and fees moved into one system, with each branch seeing its own data and the office seeing all of it.\n\n## What the school says\n\nTo be added once a real school gives permission.'],
  ['sample-case-study-small-school-timetable', 'Sample case study: A small school and its timetable', 'Sample School', 'To be added', 'State Board', '2026-10-12',
    'A sample story about a small school that stopped building its timetable by hand.',
    '## The situation\n\nThe timetable took days to build and broke whenever a teacher was away.\n\n## What changed\n\nThe timetable is now generated from the school\'s own rules, with suggested substitutes when someone is absent.\n\n## What the school says\n\nTo be added once a real school gives permission.'],
  ['sample-case-study-parent-communication', 'Sample case study: One channel for parent notices', 'Sample International School', 'To be added', 'Cambridge', '2026-10-09',
    'A sample story about a school that replaced many parent groups with one channel.',
    '## The situation\n\nNotices went out through many separate chat groups, and parents missed some of them.\n\n## What changed\n\nNotices now go from one place to the right class, with delivery tracking.\n\n## What the school says\n\nTo be added once a real school gives permission.'],
];

const news = [
  ['sample-news-new-resources-hub', 'Sample: A new home for our articles and updates', 'Company News', '2026-10-30', 'Blogs, case studies, news, webinars and release notes now sit together on one page.',
    'Our articles, news and webinars now live in one place, with tabs to filter them and a search box to find what you need.'],
  ['sample-news-product-update-note', 'Sample: How we publish product updates', 'Product Update', '2026-10-26', 'Product changes are now listed with their date and version on the release notes page.',
    'Every product change is listed on the release notes page, with a version and a date, so schools can see what changed and when.'],
];

const webinars = [
  ['sample-webinar-timetables-and-substitutions', 'Sample: Timetables and Substitutions Made Simple', 'A live session on building a timetable and handling teacher absences. Speaker and date to be confirmed.', 'To be confirmed', 'Academic Coordinator', '2026-11-20', '45 min'],
  ['sample-webinar-fee-collection', 'Sample: Fee Collection Without the Chasing', 'A live session on fee reminders, receipts and reconciliation. Speaker and date to be confirmed.', 'To be confirmed', 'Finance Lead', '2026-11-27', '40 min'],
  ['sample-webinar-parent-communication', 'Sample: Talking to Parents in One Place', 'A live session on targeted notices and delivery tracking. Speaker and date to be confirmed.', 'To be confirmed', 'Customer Success', '2026-12-04', '40 min'],
];

const releases = [
  ['sample-release-v3-3-0', 'Sample: Resources hub', '3.3.0', 'Feature', '2026-10-30', '- New: one page for blogs, case studies, news, webinars and release notes\n- New: search and tabs on the resources page'],
  ['sample-release-v3-2-5', 'Sample: Admin editor improvements', '3.2.5', 'Improvement', '2026-10-22', '- Improved: length hints for titles and descriptions in the admin\n- Fixed: long titles are no longer cut in the post list'],
];

const helpDocs = [
  ['sample-help-getting-started', 'Sample: Getting started with ChaloSchools', 'Getting Started', 10, '## First steps\n\n1. Sign in with the email your school gave you.\n2. Open the module you need from the menu.\n3. Ask your administrator for access to anything you cannot see.'],
  ['sample-help-marking-attendance', 'Sample: Marking attendance', 'Attendance', 11, '## Mark a class\n\nOpen Attendance, choose the class and mark the absent students. Parents of absent students are notified.'],
  ['sample-help-collecting-fees', 'Sample: Collecting a fee payment', 'Fees', 12, '## Record a payment\n\nOpen Fees, find the student, choose the payment mode and save. A receipt is made for you.'],
  ['sample-help-sending-a-notice', 'Sample: Sending a notice to parents', 'Communication', 13, '## Send a notice\n\nOpen Communication, choose the class or section, write the message and send. You can see who has received it.'],
  ['sample-help-adding-a-student', 'Sample: Adding a student record', 'Students', 14, '## Add a student\n\nOpen Student Management, choose Add, fill in the details and attach documents. The record is available to every module.'],
];

// More samples, so every section can reach five.
cases.push(
  ['sample-case-study-fee-reminders', 'Sample case study: Fee reminders that run themselves', 'Sample Matric School', 'To be added', 'Matric', '2026-10-06',
    'A sample story about a school that stopped chasing fees by phone.',
    '## The situation\n\nThe office phoned parents one by one about pending fees.\n\n## What changed\n\nReminders now go out automatically until the fee is paid, and receipts are made on payment.\n\n## What the school says\n\nTo be added once a real school gives permission.'],
  ['sample-case-study-montessori-records', 'Sample case study: Observation records in a Montessori school', 'Sample Montessori School', 'To be added', 'Montessori', '2026-10-03',
    'A sample story about a school that records activities and milestones instead of marks.',
    '## The situation\n\nTeachers kept observation notes on paper and shared them only at meetings.\n\n## What changed\n\nActivities and milestones are recorded as they happen, and shared with parents in the app.\n\n## What the school says\n\nTo be added once a real school gives permission.'],
);
news.push(
  ['sample-news-webinar-series', 'Sample: A series of short live sessions is planned', 'Event', '2026-10-23', 'We are planning short live sessions on timetables, fees and parent communication. Dates to be confirmed.',
    'We are planning short live sessions for school leaders. Topics and dates will be announced here.'],
  ['sample-news-demo-days', 'Sample: Book a demo at a time that suits you', 'Company News', '2026-10-20', 'Schools can book a walkthrough of the modules they care about most.',
    'Choose the modules you want to see, and book a walkthrough with our team at a time that suits you.'],
  ['sample-news-help-centre', 'Sample: Help articles for everyday tasks', 'Product Update', '2026-10-17', 'Short guides now explain everyday tasks such as marking attendance and sending notices.',
    'Short, step-by-step guides explain the tasks staff do every day.'],
);
webinars.push(
  ['sample-webinar-digital-admissions', 'Sample: Digital Admissions, Step by Step', 'A live session on taking applications online and following them to enrolment. Speaker and date to be confirmed.', 'To be confirmed', 'Admissions Lead', '2026-12-11', '45 min'],
  ['sample-webinar-reports-for-leaders', 'Sample: Reports School Leaders Actually Use', 'A live session on dashboards and reports for principals and owners. Speaker and date to be confirmed.', 'To be confirmed', 'Product Lead', '2026-12-18', '40 min'],
);
releases.push(
  ['sample-release-v3-2-4', 'Sample: Video links', '3.2.4', 'Feature', '2026-10-15', '- New: add product videos by YouTube or Vimeo link\n- Improved: webinar pages play pasted watch links'],
  ['sample-release-v3-2-3', 'Sample: Solutions pages', '3.2.3', 'Feature', '2026-10-08', '- New: a clearer layout for the board and role pages\n- Improved: each page lists the modules it uses'],
  ['sample-release-v3-2-2', 'Sample: Menu details', '3.2.2', 'Improvement', '2026-10-01', '- New: a short line under each link in the Company, Solutions and Resources menus'],
);

const TARGET = 5; // a section with fewer published items than this is topped up to it; a section with enough is left alone

let made = 0;
async function once(model, slug, data) {
  if ((await db[model].count({ where: { published: true } })) >= TARGET) return;
  if (await db[model].findUnique({ where: { slug } })) return;
  await db[model].create({ data: { slug, ...data } });
  made++;
}

for (const [slug, title, category, d, excerpt, body] of blogs)
  await once('blogPost', slug, { title, category, excerpt, content: body + NOTE, author: 'ChaloSchools Team', published: true, publishedAt: day(d), createdAt: day(d) });
for (const [slug, title, schoolName, location, board, d, excerpt, body] of cases)
  await once('caseStudy', slug, { title, schoolName, location, board, excerpt, content: body + NOTE, published: true, createdAt: day(d) });
for (const [slug, title, category, d, excerpt, body] of news)
  await once('newsEvent', slug, { title, category, excerpt, content: body + NOTE, eventDate: day(d), published: true, createdAt: day(d) });
for (const [slug, title, description, speaker, speakerTitle, d, duration] of webinars)
  await once('webinar', slug, { title, description, content: description + NOTE, speaker, speakerTitle, date: day(d), duration, published: true, createdAt: day(d) });
for (const [slug, title, version, type, d, body] of releases)
  await once('releaseNote', slug, { title, version, type, content: body + NOTE, releaseDate: day(d), published: true, createdAt: day(d) });
for (const [slug, title, category, order, body] of helpDocs)
  await once('helpDoc', slug, { title, category, order, content: body + NOTE, published: true });

const counts = {};
for (const m of ['blogPost', 'caseStudy', 'newsEvent', 'webinar', 'releaseNote', 'helpDoc', 'testimonial', 'fAQ']) counts[m] = await db[m].count({ where: { published: true } });
console.log('created', made, 'published now:', counts);
await db.$disconnect();
