import { useState } from "react";
import { X, FileText } from "lucide-react";
import type { KYCDocument } from "@/types/kyc.types";

interface KYCDocumentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: KYCDocument | null;
  onApprove: (document: KYCDocument) => void;
  onReject: (document: KYCDocument, reason: string) => void;
}

export default function KYCDocumentDetailsModal({
  isOpen,
  onClose,
  document,
  onApprove,
  onReject,
}: KYCDocumentDetailsModalProps) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  if (!isOpen || !document) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-50 text-green-700 border-green-200";
      case "Pending":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(document, rejectionReason);
      setRejectionReason("");
      setShowRejectForm(false);
    }
  };

  const handleApprove = () => {
    onApprove(document);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            KYC Document Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Document ID and Status */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Document ID</p>
              <h3 className="text-lg font-semibold text-gray-900">
                {document.documentId}
              </h3>
            </div>
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                document.status
              )}`}
            >
              {document.status}
            </span>
          </div>

          {/* Provider Information */}
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-3">
              Provider Information
            </h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Provider Name</p>
                <p className="text-base font-medium text-gray-900">
                  {document.providerName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Provider ID</p>
                <p className="text-base text-gray-900">{document.providerId}</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Document Information */}
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-3">
              Document Information
            </h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Document Type</p>
                <p className="text-base font-medium text-gray-900">
                  {document.documentType}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Uploaded Date</p>
                <p className="text-base text-gray-900">
                  {document.uploadedDate}
                </p>
              </div>
            </div>
          </div>

          {/* Document Preview */}
          <div>
            <p className="text-sm text-gray-600 mb-3">Document Preview</p>
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center">
              <FileText className="w-16 h-16 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-2">Document URL:</p>
              <a
                href={document.documentUrl || "#"}
                className="text-sm text-blue-600 hover:text-blue-700 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                #
              </a>
            </div>
          </div>

          {/* Review Information (for reviewed documents) */}
          {document.reviewedBy && (
            <>
              <div className="border-t border-gray-200"></div>
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-3">
                  Review Information
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Reviewed By</span>
                    <span className="text-sm font-medium text-gray-900">
                      {document.reviewedBy}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Review Date</span>
                    <span className="text-sm font-medium text-gray-900">
                      {document.reviewedDate}
                    </span>
                  </div>
                  {document.rejectionReason && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Rejection Reason
                      </p>
                      <p className="text-sm text-red-600">
                        {document.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Rejection Form (only shown when rejecting) */}
          {showRejectForm && document.status === "Pending" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <label
                htmlFor="rejectionReason"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Rejection Reason
              </label>
              <textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
                required
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4">
            {document.status === "Pending" ? (
              showRejectForm ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setShowRejectForm(false);
                      setRejectionReason("");
                    }}
                    className="flex-1 px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={!rejectionReason.trim()}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm Rejection
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setShowRejectForm(true)}
                    className="flex-1 px-4 py-2.5 bg-white text-red-600 border border-red-600 rounded-lg hover:bg-red-50 font-medium"
                  >
                    Reject
                  </button>
                  <button
                    onClick={handleApprove}
                    className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                  >
                    Approve
                  </button>
                </div>
              )
            ) : (
              <button
                onClick={onClose}
                className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
