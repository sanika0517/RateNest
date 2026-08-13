import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import DataTable from "../../components/DataTable";
import api from "../../services/api";

const OwnerDashboard = () => {
    const [data, setData] = useState(null);
    const [storeRequest, setStoreRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sortField, setSortField] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");
    const [requestForm, setRequestForm] = useState({ name: "", email: "", address: "" });
    const [requestMessage, setRequestMessage] = useState("");
    const [requestError, setRequestError] = useState("");
    const [submittingRequest, setSubmittingRequest] = useState(false);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const [{ data: dashboard }, { data: request }] = await Promise.all([api.get("/owner/dashboard"), api.get("/owner/store-request")]);
                setData(dashboard);
                setStoreRequest(request.request);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    const submitStoreRequest = async (event) => {
        event.preventDefault();
        setRequestError("");
        setRequestMessage("");
        if (!requestForm.name.trim() || !requestForm.email.trim() || !requestForm.address.trim()) {
            setRequestError("Please provide your store name, email, and address.");
            return;
        }
        try {
            setSubmittingRequest(true);
            const { data: response } = await api.post("/owner/store-request", requestForm);
            setStoreRequest(response.request);
            setRequestMessage(response.message);
        } catch (err) {
            setRequestError(err.response?.data?.message || "Unable to submit your store request.");
        } finally {
            setSubmittingRequest(false);
        }
    };

    const columns = [
        { key: "name", label: "Name", sortable: true },
        { key: "email", label: "Email", sortable: true },
        { key: "address", label: "Address", sortable: true },
        { key: "store_name", label: "Store", sortable: true },
        { key: "rating", label: "Rating", sortable: true, render: (row) => `${row.rating} / 5` },
    ];
    const sortedRaters = [...(data?.raters || [])].sort((a, b) => String(a[sortField] || "").localeCompare(String(b[sortField] || "")) * (sortOrder === "asc" ? 1 : -1));

    const requestPanel = (
        <div className="request-owner-panel page-card">
            <p className="auth-kicker auth-kicker-dark">STORE SETUP</p>
            <h2>{storeRequest ? "Your store request" : "Request your store"}</h2>
            {requestMessage && <div className="alert alert-success">{requestMessage}</div>}
            {requestError && <div className="alert alert-error">{requestError}</div>}
            {storeRequest ? <div className="owner-request-status">
                <span className={`request-status status-${storeRequest.status.toLowerCase()}`}>{storeRequest.status.replace("_", " ")}</span>
                <h3>{storeRequest.name}</h3><p>{storeRequest.address}</p><p className="text-muted">{storeRequest.email}</p>
                <p className="request-status-copy">{storeRequest.status === "PENDING" ? "Your request is waiting for an administrator review." : storeRequest.status === "IN_PROGRESS" ? "An administrator is reviewing your store request." : "This request was not approved. Contact an administrator for the next steps."}</p>
                {storeRequest.admin_note && <p className="request-note">Admin note: {storeRequest.admin_note}</p>}
            </div> : <form className="auth-form request-form" onSubmit={submitStoreRequest}>
                <p className="auth-subtitle">Send your store details to the administrator for approval.</p>
                <input className="form-input" placeholder="Store name" value={requestForm.name} onChange={(e) => setRequestForm({ ...requestForm, name: e.target.value })} />
                <input className="form-input" type="email" placeholder="Store email" value={requestForm.email} onChange={(e) => setRequestForm({ ...requestForm, email: e.target.value })} />
                <textarea className="form-input form-textarea" placeholder="Store address" value={requestForm.address} onChange={(e) => setRequestForm({ ...requestForm, address: e.target.value })} />
                <button type="submit" className="btn-primary" disabled={submittingRequest}>{submittingRequest ? "Submitting..." : "Submit Store Request"}</button>
            </form>}
        </div>
    );

    return <Layout showHero heroTitle="Store Owner Dashboard" heroSubtitle="Monitor your store performance">
        {loading ? <div className="page-card"><p className="loading-text">Loading your dashboard...</p></div> : !data?.store ? requestPanel : <>
            <div className="owner-store-info page-card"><h2>{data.stores?.length > 1 ? "Your Stores" : data.store.name}</h2>{data.stores?.map((store) => <div key={store.id} className="owner-store-row"><strong>{store.name}</strong><span>{store.address}</span><span className="text-muted">{store.email}</span></div>)}</div>
            <div className="stats-grid stats-grid-2"><div className="stat-card stat-card-highlight"><span className="stat-icon">★</span><div><p className="stat-value">{data.averageRating || "—"}</p><p className="stat-label">Average Rating</p></div></div><div className="stat-card"><span className="stat-icon">✓</span><div><p className="stat-value">{data.totalRatings}</p><p className="stat-label">Total Ratings</p></div></div></div>
            <div className="page-card flush dashboard-table"><h3 className="section-title">Users Who Rated Your Store{data.stores?.length > 1 ? "s" : ""}</h3><DataTable columns={columns} data={sortedRaters} sortField={sortField} sortOrder={sortOrder} onSort={(field, order) => { setSortField(field); setSortOrder(order); }} emptyMessage="No ratings submitted yet." /></div>
        </>}
    </Layout>;
};

export default OwnerDashboard;
