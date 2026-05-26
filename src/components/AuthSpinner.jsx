export const AuthSpinner = ({ label = 'Checking session...' }) => (
  <div className="auth-loading-screen">
    <div className="auth-spinner" aria-hidden="true" />
    <p>{label}</p>
  </div>
);
