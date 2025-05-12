import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Upload, Calculator, CheckCircle, Shield } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-200">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="text-xl font-heading font-bold text-neutral-800">
            Pocketax
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-sm font-medium text-neutral-800 hover:text-primary-600"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-neutral-800 mb-6">
              Self Assessment Tax Returns Made Simple
            </h1>
            <p className="text-lg text-neutral-800 mb-8 max-w-2xl mx-auto">
              Upload your business statements, add your income and expenses, and let Pocketax guide you through your tax return submission.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600"
            >
              Start Your Tax Return
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-neutral-200">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="text-3xl font-heading font-bold text-neutral-800 mb-12 text-center">
            How Pocketax Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mb-4">
                <Upload className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-heading font-medium text-neutral-800 mb-2">
                Upload Statements
              </h3>
              <p className="text-neutral-800">
                Simply upload your bank statements and invoices. We'll automatically categorize your transactions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mb-4">
                <Calculator className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-heading font-medium text-neutral-800 mb-2">
                Review & Calculate
              </h3>
              <p className="text-neutral-800">
                Check your income and expenses, then let us calculate your tax liability automatically.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mb-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-heading font-medium text-neutral-800 mb-2">
                Submit with Confidence
              </h3>
              <p className="text-neutral-800">
                Follow our step-by-step guide to submit your return to HMRC with complete peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-neutral-800 mb-12 text-center">
              Why Choose Pocketax?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Shield className="h-6 w-6 text-primary-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-heading font-medium text-neutral-800 mb-2">
                    Secure & Reliable
                  </h3>
                  <p className="text-neutral-800">
                    Your data is protected with bank-level security. We never store your banking credentials.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Calculator className="h-6 w-6 text-primary-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-heading font-medium text-neutral-800 mb-2">
                    Accurate Calculations
                  </h3>
                  <p className="text-neutral-800">
                    Our smart algorithms ensure your tax calculations are always accurate and up-to-date.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Upload className="h-6 w-6 text-primary-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-heading font-medium text-neutral-800 mb-2">
                    Easy Import
                  </h3>
                  <p className="text-neutral-800">
                    Support for all major UK banks and accounting software. Import your data in seconds.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-primary-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-heading font-medium text-neutral-800 mb-2">
                    Step-by-Step Guidance
                  </h3>
                  <p className="text-neutral-800">
                    Clear instructions and helpful tips guide you through every step of the process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-500">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl font-heading font-bold text-white mb-4">
            Ready to simplify your tax return?
          </h2>
          <p className="text-lg text-white mb-8 max-w-2xl mx-auto">
            Join thousands of self-employed professionals who trust Pocketax for their tax returns.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-primary-600 bg-white hover:bg-gray-50"
          >
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-heading font-medium text-neutral-800 mb-4">About</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-neutral-800 hover:text-primary-600">
                    Company
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-800 hover:text-primary-600">
                    Team
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-800 hover:text-primary-600">
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-heading font-medium text-neutral-800 mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-neutral-800 hover:text-primary-600">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-800 hover:text-primary-600">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-800 hover:text-primary-600">
                    Security
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-heading font-medium text-neutral-800 mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-neutral-800 hover:text-primary-600">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-800 hover:text-primary-600">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-800 hover:text-primary-600">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-heading font-medium text-neutral-800 mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-neutral-800 hover:text-primary-600">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-800 hover:text-primary-600">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-800 hover:text-primary-600">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-center text-neutral-800">
              © {new Date().getFullYear()} Pocketax. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;