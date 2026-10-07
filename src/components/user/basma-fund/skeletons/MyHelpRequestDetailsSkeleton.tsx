const MyHelpRequestDetailsSkeleton = () => {
  return (
    <>
      <div
        className="my-hrd-skel"
        style={{
          height: '180px',
          borderRadius: '22px',
          marginBottom: '1.25rem',
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div
          className="my-hrd-skel"
          style={{ height: '140px', borderRadius: '14px' }}
        />
        <div
          className="my-hrd-skel"
          style={{ height: '110px', borderRadius: '14px' }}
        />
        <div
          className="my-hrd-skel"
          style={{ height: '200px', borderRadius: '14px' }}
        />
      </div>

      <style>{`
        .my-hrd-skel {
          background-color: var(--border-color);
          animation: myHrdPulse 1.5s ease-in-out infinite;
        }
        @keyframes myHrdPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.85; }
        }
      `}</style>
    </>
  );
};

export default MyHelpRequestDetailsSkeleton;