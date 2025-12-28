import { useNavigate } from 'react-router';
import Footer from './Footer';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navbar /> */}

      <div className="w-full">
        {/* Hero Section */}
        <div className="relative min-h-[calc(100vh-64px)] overflow-hidden flex items-center justify-center px-4">
          
          {/* Background blur effects */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100/30 rounded-full blur-[160px]" />
            <div className="absolute top-1/3 right-10 w-96 h-96 bg-slate-200/30 rounded-full blur-[120px]" />
          </div>

          <div className="max-w-6xl mx-auto py-12 text-center w-full">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 backdrop-blur-xl border border-blue-200 text-sm font-semibold text-blue-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <span className="text-xl">🚀</span> SmartPDF AI — Chat with your documents
            </div>

            {/* Headline */}
            <h1 className="mt-8 text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-gray-900 leading-[1.05]">
              Transform Your PDFs
              <span className="block mt-2 text-blue-600">
                With AI Intelligence
              </span>
            </h1>

            {/* Description */}
            <div className="mt-10 flex justify-center w-full">
              <p className="max-w-2xl text-center text-xl md:text-2xl text-gray-600 leading-relaxed px-4">
                Upload your PDF and instantly chat with it. Get answers, summaries, and deep insights powered by AI — no reading required.
              </p>
            </div>

            {/* CTA */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => navigate('/upload')}
                className="group relative px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold text-lg overflow-hidden shadow-2xl hover:shadow-blue-500/50 hover:scale-105 hover:bg-blue-700 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Free Upload 
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {[
                { label: '100% Free', color: 'bg-green-500' },
                { label: 'AI-Powered', color: 'bg-blue-600' },
                { label: 'Instant Answers', color: 'bg-slate-600' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white backdrop-blur-sm border border-gray-200 text-sm font-semibold text-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  {item.label}
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* How It Works Section */}
        <div className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Section Header */}
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-5 tracking-tight">
                Three Simple Steps to Success
              </h2>
              <p className="text-lg sm:text-xl text-gray-500 font-normal max-w-3xl mx-auto leading-relaxed">
                From upload to insights in seconds, not hours
              </p>
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              
              {/* Step 1 */}
              <div className="group">
                <div className="bg-white rounded-3xl p-6 lg:p-7 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200 hover:border-blue-300 h-full flex flex-col">
                  
                  {/* Badge */}
                  <div className="mb-4">
                    <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full border border-blue-200">
                      Step 1
                    </span>
                  </div>
                  
                  {/* Icon */}
                  <div className="mb-4">
                    <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl w-16 h-16 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-105">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    Upload PDF
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-base flex-grow mb-4">
                    Drag & drop your PDF or click to browse. We support files up to 10MB.
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-200">
                      Drag & Drop
                    </span>
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-200">
                      Quick Upload
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="group">
                <div className="bg-white rounded-3xl p-6 lg:p-7 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200 hover:border-violet-300 h-full flex flex-col">
                  
                  {/* Badge */}
                  <div className="mb-4">
                    <span className="inline-block px-4 py-1.5 bg-violet-50 text-violet-700 text-sm font-semibold rounded-full border border-violet-200">
                      Step 2
                    </span>
                  </div>
                  
                  {/* Icon */}
                  <div className="mb-4">
                    <div className="bg-gradient-to-br from-violet-400 to-violet-600 rounded-2xl w-16 h-16 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-all duration-300 group-hover:scale-105">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    AI Processing
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-base flex-grow mb-4">
                    Our advanced AI analyzes your document and extracts key insights instantly.
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 bg-violet-50 text-violet-700 rounded-full text-xs font-semibold border border-violet-200">
                      AI Analysis
                    </span>
                    <span className="px-3 py-1.5 bg-violet-50 text-violet-700 rounded-full text-xs font-semibold border border-violet-200">
                      Real-time
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="group">
                <div className="bg-white rounded-3xl p-6 lg:p-7 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200 hover:border-pink-300 h-full flex flex-col">
                  
                  {/* Badge */}
                  <div className="mb-4">
                    <span className="inline-block px-4 py-1.5 bg-pink-50 text-pink-700 text-sm font-semibold rounded-full border border-pink-200">
                      Step 3
                    </span>
                  </div>
                  
                  {/* Icon */}
                  <div className="mb-4">
                    <div className="bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl w-16 h-16 flex items-center justify-center shadow-lg shadow-pink-500/30 group-hover:shadow-pink-500/50 transition-all duration-300 group-hover:scale-105">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    Get Results
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-base flex-grow mb-4">
                    Receive comprehensive insights, summaries, and answers in seconds.
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 bg-pink-50 text-pink-700 rounded-full text-xs font-semibold border border-pink-200">
                      Instant
                    </span>
                    <span className="px-3 py-1.5 bg-pink-50 text-pink-700 rounded-full text-xs font-semibold border border-pink-200">
                      Detailed
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight">
                Powerful Tools for Modern Workflows
              </h2>
              <p className="text-2xl text-gray-600 font-light">
                Everything you need to unlock the power of your PDF documents
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-gray-200 hover:border-blue-400 group transform hover:-translate-y-2">
                <div className="bg-blue-600 rounded-3xl w-20 h-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl shadow-blue-500/50">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="font-black text-gray-900 mb-4 text-3xl">Lightning Fast</h4>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Process PDFs in seconds with our optimized AI engine and cloud infrastructure
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-gray-200 hover:border-green-400 group transform hover:-translate-y-2">
                <div className="bg-green-600 rounded-3xl w-20 h-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl shadow-green-500/50">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="font-black text-gray-900 mb-4 text-3xl">Secure & Private</h4>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Your documents are encrypted end-to-end and never stored permanently on our servers
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-gray-200 hover:border-slate-400 group transform hover:-translate-y-2">
                <div className="bg-slate-600 rounded-3xl w-20 h-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl shadow-slate-500/50">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h4 className="font-black text-gray-900 mb-4 text-3xl">AI-Powered</h4>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Advanced AI extracts insights, answers questions, and provides intelligent summaries
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-12 bg-gray-900 text-white rounded-[3rem] my-8 mx-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
          <div className="max-w-4xl mx-auto text-center px-8 relative z-10">
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight drop-shadow-lg">
              Ready to Transform Your PDF Workflow?
            </h2>
            <p className="text-2xl text-gray-300 mb-8 font-light drop-shadow">
              Join thousands of users who are already using SmartPDF AI to unlock insights from their documents
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/upload')}
                className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xl hover:bg-blue-700 transition-all duration-300 shadow-2xl hover:shadow-blue-500/30 transform hover:scale-105"
              >
                Get Started Free
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/50 rounded-2xl font-black text-xl hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105">
                Learn More
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Hero;
