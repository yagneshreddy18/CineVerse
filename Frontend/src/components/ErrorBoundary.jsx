import React from "react";
import { authApi } from "../services/movieService.js";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  resetApp = () => {
    authApi.resetDemoData();
    window.location.href = "/login";
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main className="page">
        <section className="empty-state">
          <p className="eyebrow">Recovery</p>
          <h1>CineVerse needs a quick reset</h1>
          <p>The local demo data in this browser is out of date. Resetting it will restore the seeded users, movies, shows, and bookings.</p>
          <button className="btn btn-primary" onClick={this.resetApp}>Reset Demo Data</button>
        </section>
      </main>
    );
  }
}
