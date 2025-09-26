function FileViewer({ files }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {files.map((f, idx) => (
        <div key={idx} style={{
          background: '#1a1a1a',
          borderRadius: '8px',
          padding: '16px',
          border: '1px solid #333',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '16px',
              height: '16px',
              background: '#4F46E5',
              borderRadius: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              color: '#ffffff'
            }}>
              📄
            </div>
            <span style={{
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {f.input.filename || f.tool}
            </span>
          </div>
          <pre style={{
            background: '#0a0a0a',
            padding: '12px',
            borderRadius: '6px',
            overflowX: 'auto',
            fontSize: '13px',
            lineHeight: '1.4',
            color: '#e0e0e0',
            border: '1px solid #333',
            margin: 0,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>
            {f.input.content || f.output}
          </pre>
        </div>
      ))}
    </div>
  );
}

export default FileViewer;