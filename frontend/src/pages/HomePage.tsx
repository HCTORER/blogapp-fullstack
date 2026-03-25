export default function HomePage() {
  return (
    <section className="page-section">
      {/* HERO */}
      <div className="home-hero">
        <h1>Building Real-World Full Stack Applications</h1>

        <p>
          This blog showcases how I designed and developed a production-ready
          blog platform using React, TypeScript, ASP.NET Core, and modern
          software architecture principles.
        </p>
      </div>

      {/* TECH STACK */}
      <div className="home-section">
        <h2>Technologies & Tools</h2>

        <div className="tech-grid">
          <span>React</span>
          <span>TypeScript</span>
          <span>Vite</span>
          <span>React Router DOM</span>
          <span>ASP.NET Core</span>
          <span>Entity Framework</span>
          <span>JWT Authentication</span>
          <span>REST API</span>
          <span>SQLite</span>
        </div>
      </div>

      {/* PROJECT HIGHLIGHTS */}
      <div className="home-section">
        <h2>What I Built</h2>

        <div className="feature-list">
          <div className="feature-item">
            <h3>🔐 Authentication System</h3>
            <p>
              Implemented secure login using JWT authentication and protected
              routes for admin-only features.
            </p>
          </div>

          <div className="feature-item">
            <h3>🧠 Clean Architecture</h3>
            <p>
              Designed backend using layered architecture (Controller, Service,
              Data Access) for scalability and maintainability.
            </p>
          </div>

          <div className="feature-item">
            <h3>📦 RESTful API</h3>
            <p>
              Built a fully functional REST API with pagination, filtering, and
              CRUD operations.
            </p>
          </div>

          <div className="feature-item">
            <h3>🖥️ Admin Dashboard</h3>
            <p>
              Created a protected admin panel for managing posts and categories
              dynamically.
            </p>
          </div>

          <div className="feature-item">
            <h3>⚡ Modern Frontend</h3>
            <p>
              Developed a scalable frontend architecture using React,
              TypeScript, and reusable components.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
