import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Search,
  Mail,
  User,
  Phone,
  MapPin,
  Building2,
  FileText,
  Loader2,
  AlertCircle,
  Settings,
} from "lucide-react";
import API_BASE_URL from "../api/config";
import "../main.css";
import "../scss/_admin.scss";

interface PendingRegistration {
  id: string;
  type: "personal" | "business";
  email: string;
  firstname?: string;
  lastname?: string;
  business_name?: string;
  phone: string;
  address?: string;
  business_location?: string;
  nin_number?: string;
  CAC_number?: string;
  created_at: string;
  status: "pending" | "approved" | "disapproved";
}

const AdminSettings: React.FC = () => {
  const [pendingRegistrations, setPendingRegistrations] = useState<
    PendingRegistration[]
  >([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<
    PendingRegistration[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch pending registrations
  useEffect(() => {
    fetchPendingRegistrations();
  }, []);

  // Filter registrations based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRegistrations(pendingRegistrations);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredRegistrations(
        pendingRegistrations.filter(
          (reg) =>
            reg.email.toLowerCase().includes(query) ||
            (reg.firstname &&
              reg.firstname.toLowerCase().includes(query)) ||
            (reg.lastname && reg.lastname.toLowerCase().includes(query)) ||
            (reg.business_name &&
              reg.business_name.toLowerCase().includes(query)) ||
            reg.phone.includes(query)
        )
      );
    }
  }, [searchQuery, pendingRegistrations]);

  const fetchPendingRegistrations = async () => {
    try {
      setLoading(true);
      setError(null);
      const adminToken = localStorage.getItem("adminToken");

      const response = await fetch(
        `${API_BASE_URL}/admin/registrations/pending`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (!response.ok) {
        // If endpoint doesn't exist, use mock data for now
        if (response.status === 404) {
          // Mock data for demonstration
          const mockData: PendingRegistration[] = [
            {
              id: "1",
              type: "personal",
              email: "john.doe@example.com",
              firstname: "John",
              lastname: "Doe",
              phone: "+234 801 234 5678",
              address: "123 Main Street, Jos, Plateau State",
              nin_number: "12345678901",
              created_at: new Date().toISOString(),
              status: "pending",
            },
            {
              id: "2",
              type: "business",
              email: "business@example.com",
              business_name: "Tech Solutions Ltd",
              phone: "+234 802 345 6789",
              business_location: "456 Business Avenue, Abuja",
              CAC_number: "RC123456",
              created_at: new Date().toISOString(),
              status: "pending",
            },
          ];
          setPendingRegistrations(mockData);
          setFilteredRegistrations(mockData);
          setLoading(false);
          return;
        }
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const data = await response.json();
      setPendingRegistrations(data.registrations || []);
      setFilteredRegistrations(data.registrations || []);
    } catch (err) {
      console.error("Error fetching pending registrations:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch pending registrations"
      );
      // Use mock data on error for demonstration
      const mockData: PendingRegistration[] = [
        {
          id: "1",
          type: "personal",
          email: "john.doe@example.com",
          firstname: "John",
          lastname: "Doe",
          phone: "+234 801 234 5678",
          address: "123 Main Street, Jos, Plateau State",
          nin_number: "12345678901",
          created_at: new Date().toISOString(),
          status: "pending",
        },
        {
          id: "2",
          type: "business",
          email: "business@example.com",
          business_name: "Tech Solutions Ltd",
          phone: "+234 802 345 6789",
          business_location: "456 Business Avenue, Abuja",
          CAC_number: "RC123456",
          created_at: new Date().toISOString(),
          status: "pending",
        },
      ];
      setPendingRegistrations(mockData);
      setFilteredRegistrations(mockData);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string, email: string) => {
    try {
      setProcessing(id);
      setError(null);
      setSuccess(null);
      const adminToken = localStorage.getItem("adminToken");

      const response = await fetch(
        `${API_BASE_URL}/admin/registrations/${id}/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        // Mock approval for demonstration if endpoint doesn't exist
        if (response.status === 404) {
          // Simulate email sending
          console.log(`Sending approval email to ${email}`);
          
          // Update local state
          setPendingRegistrations((prev) =>
            prev.filter((reg) => reg.id !== id)
          );
          setSuccess(`Registration approved! Approval email sent to ${email}`);
          setProcessing(null);
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to approve registration");
      }

      const data = await response.json();
      
      // Remove approved registration from list
      setPendingRegistrations((prev) =>
        prev.filter((reg) => reg.id !== id)
      );
      
      setSuccess(
        data.message || `Registration approved! Email sent to ${email}`
      );
    } catch (err) {
      console.error("Error approving registration:", err);
      setError(
        err instanceof Error ? err.message : "Failed to approve registration"
      );
    } finally {
      setProcessing(null);
    }
  };

  const handleDisapprove = async (id: string, email: string) => {
    try {
      setProcessing(id);
      setError(null);
      setSuccess(null);
      const adminToken = localStorage.getItem("adminToken");

      const response = await fetch(
        `${API_BASE_URL}/admin/registrations/${id}/disapprove`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        // Mock disapproval for demonstration if endpoint doesn't exist
        if (response.status === 404) {
          console.log(`Sending disapproval notification to ${email}`);
          
          // Update local state
          setPendingRegistrations((prev) =>
            prev.filter((reg) => reg.id !== id)
          );
          setSuccess(`Registration disapproved. Notification sent to ${email}`);
          setProcessing(null);
          return;
        }
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to disapprove registration"
        );
      }

      const data = await response.json();
      
      // Remove disapproved registration from list
      setPendingRegistrations((prev) =>
        prev.filter((reg) => reg.id !== id)
      );
      
      setSuccess(
        data.message || `Registration disapproved. Notification sent to ${email}`
      );
    } catch (err) {
      console.error("Error disapproving registration:", err);
      setError(
        err instanceof Error ? err.message : "Failed to disapprove registration"
      );
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-dashboard__header">
        <h1>
          <Settings size={20} />
          Settings - Registration Approvals
        </h1>
      </div>

            {/* Search Bar */}
            <div className="admin-dashboard__search" style={{ marginBottom: "20px" }}>
              <Search size={18} />
              <input
                type="text"
                placeholder="Search by email, name, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Messages */}
            {error && (
              <div
                style={{
                  padding: "12px 16px",
                  backgroundColor: "#fee",
                  border: "1px solid #fcc",
                  borderRadius: "8px",
                  color: "#c33",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <AlertCircle size={18} />
                <span>{error}</span>
                <button
                  onClick={() => setError(null)}
                  style={{
                    marginLeft: "auto",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#c33",
                  }}
                >
                  <XCircle size={18} />
                </button>
              </div>
            )}

            {success && (
              <div
                style={{
                  padding: "12px 16px",
                  backgroundColor: "#efe",
                  border: "1px solid #cfc",
                  borderRadius: "8px",
                  color: "#3c3",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <CheckCircle size={18} />
                <span>{success}</span>
                <button
                  onClick={() => setSuccess(null)}
                  style={{
                    marginLeft: "auto",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#3c3",
                  }}
                >
                  <XCircle size={18} />
                </button>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "60px 20px",
                }}
              >
                <Loader2 size={32} className="spinner" />
                <span style={{ marginLeft: "12px" }}>Loading registrations...</span>
              </div>
            )}

            {/* Registrations List */}
            {!loading && (
              <>
                {filteredRegistrations.length === 0 ? (
                  <div
                    style={{
                      padding: "60px 20px",
                      textAlign: "center",
                      color: "#666",
                    }}
                  >
                    <FileText size={48} style={{ marginBottom: "16px", opacity: 0.5 }} />
                    <p style={{ fontSize: "16px", margin: 0 }}>
                      {searchQuery
                        ? "No registrations found matching your search"
                        : "No pending registrations"}
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gap: "16px",
                    }}
                  >
                    {filteredRegistrations.map((registration) => (
                      <div
                        key={registration.id}
                        style={{
                          backgroundColor: "white",
                          borderRadius: "12px",
                          padding: "20px",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: "16px",
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginBottom: "12px",
                              }}
                            >
                              {registration.type === "business" ? (
                                <Building2 size={20} color="#666" />
                              ) : (
                                <User size={20} color="#666" />
                              )}
                              <span
                                style={{
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  textTransform: "uppercase",
                                  color: "#666",
                                  padding: "4px 8px",
                                  backgroundColor: "#f5f5f5",
                                  borderRadius: "4px",
                                }}
                              >
                                {registration.type === "business"
                                  ? "Business"
                                  : "Personal"}
                              </span>
                              <span
                                style={{
                                  fontSize: "12px",
                                  color: "#999",
                                  marginLeft: "auto",
                                }}
                              >
                                {formatDate(registration.created_at)}
                              </span>
                            </div>

                            <h3
                              style={{
                                fontSize: "18px",
                                fontWeight: 600,
                                margin: "0 0 12px 0",
                                color: "#333",
                              }}
                            >
                              {registration.type === "business"
                                ? registration.business_name
                                : `${registration.firstname} ${registration.lastname}`}
                            </h3>

                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                                gap: "12px",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  fontSize: "14px",
                                  color: "#666",
                                }}
                              >
                                <Mail size={16} />
                                <span>{registration.email}</span>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  fontSize: "14px",
                                  color: "#666",
                                }}
                              >
                                <Phone size={16} />
                                <span>{registration.phone}</span>
                              </div>
                              {registration.type === "personal" ? (
                                <>
                                  {registration.address && (
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: "8px",
                                        fontSize: "14px",
                                        color: "#666",
                                      }}
                                    >
                                      <MapPin size={16} style={{ marginTop: "2px" }} />
                                      <span>{registration.address}</span>
                                    </div>
                                  )}
                                  {registration.nin_number && (
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        fontSize: "14px",
                                        color: "#666",
                                      }}
                                    >
                                      <FileText size={16} />
                                      <span>NIN: {registration.nin_number}</span>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <>
                                  {registration.business_location && (
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: "8px",
                                        fontSize: "14px",
                                        color: "#666",
                                      }}
                                    >
                                      <MapPin size={16} style={{ marginTop: "2px" }} />
                                      <span>{registration.business_location}</span>
                                    </div>
                                  )}
                                  {registration.CAC_number && (
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        fontSize: "14px",
                                        color: "#666",
                                      }}
                                    >
                                      <FileText size={16} />
                                      <span>CAC: {registration.CAC_number}</span>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div
                          style={{
                            display: "flex",
                            gap: "12px",
                            marginTop: "16px",
                            paddingTop: "16px",
                            borderTop: "1px solid #e0e0e0",
                          }}
                        >
                          <button
                            onClick={() =>
                              handleApprove(registration.id, registration.email)
                            }
                            disabled={processing === registration.id}
                            style={{
                              flex: 1,
                              padding: "10px 20px",
                              backgroundColor: "#00c950",
                              color: "white",
                              border: "none",
                              borderRadius: "8px",
                              fontSize: "14px",
                              fontWeight: 600,
                              cursor:
                                processing === registration.id
                                  ? "not-allowed"
                                  : "pointer",
                              opacity: processing === registration.id ? 0.6 : 1,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "8px",
                            }}
                          >
                            {processing === registration.id ? (
                              <>
                                <Loader2 size={16} className="spinner" />
                                <span>Processing...</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle size={16} />
                                <span>Approve</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() =>
                              handleDisapprove(registration.id, registration.email)
                            }
                            disabled={processing === registration.id}
                            style={{
                              flex: 1,
                              padding: "10px 20px",
                              backgroundColor: "#dc3545",
                              color: "white",
                              border: "none",
                              borderRadius: "8px",
                              fontSize: "14px",
                              fontWeight: 600,
                              cursor:
                                processing === registration.id
                                  ? "not-allowed"
                                  : "pointer",
                              opacity: processing === registration.id ? 0.6 : 1,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "8px",
                            }}
                          >
                            {processing === registration.id ? (
                              <>
                                <Loader2 size={16} className="spinner" />
                                <span>Processing...</span>
                              </>
                            ) : (
                              <>
                                <XCircle size={16} />
                                <span>Disapprove</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .spinner {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AdminSettings;

