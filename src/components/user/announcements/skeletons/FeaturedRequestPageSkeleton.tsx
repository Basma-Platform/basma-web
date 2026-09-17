import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';

const FeaturedRequestPageSkeleton = () => {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-body)',
        minHeight: '100vh',
        paddingTop: '4.5rem',
        paddingBottom: '3rem',
        overflowX: 'hidden',
        width: '100%',
        boxSizing: 'border-box',
      }}
      dir="rtl"
    >
      <Container
        fluid
        style={{
          paddingLeft: '12px',
          paddingRight: '12px',
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            maxWidth: '850px',
            margin: '0 auto',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {/* Header Skeleton */}
          <div style={{ marginBottom: '1.25rem', width: '100%' }}>
            <div
              style={{
                width: '180px',
                height: '12px',
                backgroundColor: 'var(--border-color)',
                borderRadius: '4px',
                marginBottom: '10px',
                opacity: 0.6,
              }}
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: 'var(--bg-card)',
                padding: '0.85rem 1rem',
                borderRadius: '14px',
                border: '1px solid var(--border-color)',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--border-color)',
                  opacity: 0.6,
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    width: '140px',
                    height: '16px',
                    backgroundColor: 'var(--border-color)',
                    borderRadius: '4px',
                    marginBottom: '6px',
                    opacity: 0.6,
                  }}
                />
                <div
                  style={{
                    width: '220px',
                    height: '10px',
                    backgroundColor: 'var(--border-color)',
                    borderRadius: '4px',
                    opacity: 0.4,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Form Content Card Skeleton */}
          <motion.div
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 0.8, repeatType: 'reverse' }}
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {/* Announcement Summary Box Skeleton */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '14px',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--border-color)',
                  opacity: 0.5,
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    width: '90px',
                    height: '10px',
                    backgroundColor: 'var(--border-color)',
                    borderRadius: '4px',
                    marginBottom: '6px',
                    opacity: 0.5,
                  }}
                />
                <div
                  style={{
                    width: '180px',
                    height: '14px',
                    backgroundColor: 'var(--border-color)',
                    borderRadius: '4px',
                    opacity: 0.5,
                  }}
                />
              </div>
            </div>

            {/* Section 1: Pricing Grid Skeleton */}
            <div>
              <div
                style={{
                  width: '130px',
                  height: '14px',
                  backgroundColor: 'var(--border-color)',
                  borderRadius: '4px',
                  marginBottom: '10px',
                  opacity: 0.6,
                }}
              />
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                }}
              >
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      height: '75px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      opacity: 0.5,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Section 2: Payment Methods Skeleton */}
            <div>
              <div
                style={{
                  width: '140px',
                  height: '14px',
                  backgroundColor: 'var(--border-color)',
                  borderRadius: '4px',
                  marginBottom: '10px',
                  opacity: 0.6,
                }}
              />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      height: '60px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      opacity: 0.5,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Section 3: Upload Box Skeleton */}
            <div>
              <div
                style={{
                  width: '120px',
                  height: '14px',
                  backgroundColor: 'var(--border-color)',
                  borderRadius: '4px',
                  marginBottom: '10px',
                  opacity: 0.6,
                }}
              />
              <div
                style={{
                  height: '110px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-input)',
                  border: '2px dashed var(--border-color)',
                  opacity: 0.5,
                }}
              />
            </div>

            {/* Submit Action Button Skeleton */}
            <div
              style={{
                height: '44px',
                borderRadius: '10px',
                backgroundColor: 'var(--border-color)',
                opacity: 0.5,
                marginTop: '10px',
              }}
            />
          </motion.div>
        </div>
      </Container>
    </div>
  );
};

export default FeaturedRequestPageSkeleton;