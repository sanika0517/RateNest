import Header from "./Header";

const Layout = ({ children, showHero = false, heroTitle, heroSubtitle }) => (
    <div className="app">
        <Header />
        {showHero && (
            <section className="hero-banner">
                <div className="hero-content">
                    {heroTitle && <h1 className="hero-title">{heroTitle}</h1>}
                    {heroSubtitle && <p className="hero-subtitle">{heroSubtitle}</p>}
                </div>
            </section>
        )}
        <main className={`main-content ${showHero ? "with-hero" : "no-hero"}`}>
            {children}
        </main>
        <footer className="site-footer">
            <p>RateNest &copy; {new Date().getFullYear()} — Rate. Review. Discover.</p>
        </footer>
    </div>
);

export default Layout;
