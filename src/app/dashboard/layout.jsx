export default function DashboardLayout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          width: "250px",
          background: "red",
          color: "white",
          padding: "20px",
        }}
      >
        TEST SIDEBAR
      </div>

      <div>{children}</div>
    </div>
  );
}