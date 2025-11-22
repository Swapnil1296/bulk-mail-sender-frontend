import React, { useState, useEffect } from 'react';
import { Send, Briefcase, Code, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { ShowPopup } from '../utils/utils';

export default function BulkEmailSender() {
  const [emails, setEmails] = useState('');
  const [subject, setSubject] = useState('');
  const [senderName, setSenderName] = useState('Swapnil Landage');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [serverHealth, setServerHealth] = useState(null);
  const [animateResults, setAnimateResults] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});

  useEffect(() => {
    checkServerHealth();
  }, []);

  const checkServerHealth = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/health/detailed`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'X-API-Key': import.meta.env.VITE_API_KEY },
        }
);
      const data = await response.json();
      setServerHealth(data);
    } catch (error) {
      console.error('Server health check failed:', error);
    }
  };

  

  const sendEmails = async (jobType) => {
    const emailList = emails.split('\n').filter(e => e.trim());
    const error = {...errorMessage};
    
    if (emailList.length === 0) {
      error["emailList"] = "Please enter at least one email address";
    }
    if (!senderName) {
      error["senderName"] = "Please enter your name";
    }
    if (Object.keys(error).length > 0) {
      setErrorMessage(error);
      return;
    }

    if (serverHealth && !serverHealth.resumes[jobType]?.exists) {
      ShowPopup('Error!', `⚠️ ${jobType.toUpperCase()} resume not found!`);
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/send-bulk-emails`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json','X-API-Key': import.meta.env.VITE_API_KEY },
        body: JSON.stringify({
          emails: emailList,
          jobType,
          subject: subject || `Application for ${jobType === 'frontend' ? 'Frontend' : 'MERN Stack'} Developer Position`,
          senderName: senderName || 'Applicant'
        })
      });

      const data = await response.json();
      
      if (data?.status===200) {
        setResults(data.results);
        setAnimateResults(true);
        setTimeout(() => setAnimateResults(false), 500);
        ShowPopup('Success!', `✅ ${data.summary.success} out of ${data.summary.total} emails sent!`);
      } else {
        ShowPopup('Error!', `❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error sending emails:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-4 md:p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-purple-950/20 to-black pointer-events-none"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: `linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }}></div>
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-green-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>

      <div className="max-w-5xl mx-auto relative">
        <div className="bg-gradient-to-br from-cyan-950/40 via-purple-950/40 to-black/60 backdrop-blur-2xl rounded-3xl border-2 border-cyan-500/30 p-8 md:p-12 relative overflow-hidden" style={{
          boxShadow: '0 0 60px rgba(0,255,255,0.3), 0 0 100px rgba(255,0,255,0.2), inset 0 0 60px rgba(0,255,255,0.1)'
        }}>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" style={{
              animation: 'scan 4s linear infinite',
              boxShadow: '0 0 20px rgba(0,255,255,0.8)'
            }}></div>
          </div>
          
          <div className="text-center mb-10 relative">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 rounded-full mb-6 transform hover:scale-110 transition-all duration-300 relative" style={{
              boxShadow: '0 0 40px rgba(0,255,255,0.6), 0 0 80px rgba(255,0,255,0.4)'
            }}>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-pink-400 opacity-50 animate-spin" style={{animationDuration: '3s'}}></div>
              <Send className="w-12 h-12 text-white relative z-10" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold mb-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-pulse" style={{
              textShadow: '0 0 30px rgba(0,255,255,0.5), 0 0 60px rgba(255,0,255,0.3)'
            }}>
              BULK EMAIL SENDER
            </h1>
            <div className="h-1 w-64 mx-auto bg-gradient-to-r from-transparent via-cyan-400 to-transparent mb-4" style={{
              boxShadow: '0 0 20px rgba(0,255,255,0.8)'
            }}></div>
            <p className="text-lg text-cyan-200 max-w-2xl mx-auto font-light">
              <span className="text-pink-300">█</span> QUANTUM-POWERED EMAIL AUTOMATION <span className="text-pink-300">█</span>
            </p>
          </div>

          {serverHealth && (
            <div className="mb-8 space-y-4">
              <div className="flex items-center justify-center gap-3 bg-black/60 backdrop-blur-sm rounded-2xl p-5 border-2 border-cyan-500/50 relative overflow-hidden" style={{
                boxShadow: '0 0 30px rgba(0,255,255,0.3), inset 0 0 30px rgba(0,255,255,0.1)'
              }}>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-pink-500/10"></div>
                <div className={`w-4 h-4 rounded-full ${serverHealth.status === 'running' ? 'bg-green-400' : 'bg-red-400'} relative`} style={{
                  boxShadow: serverHealth.status === 'running' ? '0 0 20px rgba(0,255,0,0.8)' : '0 0 20px rgba(255,0,0,0.8)',
                  animation: serverHealth.status === 'running' ? 'pulse 2s infinite' : 'none'
                }}></div>
                <span className="font-bold text-cyan-300 text-xl tracking-wider uppercase">
                  <span className="text-pink-400">►</span> SYSTEM {serverHealth.status === 'running' ? 'ONLINE' : 'OFFLINE'} <span className="text-pink-400">◄</span>
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['frontend', 'mern'].map((type) => (
                  <div key={type} className={`group p-6 rounded-2xl backdrop-blur-lg transition-all duration-300 hover:scale-105 border-2 relative overflow-hidden ${
                    serverHealth.resumes?.[type]?.exists 
                      ? 'bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-cyan-500/20 border-green-400/60' 
                      : 'bg-gradient-to-br from-red-500/20 via-rose-500/20 to-orange-500/20 border-red-400/60'
                  }`} style={{
                    boxShadow: serverHealth.resumes?.[type]?.exists 
                      ? '0 0 30px rgba(0,255,0,0.3), inset 0 0 30px rgba(0,255,0,0.1)' 
                      : '0 0 30px rgba(255,0,0,0.3), inset 0 0 30px rgba(255,0,0,0.1)'
                  }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent transform -skew-x-12"></div>
                    <div className="flex items-center gap-4 relative">
                      <div className={`p-4 rounded-xl border-2 ${serverHealth.resumes?.[type]?.exists ? 'bg-green-400/20 border-green-300/50' : 'bg-red-400/20 border-red-300/50'}`} style={{
                        boxShadow: serverHealth.resumes?.[type]?.exists ? '0 0 20px rgba(0,255,0,0.4)' : '0 0 20px rgba(255,0,0,0.4)'
                      }}>
                        {type === 'frontend' ? <Code className={`w-7 h-7 ${serverHealth.resumes?.[type]?.exists ? 'text-green-300' : 'text-red-300'}`} /> : <Briefcase className={`w-7 h-7 ${serverHealth.resumes?.[type]?.exists ? 'text-green-300' : 'text-red-300'}`} />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-lg tracking-wide uppercase">{type === 'frontend' ? 'Frontend' : 'MERN'} Resume</h3>
                        <div className="flex items-center gap-2 mt-2">
                          {serverHealth.resumes?.[type]?.exists ? (
                            <>
                              <CheckCircle className="w-5 h-5 text-green-400" style={{filter: 'drop-shadow(0 0 8px rgba(0,255,0,0.8))'}} />
                              <span className="text-green-300 font-bold text-sm">READY TO DEPLOY</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-5 h-5 text-red-400" style={{filter: 'drop-shadow(0 0 8px rgba(255,0,0,0.8))'}} />
                              <span className="text-red-300 font-bold text-sm">FILE NOT FOUND</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!serverHealth && (
            <div className="mb-8 p-6 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 backdrop-blur-lg rounded-2xl border-2 border-yellow-400/60 flex items-start gap-4 relative overflow-hidden" style={{
              boxShadow: '0 0 30px rgba(255,200,0,0.3), inset 0 0 30px rgba(255,200,0,0.1)'
            }}>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-transparent to-red-500/10"></div>
              <div className="p-3 bg-yellow-400/30 rounded-xl border-2 border-yellow-300/50 relative" style={{boxShadow: '0 0 20px rgba(255,200,0,0.4)'}}>
                <AlertCircle className="w-7 h-7 text-yellow-300 animate-pulse" />
              </div>
              <div className="flex-1 relative">
                <p className="text-xl font-bold text-yellow-200 mb-2 tracking-wide uppercase">⚠ CONNECTION LOST</p>
                <p className="text-yellow-100">
                  Initialize backend: <code className="bg-black/50 px-3 py-1 rounded-lg text-cyan-300 font-mono text-sm border border-cyan-500/30" style={{boxShadow: '0 0 10px rgba(0,255,255,0.3)'}}>node server.js</code>
                </p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-cyan-500/50 relative overflow-hidden" style={{
              boxShadow: '0 0 30px rgba(0,255,255,0.2), inset 0 0 30px rgba(0,255,255,0.05)'
            }}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
              <label className="block text-sm font-bold text-cyan-300 mb-3 uppercase tracking-widest flex items-center gap-2">
                <span className="text-pink-400">▶</span> YOUR NAME *
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-6 py-4 bg-black/40 border-2 border-purple-500/50 rounded-xl text-cyan-100 placeholder-purple-400/60 focus:border-cyan-400 focus:outline-none transition-all duration-300 text-lg font-medium"
                style={{boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5), 0 0 20px rgba(139,92,246,0.3)'}}
              />
            </div>

            <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-500/50 relative overflow-hidden" style={{
              boxShadow: '0 0 30px rgba(139,92,246,0.2), inset 0 0 30px rgba(139,92,246,0.05)'
            }}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
              <label className="block text-sm font-bold text-purple-300 mb-3 uppercase tracking-widest flex items-center gap-2">
                <span className="text-pink-400">▶</span> EMAIL SUBJECT (OPTIONAL)
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Leave empty for default subject"
                className="w-full px-6 py-4 bg-black/40 border-2 border-cyan-500/50 rounded-xl text-purple-100 placeholder-cyan-400/60 focus:border-purple-400 focus:outline-none transition-all duration-300 text-lg font-medium"
                style={{boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5), 0 0 20px rgba(0,255,255,0.3)'}}
              />
            </div>

            <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-pink-500/50 relative overflow-hidden" style={{
              boxShadow: '0 0 30px rgba(255,0,255,0.2), inset 0 0 30px rgba(255,0,255,0.05)'
            }}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent"></div>
              <label className="block text-sm font-bold text-pink-300 mb-3 uppercase tracking-widest flex items-center gap-2">
                <span className="text-cyan-400">▶</span> RECIPIENT ADDRESSES * (ONE PER LINE)
              </label>
              <textarea
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                placeholder="recipient1@example.com&#10;recipient2@example.com&#10;recipient3@example.com"
                rows="6"
                className="w-full px-6 py-4 bg-black/40 border-2 border-cyan-500/50 rounded-xl text-pink-100 placeholder-cyan-400/60 focus:border-pink-400 focus:outline-none transition-all duration-300 font-mono text-base"
                style={{boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5), 0 0 20px rgba(0,255,255,0.3)'}}
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-cyan-300 text-sm font-bold tracking-wider uppercase">
                  <span className="text-pink-400">►</span> {emails.split('\n').filter(e => e.trim()).length} EMAIL(S) QUEUED
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <button
                onClick={() => sendEmails('frontend')}
                disabled={loading || !senderName || !serverHealth?.resumes?.frontend?.exists}
                className="group relative overflow-hidden px-8 py-6 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 hover:from-cyan-500 hover:via-blue-500 hover:to-cyan-500 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all duration-300 hover:scale-105 disabled:hover:scale-100 disabled:opacity-40 border-2 border-cyan-400/50 disabled:border-gray-600 hover:cursor-pointer"
                style={{
                  boxShadow: !loading && senderName && serverHealth?.resumes?.frontend?.exists 
                    ? '0 0 40px rgba(0,255,255,0.6), 0 0 80px rgba(0,255,255,0.3), inset 0 0 20px rgba(0,255,255,0.2)' 
                    : 'none'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <div className="absolute inset-0 bg-cyan-400/20 animate-pulse"></div>
                <div className="relative flex items-center justify-center gap-3 text-lg tracking-wider uppercase">
                  <Code className="w-7 h-7" style={{filter: 'drop-shadow(0 0 8px rgba(0,255,255,0.8))'}} />
                  <span>Frontend Dev</span>
                  <Send className="w-7 h-7" style={{filter: 'drop-shadow(0 0 8px rgba(0,255,255,0.8))'}} />
                </div>
              </button>

              <button
                onClick={() => sendEmails('mern')}
                disabled={loading || !senderName || !serverHealth?.resumes?.mern?.exists}
                className="group relative overflow-hidden px-8 py-6 bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 hover:from-green-500 hover:via-emerald-500 hover:to-green-500 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all duration-300 hover:scale-105 disabled:hover:scale-100 disabled:opacity-40 border-2 border-green-400/50 disabled:border-gray-600 hover:cursor-pointer"
                style={{
                  boxShadow: !loading && senderName && serverHealth?.resumes?.mern?.exists 
                    ? '0 0 40px rgba(0,255,0,0.6), 0 0 80px rgba(0,255,0,0.3), inset 0 0 20px rgba(0,255,0,0.2)' 
                    : 'none'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <div className="absolute inset-0 bg-green-400/20 animate-pulse"></div>
                <div className="relative flex items-center justify-center gap-3 text-lg tracking-wider uppercase">
                  <Briefcase className="w-7 h-7" style={{filter: 'drop-shadow(0 0 8px rgba(0,255,0,0.8))'}} />
                  <span>MERN Dev</span>
                  <Send className="w-7 h-7" style={{filter: 'drop-shadow(0 0 8px rgba(0,255,0,0.8))'}} />
                </div>
              </button>
            </div>

            {loading && (
              <div className="text-center py-8 bg-black/60 backdrop-blur-sm rounded-2xl border-2 border-purple-500/50 relative overflow-hidden" style={{
                boxShadow: '0 0 40px rgba(139,92,246,0.4), inset 0 0 40px rgba(139,92,246,0.1)'
              }}>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
                <div className="inline-block relative">
                  <div className="w-20 h-20 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" style={{boxShadow: '0 0 30px rgba(0,255,255,0.6)'}}></div>
                  <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-pink-400 rounded-full animate-spin" style={{
                    animationDirection: 'reverse', 
                    animationDuration: '0.8s',
                    boxShadow: '0 0 30px rgba(255,0,255,0.6)'
                  }}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-pink-400 rounded-full animate-pulse" style={{
                      boxShadow: '0 0 20px rgba(0,255,255,0.8), 0 0 40px rgba(255,0,255,0.6)'
                    }}></div>
                  </div>
                </div>
                <p className="text-white font-bold text-2xl mt-6 tracking-widest uppercase" style={{
                  textShadow: '0 0 20px rgba(0,255,255,0.8), 0 0 40px rgba(255,0,255,0.6)'
                }}>
                  <span className="text-cyan-400">►</span> TRANSMITTING DATA <span className="text-pink-400">◄</span>
                </p>
                <p className="text-purple-300 mt-2 font-mono">Processing quantum email packets...</p>
              </div>
            )}

            {results.length > 0 && (
              <div className={`bg-black/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-500/50 transition-all duration-500 relative overflow-hidden ${animateResults ? 'scale-105' : 'scale-100'}`} style={{
                boxShadow: '0 0 40px rgba(0,255,0,0.4), inset 0 0 40px rgba(0,255,0,0.1)'
              }}>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-cyan-500/10"></div>
                <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3 relative tracking-wider uppercase" style={{
                  textShadow: '0 0 20px rgba(0,255,0,0.8)'
                }}>
                  <CheckCircle className="w-8 h-8 text-green-400" style={{filter: 'drop-shadow(0 0 10px rgba(0,255,0,0.8))'}} />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-cyan-400">TRANSMISSION LOG</span>
                </h3>
                <div className="bg-black/40 rounded-xl p-4 max-h-72 overflow-y-auto space-y-3 border border-green-500/30" style={{
                  boxShadow: 'inset 0 0 30px rgba(0,0,0,0.8)'
                }}>
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between py-4 px-6 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-102 border-2 ${
                        result.status === 'success'
                          ? 'bg-gradient-to-r from-green-600/30 via-emerald-600/30 to-cyan-600/30 border-green-400/60'
                          : 'bg-gradient-to-r from-red-600/30 via-rose-600/30 to-orange-600/30 border-red-400/60'
                      }`}
                      style={{
                        boxShadow: result.status === 'success' 
                          ? '0 0 20px rgba(0,255,0,0.3)' 
                          : '0 0 20px rgba(255,0,0,0.3)'
                      }}
                    >
                      <span className="font-mono text-white font-medium text-sm">{result.email}</span>
                      <div className="flex items-center gap-3">
                        {result.status === 'success' ? (
                          <>
                            <CheckCircle className="w-6 h-6 text-green-400" style={{filter: 'drop-shadow(0 0 8px rgba(0,255,0,0.8))'}} />
                            <span className="font-bold text-xs uppercase text-green-300 bg-green-500/40 px-4 py-1.5 rounded-full border border-green-400/50" style={{
                              boxShadow: '0 0 15px rgba(0,255,0,0.5)'
                            }}>
                              ✓ DELIVERED
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-6 h-6 text-red-400" style={{filter: 'drop-shadow(0 0 8px rgba(255,0,0,0.8))'}} />
                            <span className="font-bold text-xs uppercase text-red-300 bg-red-500/40 px-4 py-1.5 rounded-full border border-red-400/50" style={{
                              boxShadow: '0 0 15px rgba(255,0,0,0.5)'
                            }}>
                              ✗ FAILED
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-8">
          <div className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-full border-2 border-cyan-400/40 relative" style={{
            boxShadow: '0 0 30px rgba(0,255,255,0.3)'
          }}>
            <p className="text-cyan-300 text-sm font-bold tracking-widest uppercase">
              <span className="text-pink-400">◄</span> POWERED BY QUANTUM EMAIL AUTOMATION <span className="text-pink-400">►</span>
            </p>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}</style>
    </div>
  );
}