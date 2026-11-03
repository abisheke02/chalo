'use client';

import { useState, useEffect, useRef } from 'react';

import Link from 'next/link';

import { MessageSquare, X, Send, Bot, User, ArrowRight } from 'lucide-react';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

import { Button } from '@/components/ui/button';

interface FAQItem {

  id: string;

  question: string;

  answer: string;

  category: string;

}

interface Message {

  id: string;

  role: 'bot' | 'user';

  text: string;

}

const QUICK_REPLIES = [

  'What is ChaloSchools?',

  'What features do you offer?',

  'How much does it cost?',

  'How do I book a demo?',

  'Which boards do you support?',

  'Is my data secure?',

];

// Built-in answers for common queries that may not be in the FAQ database

const BUILT_IN_ANSWERS: Record<string, string> = {

  'what is chaloschools': 'ChaloSchools is a complete School Management Software (School ERP) by Inspace Edu Solutions Pvt. Ltd. It handles all school operations — admissions, fees, attendance, timetable, exams, parent communication, transport, library, HR, and more. We\'re ISO 27001:2022 certified and built specifically for Indian schools.',

  'how much does it cost': 'Our pricing is customized based on your school size and modules needed. We offer flexible plans for schools of all sizes. The best way to get accurate pricing is to book a free demo — our team will put together a proposal tailored to your needs. Visit /contact to request one!',

  'pricing': 'Our pricing is customized based on your school size and modules needed. Book a free demo at /contact and our team will share a tailored quote.',

  'how do i book a demo': 'You can book a free demo by visiting our Contact page (/contact) and filling out the form. Our team will reach out within 24 hours to schedule a personalized walkthrough. You can also call us directly at +91 99622 28160.',

  'demo': 'Book a free demo at /contact — our team responds within 24 hours. Or call +91 99622 28160 for immediate assistance.',

  'which boards do you support': 'ChaloSchools supports all major Indian boards: CBSE, ICSE, IB, Cambridge (IGCSE), State Boards, Matriculation, and Montessori curriculum. Our system is flexible enough to handle multi-board schools too.',

  'boards supported': 'We support CBSE, ICSE, IB, Cambridge, State Boards, Matriculation, and Montessori. Multi-board schools are fully supported.',

  'is my data secure': 'Absolutely. We\'re an ISO 27001:2022 certified company. Your data is encrypted in transit and at rest, access is role-controlled, and we conduct regular security audits. We never sell or share your data with third parties.',

  'data security': 'Yes — we\'re ISO 27001:2022 certified. Data is encrypted, access-controlled, and regularly audited. We never sell your data.',

  'features': 'ChaloSchools has 14 modules (Admissions, Student, Staff, Fees, Timetable, Attendance, Exams, Communication, Inventory, Payroll, Library, Transport, Performance Insights and AI Secretary) and 5 integrations (biometric attendance, GPS fleet tracking, Tally, online payments and WhatsApp), plus Reports & Analytics and the parent, teacher and management apps. Visit /product for a full tour!',

  'what features': 'We offer 14 integrated modules and 5 integrations, including Admissions, Fees, Attendance, Timetable, Exams, Payroll, Library, Transport, AI Secretary, and Tally, biometric, GPS, payment and WhatsApp integrations. Check /product for the full tour.',

  'contact': 'You can reach us at:\n• Phone: +91 99622 28160\n• Email: enquiry@chaloschools.com\n• Office: Chennai, Tamil Nadu\n• Or fill the form at /contact',

  'phone number': 'Our helpline is +91 99622 28160. You can also WhatsApp us at the same number!',

  'hello': 'Hello! 👋 Welcome to ChaloSchools. I can help you with information about our features, pricing, demo booking, and more. What would you like to know?',

  'hi': 'Hi there! 👋 How can I help you today? Ask me about ChaloSchools features, pricing, demo booking, or anything else!',

  'thanks': 'You\'re welcome! If you have more questions, feel free to ask. You can also book a free demo at /contact or call us at +91 99622 28160.',

  'thank you': 'Happy to help! Let me know if there\'s anything else I can assist with.',

};

function generateId() {

  return Math.random().toString(36).substring(2, 10);

}

function escapeRegExp(s: string): string {

  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

}

