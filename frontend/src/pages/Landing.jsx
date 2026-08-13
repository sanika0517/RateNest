import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const Landing = () => (
    <Layout>
        <section className="landing">
            <div className="landing-copy">
                <p className="landing-eyebrow">Your local guide</p>
                <h1>Discover. Rate.<br /><span>Choose better.</span></h1>
                <p className="landing-text">
                    RateNest makes it easy to find great stores and share the experiences that help others decide.
                </p>
                <div className="landing-actions">
                    <Link to="/register" className="btn-primary">Create an account</Link>
                    <Link to="/login" className="btn-secondary">Log in</Link>
                </div>
                <Link to="/login" className="landing-discover">Already a member? Sign in to discover stores →</Link>
            </div>
            <div className="landing-panel" aria-hidden="true">
                <div className="landing-rating-card">
                    <span className="landing-store-mark">R</span>
                    <div><strong>Rated by people like you</strong><p>Clear, useful local reviews.</p></div>
                    <span className="landing-stars">★★★★★</span>
                </div>
            </div>
        </section>
    </Layout>
);

export default Landing;
