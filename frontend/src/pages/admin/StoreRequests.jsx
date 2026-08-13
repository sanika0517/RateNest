import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../services/api";

const StoreRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    const fetchRequests = async () => {
        try {
            const { data } = await api.get("/admin/store-requests");
            setRequests(data.requests || []);
        } catch (err) {
            setError(err.response?.data?.message || "Unable to load store requests.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = window.setTimeout(fetchRequests, 0);
        return () => window.clearTimeout(timer);
    }, []);

    const updateRequest = async (id, status) => {
        try {
            setUpdatingId(id);
            await api.put(`/admin/store-requests/${id}`, { status });
            setLoading(true);
            await fetchRequests();
        } catch (err) {
            setError(err.response?.data?.message || "Unable to update this request.");
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <Layout showHero heroTitle="Store Requests" heroSubtitle="Review and approve owner store requests">
            {error && <div className="alert alert-error">{error}</div>}
            {loading ? <div className="page-card"><p className="loading-text">Loading store requests...</p></div> : (
                <div className="request-list">
                    {requests.length === 0 ? <div className="state-message state-empty"><div><p className="state-title">No store requests</p><p className="state-desc">New owner requests will appear here.</p></div></div> : requests.map((request) => (
                        <article className="request-card" key={request.id}>
                            <div className="request-card-main">
                                <div className="request-card-top"><div><h2>{request.name}</h2><p>{request.address}</p></div><span className={`request-status status-${request.status.toLowerCase()}`}>{request.status.replace("_", " ")}</span></div>
                                <div className="request-meta"><span>{request.email}</span><span>Requested by {request.owner_name} ({request.owner_email})</span></div>
                                {request.admin_note && <p className="request-note">Admin note: {request.admin_note}</p>}
                            </div>
                            {request.status !== "APPROVED" && <div className="request-actions">
                                <button type="button" className="btn-secondary btn-sm" disabled={updatingId === request.id} onClick={() => updateRequest(request.id, "IN_PROGRESS")}>Mark In Progress</button>
                                <button type="button" className="btn-primary btn-sm" disabled={updatingId === request.id} onClick={() => updateRequest(request.id, "APPROVED")}>Approve & Create Store</button>
                                <button type="button" className="btn-request-reject" disabled={updatingId === request.id} onClick={() => updateRequest(request.id, "REJECTED")}>Reject</button>
                            </div>}
                        </article>
                    ))}
                </div>
            )}
        </Layout>
    );
};

export default StoreRequests;