function findBestMatch(query: string, faqs: FAQItem[]): string | null {

  const normalizedQuery = query.toLowerCase().trim();

  // 1. Check built-in answers — match on whole words only (not arbitrary substrings,

  // e.g. "which" must not match the "hi" key just because it contains those letters),

  // and prefer the longest/most specific matching key rather than whichever happens

  // to be declared first in the object.

  let bestBuiltInKey: string | null = null;

  for (const key of Object.keys(BUILT_IN_ANSWERS)) {

    const isMatch =

      normalizedQuery === key ||

      new RegExp(`\\b${escapeRegExp(key)}\\b`).test(normalizedQuery);

    if (isMatch && (!bestBuiltInKey || key.length > bestBuiltInKey.length)) {

      bestBuiltInKey = key;

    }

  }

  if (bestBuiltInKey) {

    return BUILT_IN_ANSWERS[bestBuiltInKey];

  }

  // 2. Search FAQs by keyword overlap

  if (faqs.length === 0) return null;

  const queryWords = normalizedQuery

    .replace(/[?!.,]/g, '')

    .split(/\s+/)

    .filter((w) => w.length > 2); // Ignore very short words

  let bestFaq: FAQItem | null = null;

  let bestScore = 0;

  for (const faq of faqs) {

    const faqText = `${faq.question} ${faq.category}`.toLowerCase();

    let score = 0;

    for (const word of queryWords) {

      if (faqText.includes(word)) {

        score += 1;

      }

    }

    // Bonus for question containing the full query

    if (faq.question.toLowerCase().includes(normalizedQuery)) {

      score += 3;

    }

    if (score > bestScore) {

      bestScore = score;

      bestFaq = faq;

    }

  }

  // Only return if we have a reasonable match (at least 2 keyword hits or 1 full-phrase match)

  if (bestFaq && bestScore >= 2) {

    return bestFaq.answer;

  }

  return null;

}

