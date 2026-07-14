import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function ComplaintDetail() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchComplaint = async () => {
    try {
      const { data } = await api.get(`/complaints/${id}`);
      setComplaint(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load complaint");
    }
  };

  useEffect(() => {
    fetchComplaint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleStatusChange = async (status) => {
    try {
      await api.put(`/complaints/${id}/status`, { status });
      fetchComplaint();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await api.post(`/complaints/${id}/comments`, { message: comment });
      setComment("");
      fetchComplaint();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add comment");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;
    try {
      await api.delete(`/complaints/${id}`);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete complaint");
    }
  };

  if (error) return <div className="container"><p className="error-text">{error}</p></div>;
  if (!complaint) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>{complaint.title}</h2>
          <span className={`status-badge status-${complaint.status.replace(" ", "-")}`}>
            {complaint.status}
          </span>
        </div>
        <p style={{ marginTop: 12, color: "#6b7280" }}>
          Category: {complaint.category} | Priority: {complaint.priority}
        </p>
        <p style={{ marginTop: 12, lineHeight: 1.6 }}>{complaint.description}</p>
        <p style={{ marginTop: 12, fontSize: "0.9rem", color: "#6b7280" }}>
          Submitted by {complaint.complainant?.name} on{" "}
          {new Date(complaint.createdAt).toLocaleString()}
        </p>
        {complaint.assignedAgent && (
          <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>
            Assigned Agent: {complaint.assignedAgent.name}
          </p>
        )}
        {complaint.resolutionNote && (
          <p style={{ marginTop: 10 }}>
            <strong>Resolution Note:</strong> {complaint.resolutionNote}
          </p>
        )}

        {(user.role === "agent" || user.role === "admin") && (
          <div style={{ marginTop: 16 }}>
            <label>Update Status: </label>
            <select
              value={complaint.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              style={{ marginLeft: 8, padding: 6 }}
            >
              <option>Open</option>
              <option>In Progress</option>
              <option>Resolved</option>
              <option>Closed</option>
              <option>Rejected</option>
            </select>
          </div>
        )}

        {(user.role === "admin" || complaint.complainant?._id === user.id) && (
          <button className="btn btn-danger" style={{ marginTop: 16 }} onClick={handleDelete}>
            Delete Complaint
          </button>
        )}
      </div>

      <div className="card">
        <h3>Comments / Updates</h3>
        <div style={{ marginTop: 12 }}>
          {complaint.comments.length === 0 && <p>No comments yet.</p>}
          {complaint.comments.map((c, idx) => (
            <div key={idx} style={{ borderBottom: "1px solid #e5e7eb", padding: "10px 0" }}>
              <strong>{c.author?.name || "User"}</strong>{" "}
              <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>
                {new Date(c.createdAt).toLocaleString()}
              </span>
              <p>{c.message}</p>
            </div>
          ))}
        </div>
        <form onSubmit={handleAddComment} style={{ marginTop: 14 }}>
          <div className="form-group">
            <textarea
              rows="3"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <button type="submit" className="btn">Post Comment</button>
        </form>
      </div>
    </div>
  );
}
