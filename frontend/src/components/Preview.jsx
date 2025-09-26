function Preview({ url }) {
  return (
    <div style={{
      width: '100%',
      background: '#1a1a1a',
      borderRadius: '12px',
      border: '1px solid #333',
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
    }}>
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #333',
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: '#ff5f57'
        }}></div>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: '#ffbd2e'
        }}></div>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: '#28ca42'
        }}></div>
        <div style={{
          flex: 1,
          height: '1px',
          background: '#333',
          margin: '0 16px'
        }}></div>
        <span style={{ color: '#a0a0a0', fontSize: '12px' }}>localhost:5000</span>
      </div>
      <iframe
        src={url}
        title="Live Preview"
        style={{
          width: "100%",
          height: "600px",
          border: "none",
          background: "#ffffff"
        }}
      />
    </div>
  );
}

export default Preview;