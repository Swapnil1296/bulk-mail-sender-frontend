import React, { useState, useEffect } from 'react';
import { Send, Briefcase, Code, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function BulkEmailSender() {
  const [emails, setEmails] = useState('');
  const [subject, setSubject] = useState('');
  const [senderName, setSenderName] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [serverHealth, setServerHealth] = useState(null);

  // Check server health on mount
  useEffect(() => {
    checkServerHealth();
  }, []);

  const checkServerHealth = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health');
      const data = await response.json();
      setServerHealth(data);
    } catch (error) {
      console.error('Server health check failed:', error);
    }
  };

  const sendEmails = async (jobType) => {
    const emailList = emails.split('\n').filter(e => e.trim());
    
    if (emailList.length === 0) {
      alert('Please enter at least one email address');
      return;
    }

    if (!senderName) {
      alert('Please enter your name');
      return;
    }

    // Check if resume exists for this job type
    if (serverHealth && !serverHealth.resumes[jobType]?.exists) {
      alert(`⚠️ ${jobType.toUpperCase()} resume not found!\n\nPlease add your resume to:\n${serverHealth.resumes[jobType]?.path}`);
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      const response = await fetch('http://localhost:5000/api/send-bulk-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          emails: emailList,
          jobType,
          subject: subject || `Application for ${jobType === 'frontend' ? 'Frontend' : 'MERN Stack'} Developer Position`,
          senderName: senderName || 'Applicant'
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setResults(data.results);
        const successCount = data.summary.success;
        const totalCount = data.summary.total;
        alert(`✅ Email sending completed!\n\n${successCount} out of ${totalCount} emails sent successfully.`);
      } else {
        alert(`❌ Error: ${data.error}\n${data.message || ''}`);
      }
    } catch (error) {
      alert(`❌ Failed to send emails: ${error.message}\n\nMake sure the backend server is running on http://localhost:5000`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6 md:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Bulk Email Sender
          </h1>
          <p className="text-gray-600 mb-4">
            Send job applications to multiple recipients with automatic resume attachment
          </p>

          {/* Server Health Status */}
          {serverHealth && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm">
                <div className={`w-3 h-3 rounded-full ${serverHealth.status === 'running' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="font-medium">
                  Server: {serverHealth.status === 'running' ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <div className={`p-3 rounded-lg border-2 ${serverHealth.resumes.frontend?.exists ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                  <div className="flex items-center justify-center gap-2">
                    {serverHealth.resumes.frontend?.exists ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className={`font-semibold text-sm ${serverHealth.resumes.frontend?.exists ? 'text-green-700' : 'text-red-700'}`}>
                      Frontend Resume {serverHealth.resumes.frontend?.exists ? 'Ready' : 'Missing'}
                    </span>
                  </div>
                </div>

                <div className={`p-3 rounded-lg border-2 ${serverHealth.resumes.mern?.exists ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                  <div className="flex items-center justify-center gap-2">
                    {serverHealth.resumes.mern?.exists ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className={`font-semibold text-sm ${serverHealth.resumes.mern?.exists ? 'text-green-700' : 'text-red-700'}`}>
                      MERN Resume {serverHealth.resumes.mern?.exists ? 'Ready' : 'Missing'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!serverHealth && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm font-semibold text-yellow-800">Server Not Connected</p>
                <p className="text-xs text-yellow-700 mt-1">
                  Please start the Node.js backend server: <code className="bg-yellow-100 px-2 py-0.5 rounded">node server.js</code>
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Sender Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Name *
            </label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Subject (Optional)
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Leave empty for default subject"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Email Addresses */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Recipient Email Addresses * (one per line)
            </label>
            <textarea
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder="recipient1@example.com&#10;recipient2@example.com&#10;recipient3@example.com"
              rows="6"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              {emails.split('\n').filter(e => e.trim()).length} email(s) entered
            </p>
          </div>

          {/* Send Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <button
              onClick={() => sendEmails('frontend')}
              disabled={loading || !senderName || !serverHealth?.resumes.frontend?.exists}
              className="flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition shadow-lg hover:shadow-xl"
            >
              <Code className="w-5 h-5" />
              Send for Frontend Jobs
              <Send className="w-5 h-5" />
            </button>

            <button
              onClick={() => sendEmails('mern')}
              disabled={loading || !senderName || !serverHealth?.resumes.mern?.exists}
              className="flex items-center justify-center gap-3 px-6 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition shadow-lg hover:shadow-xl"
            >
              <Briefcase className="w-5 h-5" />
              Send for MERN Jobs
              <Send className="w-5 h-5" />
            </button>
          </div>

          {loading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              <p className="text-gray-600 mt-2">Sending emails...</p>
              <p className="text-sm text-gray-500">Please wait, this may take a moment</p>
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Results</h3>
              <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between py-2 px-3 mb-2 rounded ${
                      result.status === 'success'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    <span className="font-mono text-sm">{result.email}</span>
                    <div className="flex items-center gap-2">
                      {result.status === 'success' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      <span className="font-semibold text-xs uppercase">
                        {result.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}