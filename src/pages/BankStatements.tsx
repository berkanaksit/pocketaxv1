import React, { useState, useCallback } from 'react';
import { Upload, CheckCircle, AlertCircle, XCircle, FileText, ArrowRight, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.csv', '.xls', '.xlsx'];

interface UploadError {
  file: string;
  message: string;
}

const BankStatements: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploads, setUploads] = useState<{ name: string; status: 'uploading' | 'success' | 'error'; progress: number }[]>([]);
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'complete' | 'error'>('idle');
  const [uploadErrors, setUploadErrors] = useState<UploadError[]>([]);
  const { user } = useAuth();
  const [processingFile, setProcessingFile] = useState<string | null>(null);
  
  const [processedStatements, setProcessedStatements] = useState<any[]>([]);

  React.useEffect(() => {
    if (user) {
      fetchStatements();
    }
  }, [user]);

  const fetchStatements = async () => {
    try {
      const { data, error } = await supabase
        .from('bank_statements')
        .select(`
          id,
          bank_name,
          statement_period_start,
          statement_period_end,
          status,
          transaction_count
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProcessedStatements(data || []);
    } catch (error) {
      toast.error('Failed to fetch statements');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = async (newFiles: File[]) => {
    setUploadErrors([]);
    const errors: UploadError[] = [];
    const validFiles: File[] = [];

    for (const file of newFiles) {
      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        errors.push({
          file: file.name,
          message: `File type not supported. Please use: ${ALLOWED_FILE_EXTENSIONS.join(', ')}`
        });
        continue;
      }

      // Validate file size
      if (file.size > FILE_SIZE_LIMIT) {
        errors.push({
          file: file.name,
          message: `File exceeds 10MB limit`
        });
        continue;
      }

      validFiles.push(file);
    }

    if (errors.length > 0) {
      setUploadErrors(errors);
      return;
    }

    setFiles(prev => [...prev, ...validFiles]);

    // Process each valid file
    for (const file of validFiles) {
      // Add file to uploads list with initial status
      setUploads(prev => [...prev, {
        name: file.name,
        status: 'uploading',
        progress: 0
      }]);
      
      try {
        // Update progress for this file
        setUploads(prev => prev.map(upload => 
          upload.name === file.name ? { ...upload, progress: 10 } : upload
        ));
        
        // Upload to storage
        const filePath = `${user?.id}/${Date.now()}-${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('bank-statements')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        setUploads(prev => prev.map(upload => 
          upload.name === file.name ? { ...upload, progress: 30 } : upload
        ));

        // Get file URL
        const { data: { publicUrl } } = supabase.storage
          .from('bank-statements')
          .getPublicUrl(filePath);

        // Create database record
        const { data: statementData, error: dbError } = await supabase
          .from('bank_statements')
          .insert({
            user_id: user?.id,
            submission_id: user?.id, // For now, use user_id as submission_id
            filename: file.name,
            file_size: file.size,
            file_type: file.type,
            file_path: filePath,
            status: 'pending'
          });

        if (dbError) throw dbError;

        setUploads(prev => prev.map(upload => 
          upload.name === file.name ? { ...upload, progress: 50 } : upload
        ));

        // Process the file
        setProcessingFile(file.name);
        setProcessingStatus('processing');
        
        const fileContent = await file.text();
        
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-statement`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            statement_id: statementData?.[0]?.id,
            file_type: file.type,
            content: fileContent
          })
        });

        setUploads(prev => prev.map(upload => 
          upload.name === file.name ? { ...upload, progress: 80 } : upload
        ));

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to process statement');
        }

        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to process statement');
        }

        // Mark this file as complete
        setUploads(prev => prev.map(upload => 
          upload.name === file.name ? { 
            ...upload, 
            progress: 100, 
            status: 'success' 
          } : upload
        ));

        toast.success(`Processed ${result.transaction_count} transactions from ${file.name}`);

        // Refresh statements list
        await fetchStatements();

      } catch (error) {
        // Mark this file as failed
        setUploads(prev => prev.map(upload => 
          upload.name === file.name ? { 
            ...upload, 
            status: 'error',
            progress: 0
          } : upload
        ));
        
        toast.error(`Failed to upload ${file.name}`);
        console.error(`Upload error for ${file.name}:`, error);
      }
    }
    
    // Update processing status after all files are processed
    setProcessingFile(null);
    setProcessingStatus(validFiles.length > 0 ? 'complete' : 'idle');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Bank Statements</h1>
        <p className="text-gray-600">Upload your bank statements to analyze your income and expenses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Upload Statements</h2>
            
            {/* File drop area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
              }`}
            >
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <div className="relative group">
                    <HelpCircle className="h-4 w-4 mr-2 text-gray-400 cursor-help" />
                    <div className="invisible group-hover:visible absolute left-0 -bottom-2 transform translate-y-full w-64 bg-black text-white text-xs rounded p-2 z-10">
                      Supported file types: PDF, CSV, Excel (.xls, .xlsx)<br />
                      Maximum file size: 10MB
                    </div>
                  </div>
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                    <span>Upload files</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileSelect}
                      multiple
                      accept=".pdf,.csv,.xlsx,.ofx,.qif,.qfx"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF, CSV, Excel, OFX, QIF, QFX up to 10MB</p>
              </div>
            </div>
            
            {/* Upload Errors */}
            {uploadErrors.length > 0 && (
              <div className="mt-4 p-4 bg-red-50 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <XCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Upload failed</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <ul className="list-disc pl-5 space-y-1">
                        {uploadErrors.map((error, index) => (
                          <li key={index}>
                            {error.file}: {error.message}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Upload progress */}
            {processingStatus === 'processing' && (
              <div className="mt-6 bg-indigo-50 p-4 rounded-md">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-indigo-800">Processing Your Statements</h3>
                    <p className="mt-1 text-sm text-indigo-600">
                      {processingFile ? `Processing ${processingFile}...` : 'Analyzing your statements...'}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {processingStatus === 'complete' && (
              <div className="mt-6 bg-green-50 p-4 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Processing Complete</h3>
                      <p className="mt-1 text-sm text-green-600">
                        Your statements have been processed successfully.
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/submission-summary"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                  >
                    View Summary
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}
            
            {uploads.length > 0 && (
              <div className="mt-6 space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Uploads</h3>
                <div className="space-y-2">
                  {uploads.map((upload, index) => (
                    <div key={index} className="flex items-center">
                      <div className="flex-shrink-0">
                        {upload.status === 'uploading' ? (
                          <div className="h-5 w-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                        ) : upload.status === 'success' ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{upload.name}</p>
                          <p className="text-sm text-gray-500">{upload.progress}%</p>
                        </div>
                        <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              upload.status === 'error' ? 'bg-red-500' : 'bg-indigo-600'
                            }`}
                            style={{ width: `${upload.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Instructions */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Supported Banks:</h3>
              <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-500">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Barclays
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Lloyds Bank
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  HSBC
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Santander
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  NatWest
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Royal Bank of Scotland
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Nationwide
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Monzo
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Starling Bank
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Many more...
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Statements Overview */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Uploaded Statements</h2>
            
            {processedStatements.length > 0 ? (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Summary</h3>
                <div className="space-y-4">
                  {processedStatements.map(statement => (
                    <div key={statement.id} className="border border-gray-200 rounded-md p-3">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <FileText className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-gray-900">
                            {statement.bank_name || 'Bank Statement'}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {statement.statement_period_start && statement.statement_period_end
                              ? `${statement.statement_period_start} to ${statement.statement_period_end}`
                              : 'Processing period information...'
                            }
                          </p>
                          <div className="mt-1 flex items-center text-xs">
                            <span className={`flex items-center ${
                              statement.status === 'processed' ? 'text-green-600' : 
                              statement.status === 'processing' ? 'text-blue-600' :
                              statement.status === 'failed' ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {statement.status === 'processed' ? 'Processed' :
                               statement.status === 'processing' ? 'Processing' :
                               statement.status === 'failed' ? 'Failed' : 'Pending'}
                            </span>
                            <span className="ml-2 text-gray-500">
                              {statement.transaction_count || 0} transactions
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-500">Files Uploaded</span>
                    <span>{uploads.filter(u => u.status === 'success').length} of {uploads.length}</span>
                  </div>
                  {uploads.length > 0 && (
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${uploads.length > 0 ? (uploads.filter(u => u.status === 'success').length / uploads.length) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Processing Status</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    processingStatus === 'complete' 
                      ? 'bg-green-100 text-green-800' 
                      : processingStatus === 'processing'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {processingStatus === 'complete' ? 'Complete' :
                     processingStatus === 'processing' ? 'Processing' : 'Ready'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <AlertCircle className="mx-auto h-10 w-10 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">No statements uploaded yet</p>
                <p className="text-xs text-gray-400 mt-1">Upload your first bank statement to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankStatements;