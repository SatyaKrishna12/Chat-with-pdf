# Chat PDF Express

Chat PDF Express is a web application that allows users to interact with PDF documents through a chat interface. The application utilizes Express.js for the backend, enabling users to upload PDF files, extract text, and ask questions about the content of the PDFs.

## Features

- Upload multiple PDF files.
- Extract text from uploaded PDFs.
- Chat interface for asking questions related to the PDF content.
- Utilizes AI for generating responses based on the PDF text.

## Project Structure

```
chat-pdf-express
├── src
│   ├── app.js                  # Entry point of the application
│   ├── controllers             # Contains controllers for handling requests
│   │   ├── chatController.js    # Chat-related operations
│   │   └── pdfController.js     # PDF-related operations
│   ├── services                # Contains business logic
│   │   ├── pdfService.js        # PDF reading and text extraction
│   │   ├── textSplitter.js       # Text splitting functionality
│   │   └── vectorStore.js        # Vector store management for similarity searches
│   ├── routes                  # Defines application routes
│   │   ├── chat.js              # Routes for chat functionalities
│   │   └── pdf.js               # Routes for PDF processing
│   └── middleware              # Middleware for handling requests
│       └── upload.js            # File upload handling
├── views                       # View templates for the application
│   ├── index.ejs               # Main layout for the application
│   ├── chat.ejs                # Chat interface view
│   └── partials                # Partial views for consistent layout
│       ├── header.ejs          # Header partial
│       └── footer.ejs          # Footer partial
├── public                      # Public assets
│   ├── css                     # CSS styles
│   │   └── style.css           # Styles for the application
│   ├── js                      # Client-side JavaScript
│   │   └── main.js             # Main JavaScript for interactions
│   └── uploads                 # Directory for uploaded PDF files
├── package.json                # NPM configuration file
├── .env                        # Environment variables
└── README.md                   # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/chat-pdf-express.git
   cd chat-pdf-express
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your API key:
   ```
   API_KEY=your_api_key
   ```

4. Start the application:
   ```
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000` to access the application.

## Usage

- Upload your PDF files using the provided interface.
- Ask questions related to the content of the uploaded PDFs in the chat interface.
- The application will respond with answers based on the extracted text from the PDFs.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.
