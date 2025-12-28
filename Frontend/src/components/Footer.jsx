const Footer = () => {
  return (
    <footer className="py-8 border-t border-gray-200 bg-white">
      <div className="text-center">
        <p className="mb-2 text-lg font-bold text-gray-900">© 2025 SmartPDF AI. All rights reserved.</p>
        <p className="text-base text-gray-600">Supports PDF files up to 10MB • 100% Free • AI-Powered</p>
        <div className="mt-4 flex justify-center gap-4">
          <div className="w-2 h-2 rounded-full bg-blue-600"></div>
          <div className="w-2 h-2 rounded-full bg-green-600"></div>
          <div className="w-2 h-2 rounded-full bg-slate-600"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