export default function ChatBot() {

  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState<Message[]>([

    {

      id: 'welcome',

      role: 'bot',

      text: 'Hi! 👋 I\'m the ChaloSchools assistant. I can answer questions about our features, pricing, demo booking, and more. How can I help you?',

    },

  ]);

  const [input, setInput] = useState('');

  const [faqs, setFaqs] = useState<FAQItem[]>([]);

  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch FAQs on mount

  useEffect(() => {

    async function fetchFAQs() {

      try {

        const res = await fetch('/api/faqs');

        if (res.ok) {

          const data = await res.json();

          setFaqs(data);

        }

      } catch {

        // Silently fail

      }

    }

    fetchFAQs();

  }, []);

  // Auto-scroll to bottom

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  }, [messages, isTyping]);

  function handleSend(text?: string) {

    const query = (text || input).trim();

    if (!query) return;

    const userMsg: Message = { id: generateId(), role: 'user', text: query };

    setMessages((prev) => [...prev, userMsg]);

    setInput('');

    setIsTyping(true);

    // Simulate a brief typing delay

    setTimeout(() => {

      const answer = findBestMatch(query, faqs);

      const botMsg: Message = {

        id: generateId(),

        role: 'bot',

        text: answer || 'I\'m not sure about that one. For detailed questions, I\'d recommend booking a free demo with our team — they can walk you through everything! Visit /contact or call +91 99622 28160.',

      };

      setMessages((prev) => [...prev, botMsg]);

      setIsTyping(false);

    }, 600 + Math.random() * 400);

  }

  function handleKeyDown(e: React.KeyboardEvent) {

    if (e.key === 'Enter' && !e.shiftKey) {

      e.preventDefault();

      handleSend();

    }

  }

  const reduce = useReducedMotion();

  return (

    <>

      {/* Chat toggle button */}

      <AnimatePresence>

      {!isOpen && (

        <motion.button

          onClick={() => setIsOpen(true)}

          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.5, y: 20 }}

          animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}

          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.5, y: 20 }}

          transition={{ type: 'spring', stiffness: 280, damping: 22 }}

          whileHover={reduce ? undefined : { scale: 1.1 }}

          whileTap={reduce ? undefined : { scale: 0.95 }}

          className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full bg-[#026dde] hover:bg-[#0258b8] shadow-lg hover:shadow-xl flex items-center justify-center group"

          aria-label="Open chat assistant"

        >

          {!reduce && <span className="absolute -inset-2 rounded-full border border-[#026dde]/30 pulse-dot" />}

          <MessageSquare className="w-6 h-6 text-white relative" />

          {/* Notification dot */}

          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#f59e0b] rounded-full border-2 border-white" />

        </motion.button>

      )}

      {/* Chat window */}

      {isOpen && (

        <motion.div

          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20 }}

          animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}

          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20 }}

          transition={{ type: 'spring', stiffness: 260, damping: 22 }}

          className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-6rem)] bg-card rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden">

          {/* Header */}

          <div className="bg-gradient-to-r from-[#026dde] to-[#0258b8] px-5 py-4 flex items-center justify-between shrink-0">

            <div className="flex items-center gap-3">

              <div className="w-9 h-9 rounded-full bg-card/20 flex items-center justify-center">

                <Bot className="w-5 h-5 text-white" />

              </div>

              <div>

                <p className="text-sm font-semibold text-white">ChaloSchools Assistant</p>

                <p className="text-[11px] text-white/70">Ask me anything about our platform</p>

              </div>

            </div>

            <button

              onClick={() => setIsOpen(false)}

              className="w-8 h-8 rounded-full bg-card/10 hover:bg-card/20 flex items-center justify-center transition-colors"

              aria-label="Close chat"

            >

              <X className="w-4 h-4 text-white" />

            </button>

          </div>

          {/* Messages */}

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-2">

            {messages.map((msg) => (

              <div key={msg.id} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>

                {msg.role === 'bot' && (

                  <div className="w-7 h-7 rounded-full bg-[#026dde]/10 flex items-center justify-center shrink-0 mt-0.5">

                    <Bot className="w-3.5 h-3.5 text-primary" />

                  </div>

                )}

                <div

                  className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${

                    msg.role === 'user'

                      ? 'bg-[#026dde] text-white rounded-br-md'

                      : 'bg-card text-body border border-border shadow-sm rounded-bl-md'

                  }`}

                >

                  {msg.text}

                </div>

                {msg.role === 'user' && (

                  <div className="w-7 h-7 rounded-full bg-[#f59e0b]/10 flex items-center justify-center shrink-0 mt-0.5">

                    <User className="w-3.5 h-3.5 text-[#f59e0b]" />

                  </div>

                )}

              </div>

            ))}

            {isTyping && (

              <div className="flex gap-2.5 justify-start">

                <div className="w-7 h-7 rounded-full bg-[#026dde]/10 flex items-center justify-center shrink-0">

                  <Bot className="w-3.5 h-3.5 text-primary" />

                </div>

                <div className="bg-card border border-border shadow-sm px-4 py-3 rounded-2xl rounded-bl-md">

                  <div className="flex gap-1">

                    <span className="w-2 h-2 bg-[#026dde]/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />

                    <span className="w-2 h-2 bg-[#026dde]/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />

                    <span className="w-2 h-2 bg-[#026dde]/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />

                  </div>

                </div>

              </div>

            )}

            <div ref={messagesEndRef} />

          </div>

          {/* Quick Replies */}

          {messages.length <= 2 && (

            <div className="px-4 py-2 border-t border-border bg-card shrink-0">

              <p className="text-[10px] text-subtle uppercase tracking-wider font-medium mb-2">Quick questions</p>

              <div className="flex flex-wrap gap-1.5">

                {QUICK_REPLIES.map((qr) => (

                  <button

                    key={qr}

                    onClick={() => handleSend(qr)}

                    className="text-[11px] font-medium px-2.5 py-1.5 rounded-full border border-[#026dde]/20 text-primary hover:bg-[#026dde]/5 transition-colors"

                  >

                    {qr}

                  </button>

                ))}

              </div>

            </div>

          )}

          {/* Input */}

          <div className="px-4 py-3 border-t border-border bg-card shrink-0">

            <div className="flex items-center gap-2">

              <input

                type="text"

                value={input}

                onChange={(e) => setInput(e.target.value)}

                onKeyDown={handleKeyDown}

                placeholder="Type your question..."

                className="flex-1 text-sm px-3.5 py-2.5 rounded-xl border border-border focus:border-[#026dde] focus:ring-1 focus:ring-[#026dde]/20 outline-none transition-all placeholder:text-subtle"

              />

              <button

                onClick={() => handleSend()}

                disabled={!input.trim()}

                className="w-9 h-9 rounded-xl bg-[#026dde] hover:bg-[#0258b8] disabled:bg-muted disabled:cursor-not-allowed flex items-center justify-center transition-colors"

                aria-label="Send message"

              >

                <Send className="w-4 h-4 text-white" />

              </button>

            </div>

            <p className="text-[10px] text-subtle mt-2 text-center">

              For complex queries, <Link href="/contact#contact-form" className="text-primary hover:underline">book a free demo</Link> or call +91 99622 28160

            </p>

          </div>

        </motion.div>

      )}

      </AnimatePresence>

    </>

  );

}
