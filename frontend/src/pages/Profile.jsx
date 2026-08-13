import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import { ROLE_LABELS } from "../utils/validation";

const Profile = () => {
    const { user } = useAuth();

    return (
        <Layout showHero heroTitle="Your Profile" heroSubtitle="Your RateNest account details">
            <section className="page-card profile-card">
                <div className="profile-avatar">{user.name.charAt(0).toUpperCase()}</div>
                <div className="profile-details">
                    <h2>{user.name}</h2>
                    <p className="text-muted">{ROLE_LABELS[user.role]}</p>
                    <dl>
                        <div><dt>Email</dt><dd>{user.email}</dd></div>
                        <div><dt>Address</dt><dd>{user.address}</dd></div>
                        <div><dt>Role</dt><dd>{ROLE_LABELS[user.role]}</dd></div>
                    </dl>
                </div>
            </section>
        </Layout>
    );
};

export default Profile;
