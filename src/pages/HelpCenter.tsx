import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, Book, HelpCircle, FileText, MessageSquare } from 'lucide-react';

const HelpCenter: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Mock FAQs
  const faqs = [
    {
      id: 1,
      question: 'Do I need to register for Self Assessment?',
      answer: 'You need to register for Self Assessment if you\'re self-employed as a sole trader and earned more than £1,000, you\'re a partner in a business partnership, you have income from renting out a property, or you have other untaxed income. You\'ll need to register by 5 October after the end of the tax year where you had untaxed income.',
    },
    {
      id: 2,
      question: 'What expenses can I claim on my Self Assessment?',
      answer: 'You can claim expenses that are "wholly and exclusively" for business purposes. This can include office costs, travel expenses, clothing (if it\'s a uniform), staff costs, things you buy to sell on, financial costs, costs of your business premises, advertising or marketing, and training courses related to your business.',
    },
    {
      id: 3,
      question: 'When is the deadline for submitting my tax return?',
      answer: 'For online submissions, the deadline is 31 January after the end of the tax year. For paper returns, it\'s 31 October. For the 2023/24 tax year, online returns must be submitted by 31 January 2025.',
    },
    {
      id: 4,
      question: 'How do I pay my Self Assessment tax bill?',
      answer: 'You can pay your Self Assessment tax bill online using a debit card, via bank transfer, through your bank or building society, with a cheque through the post, or via your HMRC online account if you have one. Payment is usually due by 31 January for any tax you owe for the previous tax year and your first payment on account.',
    },
    {
      id: 5,
      question: 'What happens if I miss the deadline?',
      answer: 'If you miss the deadline for submitting your tax return, you\'ll receive an automatic penalty of £100 if your return is up to 3 months late. If it\'s later than that, you could face additional penalties and interest charges. It\'s always best to submit on time, but if you\'re going to be late, it\'s better to submit as soon as possible to minimize penalties.',
    },
  ];

  // Mock guides
  const guides = [
    { id: 1, title: 'Self Assessment for Beginners', description: 'A step-by-step guide for first-time filers', icon: Book },
    { id: 2, title: 'Understanding Allowable Expenses', description: 'Learn what you can and can\'t claim', icon: FileText },
    { id: 3, title: 'Tax Deadlines and Penalties', description: 'Important dates and consequences for missing them', icon: FileText },
    { id: 4, title: 'Using TaxAssist Effectively', description: 'Get the most out of our platform', icon: HelpCircle },
  ];

  // Filter FAQs based on search term
  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle FAQ expansion
  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Help Center</h1>
        <p className="text-gray-600">Find answers and learn more about Self Assessment tax returns.</p>
      </div>

      {/* Search Box */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for answers, guides, and resources..."
            className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* FAQs */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => (
                  <div 
                    key={faq.id} 
                    className="border border-gray-200 rounded-md overflow-hidden"
                  >
                    <button
                      className="w-full text-left px-4 py-3 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:bg-gray-50"
                      onClick={() => toggleFaq(faq.id)}
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      {expandedFaq === faq.id ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    
                    {expandedFaq === faq.id && (
                      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                        <p className="text-gray-700">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <HelpCircle className="mx-auto h-10 w-10 text-gray-400" />
                  <p className="mt-2 text-gray-500">No results found for "{searchTerm}"</p>
                  <p className="text-gray-500 text-sm">Try searching for something else or browse our guides.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="md:col-span-1">
          {/* Guides */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Guides & Resources</h2>
            
            <div className="space-y-4">
              {guides.map((guide) => (
                <a 
                  key={guide.id} 
                  href="#" 
                  className="block p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <guide.icon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900">{guide.title}</h3>
                      <p className="mt-1 text-xs text-gray-500">{guide.description}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
            
            <a 
              href="#" 
              className="mt-4 block text-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              View all guides
            </a>
          </div>
          
          {/* Contact Support */}
          <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-100">
            <h2 className="text-lg font-medium text-indigo-900 mb-2">Need More Help?</h2>
            <p className="text-sm text-indigo-700 mb-4">
              If you can\'t find what you\'re looking for, our support team is here to help.
            </p>
            <a 
              href="#" 
              className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;